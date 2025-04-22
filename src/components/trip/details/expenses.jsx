import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { FaPlane, FaHotel, FaUtensils, FaEllipsisH } from 'react-icons/fa';
import clsx from 'clsx';
import useExpenses from '../../../hooks/useExpenses';
import { componentStyles, styleUtils } from '../../../utils/styles';
import ExpenseRow from './ExpenseRow';

// 아이콘 매핑
const categoryIcons = {
  transportation: <FaPlane className="mr-2" />,
  accommodation: <FaHotel className="mr-2" />,
  food: <FaUtensils className="mr-2" />,
  etc: <FaEllipsisH className="mr-2" />,
};

const ExpensesSection = ({ socket, tripId }) => {
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  const {
    expenses,
    newRow,
    total,
    selectedRow,
    handleRowClick,
    handleInputChange,
    handleNewRowInputChange,
    handleAmountChange,
    addRow,
    confirmNewRow,
    deleteRow,
    handleDragEnd,
    formatNumber,
    setExpenses,
  } = useExpenses();

  // Socket.IO 이벤트 리스너 설정
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

    return () => {
      socket.off('expenseUpdated');
      socket.off('expenseAdded');
      socket.off('expenseDeleted');
    };
  }, [socket, setExpenses]);

  // Socket을 통해 경비 업데이트 이벤트 발송
  const emitExpenseUpdate = (category, index, data) => {
    if (!socket || !tripId) return;

    socket.emit('expenseUpdate', {
      tripId,
      expense: { category, index, data },
    });
  };

  // Socket을 통해 경비 추가 이벤트 발송
  const emitExpenseAdd = (category, data) => {
    if (!socket || !tripId) return;

    socket.emit('expenseAdd', {
      tripId,
      expense: { category, data },
    });
  };

  // Socket을 통해 경비 삭제 이벤트 발송
  const emitExpenseDelete = (category, index) => {
    if (!socket || !tripId) return;

    socket.emit('expenseDelete', {
      tripId,
      expense: { category, index },
    });
  };

  // 기존 handleInputChange 함수를 소켓 이벤트를 발생시키도록 수정
  const handleInputChangeWithSocket = (category, index, field, value) => {
    handleInputChange(category, index, field, value);
    emitExpenseUpdate(category, index, { [field]: value });
  };

  // 기존 handleAmountChange 함수를 소켓 이벤트를 발생시키도록 수정
  const handleAmountChangeWithSocket = (category, index, value) => {
    handleAmountChange(category, index, value);

    // 숫자만 입력 가능하도록 제한
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue === '') {
      emitExpenseUpdate(category, index, { amount: '' });
      return;
    }

    // 천 단위 콤마 추가
    const formattedValue = parseInt(numericValue).toLocaleString();
    emitExpenseUpdate(category, index, { amount: formattedValue });
  };

  // 기존 confirmNewRow 함수를 소켓 이벤트를 발생시키도록 수정
  const confirmNewRowWithSocket = (category) => {
    if (newRow[category]) {
      confirmNewRow(category);
      emitExpenseAdd(category, newRow[category]);
    }
  };

  // 기존 deleteRow 함수를 소켓 이벤트를 발생시키도록 수정
  const deleteRowWithSocket = (category, index) => {
    deleteRow(category, index);
    emitExpenseDelete(category, index);
  };

  // 경비 행이 고정 행인지 확인하는 함수
  const isFixedRow = (category, index) => {
    return (
      (category === 'transportation' && index < 2) ||
      (category === 'accommodation' && index < 2) ||
      (category === 'food' && index === 0) ||
      (category === 'etc' && index === 0)
    );
  };

  // 새 행의 입력이 유효한지 확인하는 함수
  const isValidNewRow = (category) => {
    if (!newRow[category]) return false;

    return category === 'food' || category === 'etc'
      ? newRow[category].name && newRow[category].amount
      : newRow[category].type && newRow[category].amount;
  };

  return (
    <div className="bg-[var(--color-background-gray)] font-prompt p-6 rounded-lg">
      <DragDropContext onDragEnd={handleDragEnd}>
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-1/4 p-2">
                <span className={componentStyles.header}>항목</span>
              </th>
              <th className="w-1/2 p-2">
                <span className={componentStyles.header}>세부사항</span>
              </th>
              <th className="w-1/4 p-2">
                <span className={componentStyles.header}>금액</span>
              </th>
              <th className="w-12 p-2"></th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(expenses).map(
              ([category, items], categoryIndex) => (
                <React.Fragment key={category}>
                  {categoryIndex > 0 && (
                    <tr>
                      <td colSpan="4">
                        <div className={componentStyles.divider}></div>
                      </td>
                    </tr>
                  )}
                  <Droppable droppableId={category}>
                    {(provided) => (
                      <React.Fragment>
                        <tr
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          <td colSpan="4" className="p-0">
                            <table className="w-full">
                              <tbody>
                                {/* 기존 행 렌더링 */}
                                {items.map((item, index) => (
                                  <ExpenseRow
                                    key={`${category}-${index}`}
                                    category={category}
                                    item={item}
                                    index={index}
                                    isFixedRow={isFixedRow(category, index)}
                                    isSelected={
                                      selectedRow.category === category &&
                                      selectedRow.index === index
                                    }
                                    expenses={expenses}
                                    newRow={newRow}
                                    categoryIcons={categoryIcons}
                                    onRowClick={handleRowClick}
                                    onDeleteRow={deleteRowWithSocket}
                                    onInputChange={handleInputChangeWithSocket}
                                    onNewRowInputChange={
                                      handleNewRowInputChange
                                    }
                                    onAmountChange={
                                      handleAmountChangeWithSocket
                                    }
                                  />
                                ))}

                                {/* 새 행 입력 폼 */}
                                {newRow[category] && (
                                  <>
                                    <ExpenseRow
                                      category={category}
                                      item={newRow[category]}
                                      index={items.length}
                                      isNewRow={true}
                                      isFixedRow={false}
                                      isSelected={false}
                                      expenses={expenses}
                                      newRow={newRow}
                                      categoryIcons={categoryIcons}
                                      onRowClick={() => {}}
                                      onDeleteRow={() => {}}
                                      onInputChange={handleInputChange}
                                      onNewRowInputChange={
                                        handleNewRowInputChange
                                      }
                                      onAmountChange={handleAmountChange}
                                    />
                                    <tr>
                                      <td colSpan="4" className="p-2">
                                        <button
                                          onClick={() =>
                                            confirmNewRowWithSocket(category)
                                          }
                                          className={
                                            !isValidNewRow(category)
                                              ? clsx(
                                                  styleUtils.addButtonStyle,
                                                  'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300',
                                                )
                                              : styleUtils.confirmButtonStyle
                                          }
                                          disabled={!isValidNewRow(category)}
                                        >
                                          <span className="text-lg">✓</span>{' '}
                                          완료
                                        </button>
                                      </td>
                                    </tr>
                                  </>
                                )}

                                {/* 행 추가 버튼 */}
                                {!newRow[category] && (
                                  <tr>
                                    <td colSpan="4" className="p-2">
                                      <button
                                        onClick={() => addRow(category)}
                                        className={styleUtils.addButtonStyle}
                                      >
                                        <span className="text-lg">+</span>
                                        {category === 'transportation'
                                          ? '교통편 추가'
                                          : category === 'accommodation'
                                            ? '숙박비 추가'
                                            : category === 'food'
                                              ? '식비 추가'
                                              : '기타 항목 추가'}
                                      </button>
                                    </td>
                                  </tr>
                                )}
                                {provided.placeholder}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </React.Fragment>
                    )}
                  </Droppable>
                </React.Fragment>
              ),
            )}

            {/* 합계 행 */}
            <tr>
              <td colSpan="2" className="p-3">
                <span className={componentStyles.header}>합계</span>
              </td>
              <td className="p-3 text-right">
                <span className={componentStyles.header}>
                  {formatNumber(total)} 원
                </span>
              </td>
              <td className="p-3"></td>
            </tr>

            {/* 정산 행 */}
            <tr>
              <td colSpan="2" className={componentStyles.cell}>
                <div className="flex items-center gap-4">
                  <span className={componentStyles.header}>정산하기</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={numberOfPeople}
                      onChange={(e) => setNumberOfPeople(e.target.value)}
                      className={clsx(componentStyles.input, 'w-16')}
                      placeholder="N"
                    />
                    <span className="text-[#252422]">명</span>
                  </div>
                </div>
              </td>
              <td className={componentStyles.cell}>
                <span className={componentStyles.header}>
                  {Math.floor(
                    total / parseFloat(numberOfPeople || 1),
                  ).toLocaleString()}{' '}
                  원
                </span>
              </td>
              <td className={componentStyles.cell}></td>
            </tr>
          </tbody>
        </table>
      </DragDropContext>
    </div>
  );
};

export default ExpensesSection;
