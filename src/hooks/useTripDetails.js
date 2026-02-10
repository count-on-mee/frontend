import { useState, useEffect } from 'react';
import useSocket from './useSocket';
import axiosInstance from '../utils/axiosInstance';

const useTripDetails = (tripId) => {
  const {
    socket,
    isConnected,
    isConnecting,
    error: socketError,
  } = useSocket(tripId);

  const [expenses, setExpenses] = useState([]);
  const [statistics, setStatistics] = useState({
    shared: {
      totalBudget: 0,
      totalSpent: 0,
      remainingBudget: 0,
    },
    personal: {
      totalBudget: 0,
      totalSpent: 0,
      remainingBudget: 0,
    },
  });
  const [accommodations, setAccommodations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [participantCount, setParticipantCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTripData = async () => {
    if (!tripId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/trips/${tripId}/documents`);
      
      const tripStartDate = response.data.document?.startDate;
      const tripStartDateStr = tripStartDate 
        ? new Date(tripStartDate).toISOString().slice(0, 10)
        : null;
      
      const newExpenses = (response.data.expenses || []).map((expense) => {
        // 빈 값이나 null일 때는 1970-01-01로 설정 (준비 날짜)
        if (!expense.expenseDate || expense.expenseDate === '') {
          return {
            ...expense,
            expenseDate: '1970-01-01',
          };
        }
        
        if (tripStartDateStr && expense.expenseDate === tripStartDateStr) {
          if (expense.expenseCategory === 'BUDGET') {
            return {
              ...expense,
              expenseDate: '1970-01-01',
            };
          }
        }
        
        return expense;
      });
      const newStatistics = response.data.statistics || {
        shared: {
          totalBudget: 0,
          totalSpent: 0,
          remainingBudget: 0,
        },
        personal: {
          totalBudget: 0,
          totalSpent: 0,
          remainingBudget: 0,
        },
      };
      
      setExpenses(newExpenses);
      setStatistics(newStatistics);
      setAccommodations(response.data.accommodations || []);
      setTasks(response.data.tasks || []);
      setParticipantCount(
        (response.data.document && response.data.document.participantCount) ||
          1,
      );
      setLoading(false);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setError(err);
        setLoading(false);
      } else {
        setError(err);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTripData();
  }, [tripId]);

  useEffect(() => {
    if (isConnected && !loading) {
      fetchTripData();
    }
  }, [isConnected]);

  useEffect(() => {
    if (socket && isConnected) {
      fetchTripData();
    }
  }, [socket, isConnected]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleExpenseAdded = (data) => {
      const expenseType = data.expenseType;
      const isPersonal = expenseType === 'PERSONAL';
      const isBudget = data.expenseCategory === 'BUDGET';
      
      if (isPersonal && !isBudget) {
        return;
      }

      const normalizedExpenseDate = 
        !data.expenseDate || data.expenseDate === ''
          ? '1970-01-01' 
          : data.expenseDate;
      
      const newExpense = {
        tripDocumentExpenseId: data.tripDocumentExpenseId,
        payUserId: data.payUserId !== undefined ? data.payUserId : null,
        expenseCategory: data.expenseCategory,
        description: data.description,
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod,
        expenseDate: normalizedExpenseDate,
        expenseType: expenseType,
        participants: Array.isArray(data.participants) ? data.participants : [],
      };
      
      setExpenses((prev) => {
        const exists = prev.some(
          (exp) => exp.tripDocumentExpenseId === data.tripDocumentExpenseId
        );
        if (exists) {
          return prev;
        }
        return [...prev, newExpense];
      });
      
      if (isBudget && expenseType === 'SHARED') {
        setStatistics((prev) => {
          const newTotalBudget = (prev.shared?.totalBudget || 0) + data.totalAmount;
          const newRemainingBudget = newTotalBudget - (prev.shared?.totalSpent || 0);
          return {
            ...prev,
            shared: {
              ...prev.shared,
              totalBudget: newTotalBudget,
              remainingBudget: newRemainingBudget,
            },
          };
        });
      }
      
      setTimeout(() => {
        fetchTripData();
      }, isBudget ? 800 : 300);
    };

    const handleExpenseUpdated = (data) => {
      const expenseType = data.expenseFields?.expenseType || 'SHARED';
      const isPersonal = expenseType === 'PERSONAL';
      const isBudget = data.expenseFields?.expenseCategory === 'BUDGET';
      
      if (isPersonal && !isBudget) {
        return;
      }

      const expenseFields = data.expenseFields || {};
      
      const updatedFields = {};
      if (expenseFields.expenseCategory !== undefined) updatedFields.expenseCategory = expenseFields.expenseCategory;
      if (expenseFields.totalAmount !== undefined) updatedFields.totalAmount = expenseFields.totalAmount;
      if (expenseFields.description !== undefined) updatedFields.description = expenseFields.description;
      if (expenseFields.paymentMethod !== undefined) updatedFields.paymentMethod = expenseFields.paymentMethod;
      if (expenseFields.expenseDate !== undefined) {
        // 빈 값일 때는 1970-01-01로 설정 (준비 날짜)
        updatedFields.expenseDate = 
          !expenseFields.expenseDate || expenseFields.expenseDate === ''
            ? '1970-01-01' 
            : expenseFields.expenseDate;
      }
      if (expenseFields.expenseType !== undefined) updatedFields.expenseType = expenseFields.expenseType;
      if (expenseFields.payUserId !== undefined) updatedFields.payUserId = expenseFields.payUserId;
      if (expenseFields.participants !== undefined) updatedFields.participants = expenseFields.participants;

      setExpenses((prev) => {
        const existingExpense = prev.find(
          (exp) => exp.tripDocumentExpenseId === data.tripDocumentExpenseId
        );
        
        if (!existingExpense) {
          return prev;
        }
        
        const updatedExpense = {
          ...existingExpense,
          ...updatedFields,
        };
        
        if (isBudget && expenseType === 'SHARED') {
          const oldAmount = existingExpense.totalAmount || 0;
          const newAmount = updatedExpense.totalAmount || oldAmount;
          const diff = newAmount - oldAmount;
          
          if (diff !== 0) {
            setStatistics((statPrev) => {
              const newTotalBudget = (statPrev.shared?.totalBudget || 0) + diff;
              const newRemainingBudget = newTotalBudget - (statPrev.shared?.totalSpent || 0);
              return {
                ...statPrev,
                shared: {
                  ...statPrev.shared,
                  totalBudget: newTotalBudget,
                  remainingBudget: newRemainingBudget,
                },
              };
            });
          }
        }
        
        const updated = prev.map((expense) =>
          expense.tripDocumentExpenseId === data.tripDocumentExpenseId
            ? updatedExpense
            : expense,
        );
        return updated;
      });
      
      setTimeout(() => {
        fetchTripData();
      }, isBudget ? 800 : 300);
    };

    const handleExpenseDeleted = (data) => {
      setExpenses((prev) =>
        prev.filter(
          (expense) =>
            expense.tripDocumentExpenseId !== data.tripDocumentExpenseId,
        ),
      );
      
      setTimeout(() => {
        fetchTripData();
      }, 300);
    };

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

    const handleParticipantCountUpdated = ({ participantFields }) => {
      setParticipantCount(participantFields.count);
    };

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

    const handleError = ({ message }) => {
      alert(`지출 작업 중 오류가 발생했습니다: ${message}`);
      setError(new Error(message));
    };
    socket.on('error', handleError);

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
      
      socket.off('error', handleError);
    };
  }, [socket]);

  return {
    expenses,
    statistics,
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
    setStatistics,
    setAccommodations,
    setTasks,
    setParticipantCount,
    refetch: fetchTripData,
  };
};

export default useTripDetails;
