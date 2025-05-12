import React, { useState, useRef, useEffect } from 'react';
import { componentStyles, styleUtils } from '../../../utils/styles';
import clsx from 'clsx';

const TodoList = ({ todos, socket, tripId }) => {
  const [newTodo, setNewTodo] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [localTodos, setLocalTodos] = useState(todos || []);
  const inputRef = useRef(null);

  useEffect(() => {
    setLocalTodos(todos || []);
  }, [todos]);

  useEffect(() => {
    if (!socket) return;

    const handleTodoUpdated = (updatedTodo) => {
      setLocalTodos((prev) =>
        prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      );
    };

    const handleTodoAdded = (newTodo) => {
      setLocalTodos((prev) => [...prev, newTodo]);
    };

    const handleTodoDeleted = (todoId) => {
      setLocalTodos((prev) => prev.filter((todo) => todo.id !== todoId));
      setSelectedTodo(null);
    };

    socket.on('todoUpdated', handleTodoUpdated);
    socket.on('todoAdded', handleTodoAdded);
    socket.on('todoDeleted', handleTodoDeleted);

    return () => {
      socket.off('todoUpdated', handleTodoUpdated);
      socket.off('todoAdded', handleTodoAdded);
      socket.off('todoDeleted', handleTodoDeleted);
    };
  }, [socket]);

  const handleInputChange = (index, value) => {
    const updatedTodo = { ...localTodos[index], task: value };
    setLocalTodos((prev) =>
      prev.map((todo, i) => (i === index ? updatedTodo : todo)),
    );
    socket?.emit('todoUpdate', { tripId, todo: updatedTodo });
  };

  const handleNewTodoInputChange = (value) => {
    setNewTodo((prev) => ({ ...prev, task: value }));
  };

  const addTodo = () => {
    setNewTodo({ id: Date.now(), task: '', completed: false });
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const confirmNewTodo = () => {
    if (newTodo && newTodo.task.trim()) {
      const todoToAdd = {
        id: Date.now(),
        task: newTodo.task.trim(),
        completed: false,
      };
      setLocalTodos((prev) => [...prev, todoToAdd]);
      socket?.emit('todoAdd', { tripId, todo: todoToAdd });
      setNewTodo(null);
    }
  };

  const deleteTodo = (index) => {
    const todoToDelete = localTodos[index];
    setLocalTodos((prev) => prev.filter((_, i) => i !== index));
    socket?.emit('todoDelete', { tripId, todoId: todoToDelete.id });
    setSelectedTodo(null);
  };

  const toggleTodo = (index) => {
    const updatedTodo = {
      ...localTodos[index],
      completed: !localTodos[index].completed,
    };
    setLocalTodos((prev) =>
      prev.map((todo, i) => (i === index ? updatedTodo : todo)),
    );
    socket?.emit('todoUpdate', { tripId, todo: updatedTodo });
  };

  const handleTodoClick = (index) => {
    setSelectedTodo(selectedTodo === index ? null : index);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newTodo && newTodo.task.trim()) {
      confirmNewTodo();
    }
  };

  const handleInputFocus = () => {
    if (!newTodo) {
      addTodo();
    }
  };

  const renderTodo = (todo, index, isNewTodo = false) => {
    const validTodo = isNewTodo
      ? newTodo
      : todo || { id: Date.now(), task: '', completed: false };

    return (
      <div
        key={validTodo.id || index}
        className={clsx(
          'flex items-center justify-between p-3 mb-2 rounded-full transition-all duration-200',
          selectedTodo === index
            ? 'shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]'
            : 'shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]',
          isNewTodo && 'border-2 border-[var(--color-primary)]',
        )}
        onClick={() => !isNewTodo && handleTodoClick(index)}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <input
              type="checkbox"
              checked={isNewTodo ? false : validTodo.completed}
              onChange={(e) => {
                e.stopPropagation();
                if (!isNewTodo) {
                  toggleTodo(index);
                }
              }}
              className="w-5 h-5 rounded-full border-2 border-[var(--color-primary)] appearance-none checked:bg-[var(--color-primary)] checked:border-[var(--color-primary)] transition-all duration-200 shadow-[inset_2px_2px_4px_#b8b8b8,inset_-2px_-2px_4px_#ffffff]"
            />
          </div>
          <input
            type="text"
            value={isNewTodo ? newTodo?.task || '' : validTodo.task || ''}
            onChange={(e) => {
              e.stopPropagation();
              if (isNewTodo) {
                handleNewTodoInputChange(e.target.value);
              } else {
                handleInputChange(index, e.target.value);
              }
            }}
            onKeyPress={handleKeyPress}
            ref={isNewTodo ? inputRef : undefined}
            className={clsx(
              'flex-1 bg-transparent border-none focus:outline-none text-[var(--color-text)]',
              validTodo.completed && 'line-through text-gray-400',
            )}
            placeholder="할 일 입력"
          />
        </div>
        {!isNewTodo && selectedTodo === index && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteTodo(index);
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
    if (newTodo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [newTodo]);

  return (
    <div className="bg-[var(--color-background-gray)] font-prompt p-6 rounded-lg shadow-[4px_4px_8px_#b8b8b8,-4px_-4px_8px_#ffffff]">
      <div className="space-y-2">
        {localTodos.length === 0 && !newTodo && (
          <div
            className="flex items-center gap-3 p-3 mb-2 rounded-full shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff] hover:rounded-full transition-all duration-200 cursor-pointer"
            onClick={addTodo}
          >
            <div className="relative">
              <input
                type="checkbox"
                disabled
                className="w-5 h-5 rounded-full border-2 border-[var(--color-primary)] appearance-none shadow-[inset_2px_2px_4px_#b8b8b8,inset_-2px_-2px_4px_#ffffff]"
              />
            </div>
            <input
              type="text"
              onFocus={handleInputFocus}
              className="flex-1 bg-transparent border-none text-gray-400"
              placeholder="할 일을 추가하려면 클릭하세요"
              readOnly
            />
          </div>
        )}
        {localTodos.map((todo, index) => renderTodo(todo, index))}
        {newTodo && renderTodo(newTodo, localTodos.length, true)}
        <div className="mt-4">
          {newTodo ? (
            <button
              onClick={confirmNewTodo}
              className="w-full py-2 px-4 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors duration-200 flex items-center justify-center gap-2 shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]"
            >
              <span className="text-lg">✓</span> 완료
            </button>
          ) : (
            <button
              onClick={addTodo}
              className="w-full py-2 px-4 text-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary-light)] transition-colors duration-200 flex items-center justify-center gap-2 shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]"
            >
              <span className="text-lg">+</span> 할 일 추가
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
