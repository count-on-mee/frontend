import React, { useState, useRef, useEffect, useCallback } from 'react';
import { componentStyles, styleUtils } from '../../../utils/style';
import { useSocketDebounce } from '../../../utils/debounce';
import clsx from 'clsx';

const TodoList = ({ tasks, socket, tripId }) => {
  const debouncedSocketEmit = useSocketDebounce(socket, 800);

  const [newTask, setNewTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [localTasks, setLocalTasks] = useState(tasks || []);
  const inputRef = useRef(null);

  useEffect(() => {
    setLocalTasks(tasks || []);
  }, [tasks]);

  useEffect(() => {
    if (!socket) return;

    const handleTaskUpdated = ({ tripDocumentTaskId, taskFields }) => {
      setLocalTasks((prev) =>
        prev.map((task) =>
          task.tripDocumentTaskId === tripDocumentTaskId
            ? { ...task, ...taskFields }
            : task,
        ),
      );
    };

    const handleTaskAdded = (newTask) => {
      setLocalTasks((prev) => {
        // 임시 task (tripDocumentTaskId가 null인 task)를 찾아서 실제 task로 교체
        const hasTempTask = prev.some(
          (task) => task.tripDocumentTaskId === null,
        );
        if (hasTempTask) {
          // 임시 task를 제거하고 새 task 추가
          return prev
            .filter((task) => task.tripDocumentTaskId !== null)
            .concat(newTask);
        } else {
          // 임시 task가 없으면 그냥 새 task 추가
          return [...prev, newTask];
        }
      });
    };

    const handleTaskDeleted = ({ tripDocumentTaskId }) => {
      setLocalTasks((prev) =>
        prev.filter((task) => task.tripDocumentTaskId !== tripDocumentTaskId),
      );
      setSelectedTask(null);
    };

    const handleError = ({ message }) => {
      console.error('Task 에러:', message);

      alert(`Task 작업 중 오류가 발생했습니다: ${message}`);
    };

    socket.on('taskUpdated', handleTaskUpdated);
    socket.on('taskAdded', handleTaskAdded);
    socket.on('taskDeleted', handleTaskDeleted);
    socket.on('error', handleError);

    return () => {
      socket.off('taskUpdated', handleTaskUpdated);
      socket.off('taskAdded', handleTaskAdded);
      socket.off('taskDeleted', handleTaskDeleted);
      socket.off('error', handleError);
    };
  }, [socket]);

  const handleInputChange = (index, value) => {
    const updatedTask = { ...localTasks[index], task: value };
    setLocalTasks((prev) =>
      prev.map((task, i) => (i === index ? updatedTask : task)),
    );

    debouncedSocketEmit('updateTask', {
      tripDocumentTaskId: localTasks[index].tripDocumentTaskId,
      taskFields: { task: value },
    });
  };

  const handleNewTaskInputChange = (value) => {
    setNewTask((prev) => ({ ...prev, task: value }));
  };

  const addTask = () => {
    setNewTask({ id: Date.now(), task: '', isCompleted: false });
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const confirmNewTask = () => {
    if (newTask && newTask.task.trim()) {
      const taskData = {
        task: newTask.task.trim(),
        isCompleted: false,
      };

      const tempTask = {
        id: Date.now(),
        task: newTask.task.trim(),
        isCompleted: false,
        tripDocumentTaskId: null, // 서버에서 생성될 ID
      };
      setLocalTasks((prev) => [...prev, tempTask]);
      setNewTask(null);

      debouncedSocketEmit('addTask', { taskData });
    }
  };

  const deleteTask = (index) => {
    const taskToDelete = localTasks[index];

    setLocalTasks((prev) => prev.filter((_, i) => i !== index));
    setSelectedTask(null);

    if (taskToDelete.tripDocumentTaskId) {
      debouncedSocketEmit('deleteTask', {
        tripDocumentTaskId: taskToDelete.tripDocumentTaskId,
      });
    }
  };

  const toggleTask = (index) => {
    const updatedTask = {
      ...localTasks[index],
      isCompleted: !localTasks[index].isCompleted,
    };
    setLocalTasks((prev) =>
      prev.map((task, i) => (i === index ? updatedTask : task)),
    );

    debouncedSocketEmit('updateTask', {
      tripDocumentTaskId: localTasks[index].tripDocumentTaskId,
      taskFields: { isCompleted: !localTasks[index].isCompleted },
    });
  };

  const handleTaskClick = (index) => {
    setSelectedTask(selectedTask === index ? null : index);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newTask && newTask.task.trim()) {
      confirmNewTask();
    }
  };

  const handleInputFocus = () => {
    if (!newTask) {
      addTask();
    }
  };

  const renderTask = (task, index, isNewTask = false) => {
    const validTask = isNewTask
      ? newTask
      : task || { id: Date.now(), task: '', isCompleted: false };

    return (
      <div
        key={validTask.tripDocumentTaskId || validTask.id || index}
        className={clsx(
          'flex items-center justify-between p-3 mb-2 rounded-full transition-all duration-200',
          selectedTask === index
            ? 'shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]'
            : 'shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]',
          isNewTask && 'border-2 border-[var(--color-primary)]',
        )}
        onClick={() => !isNewTask && handleTaskClick(index)}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <input
              type="checkbox"
              checked={isNewTask ? false : validTask.isCompleted}
              onChange={(e) => {
                e.stopPropagation();
                if (!isNewTask) {
                  toggleTask(index);
                }
              }}
              className="w-5 h-5 rounded-full border-2 border-[var(--color-primary)] appearance-none checked:bg-[var(--color-primary)] checked:border-[var(--color-primary)] transition-all duration-200 shadow-[inset_2px_2px_4px_#b8b8b8,inset_-2px_-2px_4px_#ffffff]"
            />
          </div>
          <input
            type="text"
            value={isNewTask ? newTask?.task || '' : validTask.task || ''}
            onChange={(e) => {
              e.stopPropagation();
              if (isNewTask) {
                handleNewTaskInputChange(e.target.value);
              } else {
                handleInputChange(index, e.target.value);
              }
            }}
            onKeyPress={handleKeyPress}
            ref={isNewTask ? inputRef : undefined}
            className={clsx(
              'flex-1 bg-transparent border-none focus:outline-none text-[var(--color-text)]',
              validTask.isCompleted && 'line-through text-gray-400',
            )}
            placeholder="할 일 입력"
          />
        </div>
        {!isNewTask && selectedTask === index && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(index);
            }}
            className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (newTask && inputRef.current) {
      inputRef.current.focus();
    }
  }, [newTask]);

  return (
    <div className="bg-[var(--color-background-gray)] font-prompt p-6 rounded-lg shadow-[4px_4px_8px_#b8b8b8,-4px_-4px_8px_#ffffff]">
      <div className="space-y-2">
        {localTasks.map((task, index) => renderTask(task, index))}
        {newTask && renderTask(newTask, localTasks.length, true)}

        {!newTask && (
          <button
            onClick={addTask}
            className="flex items-center gap-3 p-3 w-full rounded-full shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff] hover:rounded-full transition-all duration-200 cursor-pointer border-none "
          >
            <div className="w-5 h-5 rounded-full border-2 border-[var(--color-primary)] flex items-center justify-center">
              <span className="text-[var(--color-primary)] text-sm">+</span>
            </div>
            <span className="text-[var(--color-primary)] font-medium">
              새 할 일 추가
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoList;
