import { useEffect } from 'react';

const useExpenseSocket = (socket, tripId, setExpenses, setNumberOfPeople) => {
  useEffect(() => {
    if (!socket) return;

    // 경비 업데이트 이벤트 처리
    socket.on('expenseUpdated', (updatedExpense) => {
      console.log('경비 업데이트 이벤트 수신:', updatedExpense);

      if (updatedExpense.category && updatedExpense.index !== undefined) {
        setExpenses((prev) => {
          const newExpenses = { ...prev };

          if (
            newExpenses[updatedExpense.category] &&
            newExpenses[updatedExpense.category][updatedExpense.index]
          ) {
            newExpenses[updatedExpense.category][updatedExpense.index] = {
              ...newExpenses[updatedExpense.category][updatedExpense.index],
              ...updatedExpense.data,
            };
          }

          return newExpenses;
        });
      }
    });

    // 경비 추가 이벤트 처리
    socket.on('expenseAdded', (addedExpense) => {
      console.log('경비 추가 이벤트 수신:', addedExpense);

      if (addedExpense.category && addedExpense.data) {
        setExpenses((prev) => {
          const newExpenses = { ...prev };

          if (newExpenses[addedExpense.category]) {
            newExpenses[addedExpense.category] = [
              ...newExpenses[addedExpense.category],
              addedExpense.data,
            ];
          }

          return newExpenses;
        });
      }
    });

    // 경비 삭제 이벤트 처리
    socket.on('expenseDeleted', (deletedExpense) => {
      console.log('경비 삭제 이벤트 수신:', deletedExpense);

      if (deletedExpense.category && deletedExpense.index !== undefined) {
        setExpenses((prev) => {
          const newExpenses = { ...prev };

          if (newExpenses[deletedExpense.category]) {
            newExpenses[deletedExpense.category] = newExpenses[
              deletedExpense.category
            ].filter((_, i) => i !== deletedExpense.index);
          }

          return newExpenses;
        });
      }
    });

    // 정산 인원 업데이트 이벤트 처리
    socket.on('numberOfPeopleUpdated', (number) => {
      console.log('정산 인원 업데이트 이벤트 수신:', number);
      setNumberOfPeople(number);
    });

    return () => {
      socket.off('expenseUpdated');
      socket.off('expenseAdded');
      socket.off('expenseDeleted');
      socket.off('numberOfPeopleUpdated');
    };
  }, [socket, setExpenses, setNumberOfPeople]);

  const emitExpenseUpdate = (category, index, data) => {
    if (!socket || !tripId) return;

    socket.emit('expenseUpdate', {
      tripId,
      expense: { category, index, data },
    });
  };

  const emitExpenseAdd = (category, data) => {
    if (!socket || !tripId) return;

    socket.emit('expenseAdd', {
      tripId,
      expense: { category, data },
    });
  };

  const emitExpenseDelete = (category, index) => {
    if (!socket || !tripId) return;

    socket.emit('expenseDelete', {
      tripId,
      expense: { category, index },
    });
  };

  const emitNumberOfPeopleUpdate = (number) => {
    if (!socket || !tripId) return;

    socket.emit('numberOfPeopleUpdate', {
      tripId,
      number,
    });
  };

  return {
    emitExpenseUpdate,
    emitExpenseAdd,
    emitExpenseDelete,
    emitNumberOfPeopleUpdate,
  };
};

export default useExpenseSocket;
