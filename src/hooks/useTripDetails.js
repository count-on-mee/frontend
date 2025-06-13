import { useState, useEffect } from 'react';
import useSocket from './useSocket';
import axiosInstance from '../utils/axiosInstance';

// 백엔드 배열 데이터를 프론트엔드 객체 형태로 변환하는 함수
const transformExpensesToObject = (expensesArray) => {
  if (!Array.isArray(expensesArray)) {
    return {
      transportation: [{ tripDocumentExpenseId: null, type: '', amount: '' }],
      accommodation: [{ tripDocumentExpenseId: null, type: '', amount: '' }],
      food: [{ tripDocumentExpenseId: null, name: '', amount: '' }],
      etc: [{ tripDocumentExpenseId: null, name: '', amount: '' }],
    };
  }

  const transformed = {
    transportation: [],
    accommodation: [],
    food: [],
    etc: [],
  };

  expensesArray.forEach((expense) => {
    const expenseData = {
      tripDocumentExpenseId: expense.tripDocumentExpenseId,
      amount: expense.amount ? expense.amount.toLocaleString() : '',
    };

    switch (expense.type) {
      case 'transportation':
        expenseData.type = expense.detail || '';
        transformed.transportation.push(expenseData);
        break;
      case 'accommodation':
        expenseData.type = expense.detail || '';
        transformed.accommodation.push(expenseData);
        break;
      case 'meal':
        expenseData.name = expense.detail || '';
        transformed.food.push(expenseData);
        break;
      case 'other':
        expenseData.name = expense.detail || '';
        transformed.etc.push(expenseData);
        break;
      default:
        expenseData.name = expense.detail || '';
        transformed.etc.push(expenseData);
    }
  });

  // 각 카테고리에 기본 행이 없으면 추가 (tripDocumentExpenseId가 null인 기본 행)
  if (transformed.transportation.length === 0) {
    transformed.transportation.push({
      tripDocumentExpenseId: null,
      type: '',
      amount: '',
    });
  }
  if (transformed.accommodation.length === 0) {
    transformed.accommodation.push({
      tripDocumentExpenseId: null,
      type: '',
      amount: '',
    });
  }
  if (transformed.food.length === 0) {
    transformed.food.push({
      tripDocumentExpenseId: null,
      name: '',
      amount: '',
    });
  }
  if (transformed.etc.length === 0) {
    transformed.etc.push({ tripDocumentExpenseId: null, name: '', amount: '' });
  }

  return transformed;
};

const useTripDetails = (tripId) => {
  const {
    socket,
    isConnected,
    isConnecting,
    error: socketError,
  } = useSocket(tripId);

  const [expenses, setExpenses] = useState({
    transportation: [
      { tripDocumentExpenseId: null, type: '수단명', amount: '' },
    ],
    accommodation: [
      { tripDocumentExpenseId: null, type: '숙소명', amount: '' },
    ],
    food: [{ tripDocumentExpenseId: null, name: '', amount: '' }],
    etc: [{ tripDocumentExpenseId: null, name: '', amount: '' }],
  });
  const [accommodations, setAccommodations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [participantCount, setParticipantCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 데이터 로드 함수
  const fetchTripData = async () => {
    if (!tripId) return;

    setLoading(true);
    setError(null);

    try {
      // 단일 엔드포인트에서 모든 데이터를 가져오기
      const response = await axiosInstance.get(`/trips/${tripId}/documents`);

      // expenses 데이터를 객체 형태로 변환
      const transformedExpenses = transformExpensesToObject(
        response.data.expenses || [],
      );

      setExpenses(transformedExpenses);
      setAccommodations(response.data.accommodations || []);
      setTasks(response.data.tasks || []);
      setParticipantCount(
        (response.data.document && response.data.document.participantCount) ||
          1,
      );
      setLoading(false);
    } catch (err) {
      console.error('여행 데이터 로드 실패:', err);
      setError(err);
      setLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchTripData();
  }, [tripId]);

  // 소켓 연결 상태 모니터링 - 연결이 복구되면 데이터 다시 로드
  useEffect(() => {
    if (isConnected && !loading) {
      // 소켓이 연결되면 최신 데이터를 다시 로드
      console.log('Socket connected, refetching data...');
      fetchTripData();
    }
  }, [isConnected]);

  // 소켓 연결 상태가 변경될 때마다 데이터 로드
  useEffect(() => {
    if (socket && isConnected) {
      console.log('Socket state changed, refetching data...');
      fetchTripData();
    }
  }, [socket, isConnected]);

  // 소켓 이벤트 리스너 설정
  useEffect(() => {
    if (!socket) return;

    // 비용 관련 이벤트
    const handleExpenseAdded = (newExpense) => {
      setExpenses((prev) => {
        const category =
          newExpense.type === 'meal'
            ? 'food'
            : newExpense.type === 'other'
              ? 'etc'
              : newExpense.type;

        // 카테고리별로 올바른 필드 사용
        const expenseData = {
          tripDocumentExpenseId: newExpense.tripDocumentExpenseId,
          amount: newExpense.amount ? newExpense.amount.toLocaleString() : '',
        };

        if (category === 'food' || category === 'etc') {
          // food와 etc는 name 필드를 사용
          expenseData.name = newExpense.detail || '';
        } else {
          // transportation과 accommodation는 type 필드를 사용
          expenseData.type = newExpense.detail || '';
        }

        return {
          ...prev,
          [category]: [...prev[category], expenseData],
        };
      });
    };

    const handleExpenseUpdated = ({ tripDocumentExpenseId, expenseFields }) => {
      setExpenses((prev) => {
        const updatedExpenses = { ...prev };

        Object.keys(updatedExpenses).forEach((category) => {
          updatedExpenses[category] = updatedExpenses[category].map(
            (expense) => {
              if (expense.tripDocumentExpenseId === tripDocumentExpenseId) {
                const updatedExpense = { ...expense };

                // 카테고리별로 올바른 필드 업데이트
                if (category === 'food' || category === 'etc') {
                  // food와 etc는 name 필드를 사용
                  updatedExpense.name = expenseFields.detail || expense.name;
                } else {
                  // transportation과 accommodation는 type 필드를 사용
                  updatedExpense.type = expenseFields.detail || expense.type;
                }

                // amount 업데이트
                if (expenseFields.amount !== undefined) {
                  updatedExpense.amount = expenseFields.amount
                    ? expenseFields.amount.toLocaleString()
                    : expense.amount;
                }

                return updatedExpense;
              }
              return expense;
            },
          );
        });

        return updatedExpenses;
      });
    };

    const handleExpenseDeleted = ({ tripDocumentExpenseId }) => {
      setExpenses((prev) => {
        const updatedExpenses = { ...prev };

        Object.keys(updatedExpenses).forEach((category) => {
          const filteredExpenses = updatedExpenses[category].filter(
            (expense) =>
              expense.tripDocumentExpenseId !== tripDocumentExpenseId,
          );

          // 각 카테고리에 최소 1개의 기본 행이 있도록 보장
          if (filteredExpenses.length === 0) {
            if (category === 'food' || category === 'etc') {
              filteredExpenses.push({
                tripDocumentExpenseId: null,
                name: '',
                amount: '',
              });
            } else {
              filteredExpenses.push({
                tripDocumentExpenseId: null,
                type: '',
                amount: '',
              });
            }
          }

          updatedExpenses[category] = filteredExpenses;
        });

        return updatedExpenses;
      });
    };

    // 숙소 관련 이벤트
    const handleAccommodationAdded = (newAccommodation) => {
      setAccommodations((prev) => [...prev, newAccommodation]);
    };

    const handleAccommodationUpdated = ({
      tripDocumentAccommodationId,
      accommodationFields,
    }) => {
      setAccommodations((prev) =>
        prev.map((accommodation) =>
          accommodation.tripDocumentAccommodationId ===
          tripDocumentAccommodationId
            ? { ...accommodation, ...accommodationFields }
            : accommodation,
        ),
      );
    };

    const handleAccommodationDeleted = ({ tripDocumentAccommodationId }) => {
      setAccommodations((prev) =>
        prev.filter(
          (accommodation) =>
            accommodation.tripDocumentAccommodationId !==
            tripDocumentAccommodationId,
        ),
      );
    };

    // 할 일 관련 이벤트
    const handleTaskAdded = (newTask) => {
      setTasks((prev) => [...prev, newTask]);
    };

    const handleTaskUpdated = ({ tripDocumentTaskId, taskFields }) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.tripDocumentTaskId === tripDocumentTaskId
            ? { ...task, ...taskFields }
            : task,
        ),
      );
    };

    const handleTaskDeleted = ({ tripDocumentTaskId }) => {
      setTasks((prev) =>
        prev.filter((task) => task.tripDocumentTaskId !== tripDocumentTaskId),
      );
    };

    // numberOfPeople 관련 이벤트
    const handleParticipantCountUpdated = ({ participantFields }) => {
      setParticipantCount(participantFields.count);
    };

    // 이벤트 리스너 등록
    socket.on('expenseAdded', handleExpenseAdded);
    socket.on('expenseUpdated', handleExpenseUpdated);
    socket.on('expenseDeleted', handleExpenseDeleted);

    socket.on('accommodationAdded', handleAccommodationAdded);
    socket.on('accommodationUpdated', handleAccommodationUpdated);
    socket.on('accommodationDeleted', handleAccommodationDeleted);

    socket.on('taskAdded', handleTaskAdded);
    socket.on('taskUpdated', handleTaskUpdated);
    socket.on('taskDeleted', handleTaskDeleted);

    socket.on('participantCountUpdated', handleParticipantCountUpdated);

    // 클린업 함수
    return () => {
      socket.off('expenseAdded', handleExpenseAdded);
      socket.off('expenseUpdated', handleExpenseUpdated);
      socket.off('expenseDeleted', handleExpenseDeleted);

      socket.off('accommodationAdded', handleAccommodationAdded);
      socket.off('accommodationUpdated', handleAccommodationUpdated);
      socket.off('accommodationDeleted', handleAccommodationDeleted);

      socket.off('taskAdded', handleTaskAdded);
      socket.off('taskUpdated', handleTaskUpdated);
      socket.off('taskDeleted', handleTaskDeleted);

      socket.off('participantCountUpdated', handleParticipantCountUpdated);
    };
  }, [socket]);

  return {
    expenses,
    accommodations,
    tasks,
    participantCount,
    loading,
    error,
    socket,
    isConnected,
    isConnecting,
    socketError,
    setExpenses,
    setAccommodations,
    setTasks,
    setParticipantCount,
    refetch: fetchTripData, // 수동으로 데이터를 다시 로드할 수 있는 함수
  };
};

export default useTripDetails;
