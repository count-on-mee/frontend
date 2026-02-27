import React, { useState, useEffect, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import clsx from 'clsx';
import useExpenses from '../../../hooks/useExpenses';
import { componentStyles, styleUtils } from '../../../utils/style';
import { useSocketDebounce } from '../../../utils/debounce';
import {
  CATEGORY_LABELS,
  FIXED_ROW_RULES,
  isValidNewRow,
} from '../../../constants/expenseConstants';
import ExpenseRow from './expenseRow';

import TotalRow from '../totalRow';
import SettlementRow from './settlementRow';

const EXPENSE_TYPES = {
  transportation: 'transportation',
  accommodation: 'accommodation',
  food: 'meal',
  etc: 'other',
};

const ExpensesSection = memo(
  ({
    socket,
    tripId,
    initialExpenses,
    setExpenses,
    participantCount,
    setParticipantCount,
  }) => {
    const debouncedSocketEmit = useSocketDebounce(socket, 800);

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
    } = useExpenses(initialExpenses);

    const handleInputChangeWithSocket = (category, index, field, value) => {
      try {
        handleInputChange(category, index, field, value);

        // socket이 null이거나 연결되지 않은 경우 처리하지 않음
        if (!socket || !socket.connected) {
          return;
        }

        const tripDocumentExpenseId =
          expenses[category][index]?.tripDocumentExpenseId;

        // ID가 있는 경우에만 업데이트 이벤트 발송
        if (tripDocumentExpenseId) {
          // 카테고리별로 올바른 detail 값을 가져오기
          let detailValue = '';
          if (category === 'food' || category === 'etc') {
            // food와 etc는 name 필드를 사용
            detailValue =
              field === 'name' ? value : expenses[category][index]?.name || '';
          } else {
            // transportation과 accommodation는 type 필드를 사용
            // 한글 입력 최적화: 800ms debounce 적용
            detailValue =
              field === 'type' ? value : expenses[category][index]?.type || '';
          }

          // API 스펙에 맞는 데이터 구조로 변환
          const expenseData = {
            type: EXPENSE_TYPES[category] || 'other',
            detail: detailValue,
            amount:
              field === 'amount'
                ? parseInt(value.replace(/[^0-9]/g, '')) || 0
                : expenses[category][index]?.amount || 0,
          };

          debouncedSocketEmit('updateExpense', {
            tripDocumentExpenseId,
            expenseFields: expenseData,
          });
        }
      } catch (error) {
        console.error('❌ Error updating expense:', error);
      }
    };

    const handleAmountChangeWithSocket = (category, index, value) => {
      try {
        handleAmountChange(category, index, value);

        // socket이 null이거나 연결되지 않은 경우 처리하지 않음
        if (!socket || !socket.connected) {
          return;
        }

        const numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue === '') {
          debouncedSocketEmit('updateExpense', {
            tripDocumentExpenseId:
              expenses[category][index]?.tripDocumentExpenseId,
            expenseFields: { amount: 0 },
          });
          return;
        }

        debouncedSocketEmit('updateExpense', {
          tripDocumentExpenseId:
            expenses[category][index]?.tripDocumentExpenseId,
          expenseFields: { amount: parseInt(numericValue) },
        });
      } catch (error) {
        console.error('Error updating amount:', error);
      }
    };

    const confirmNewRowWithSocket = (category) => {
      try {
        if (newRow[category]) {
          confirmNewRow(category);

          // socket이 null이거나 연결되지 않은 경우 처리하지 않음
          if (!socket || !socket.connected) {
            return;
          }

          // 카테고리별로 올바른 detail 값을 가져오기
          let detailValue = '';
          if (category === 'food' || category === 'etc') {
            // food와 etc는 name 필드를 사용
            detailValue = newRow[category].name || '';
          } else {
            // transportation과 accommodation는 type 필드를 사용
            detailValue = newRow[category].type || '';
          }

          // API 스펙에 맞는 데이터 구조로 변환
          const expenseData = {
            type: EXPENSE_TYPES[category] || 'other',
            detail: detailValue,
            amount:
              parseInt(newRow[category].amount?.replace(/[^0-9]/g, '')) || 0,
          };

          debouncedSocketEmit('addExpense', { expenseData });
        }
      } catch (error) {
        console.error('Error confirming new row:', error);
      }
    };

    const deleteRowWithSocket = (category, index) => {
      try {
        const expense = expenses[category][index];

        // 기본 행(tripDocumentExpenseId가 null)은 삭제하지 않음
        if (!expense || expense.tripDocumentExpenseId === null) {
          return;
        }

        deleteRow(category, index);

        // socket이 null이거나 연결되지 않은 경우 처리하지 않음
        if (!socket || !socket.connected) {
          return;
        }

        debouncedSocketEmit('deleteExpense', {
          tripDocumentExpenseId: expense.tripDocumentExpenseId,
        });
      } catch (error) {
        console.error('Error deleting row:', error);
      }
    };

    const isFixedRow = (category, index) => {
      return FIXED_ROW_RULES[category]?.(index) || false;
    };

    const handleParticipantCountChange = (e) => {
      const value = parseInt(e.target.value) || 1;
      const validValue = Math.max(1, value);
      setParticipantCount(validValue);

      if (socket && socket.connected) {
        debouncedSocketEmit('updateParticipantCount', {
          participantFields: { count: validValue },
        });
      }
    };

    return (
      <div className="bg-[var(--color-background-gray)] font-prompt p-6 rounded-lg shadow-[4px_4px_8px_#b8b8b8,-4px_-4px_8px_#ffffff]">
        <DragDropContext onDragEnd={handleDragEnd}>
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-1/4 p-2">
                  <span className={componentStyles.header}>카테고리</span>
                </th>
                <th className="w-1/3 p-2">
                  <span className={componentStyles.header}>상세</span>
                </th>
                <th className="w-1/4 p-2">
                  <span className={componentStyles.header}>금액</span>
                </th>
                <th className="w-12 p-2"></th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(expenses).map(
                ([category, items], categoryIndex) => {
                  // items가 배열인지 확인
                  if (!Array.isArray(items)) {
                    console.warn(
                      `Items for category ${category} is not an array:`,
                      items,
                    );
                    return null;
                  }

                  return (
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
                                        onRowClick={handleRowClick}
                                        onDeleteRow={deleteRowWithSocket}
                                        onInputChange={
                                          handleInputChangeWithSocket
                                        }
                                        onNewRowInputChange={
                                          handleNewRowInputChange
                                        }
                                        onAmountChange={
                                          handleAmountChangeWithSocket
                                        }
                                      />
                                    ))}

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
                                                confirmNewRowWithSocket(
                                                  category,
                                                )
                                              }
                                              className={
                                                !isValidNewRow(category, newRow)
                                                  ? clsx(
                                                      styleUtils.addButtonStyle,
                                                      'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300',
                                                    )
                                                  : styleUtils.confirmButtonStyle
                                              }
                                              disabled={
                                                !isValidNewRow(category, newRow)
                                              }
                                            >
                                              <span className="text-lg">✓</span>{' '}
                                              완료
                                            </button>
                                          </td>
                                        </tr>
                                      </>
                                    )}

                                    {/* 행 추가 버튼 - newRow가 없을 때만 표시 */}
                                    {!newRow[category] && (
                                      <tr>
                                        <td colSpan="4" className="p-2">
                                          <button
                                            onClick={() => addRow(category)}
                                            className={
                                              styleUtils.addButtonStyle
                                            }
                                          >
                                            <span className="text-lg">+</span>{' '}
                                            {CATEGORY_LABELS[category]}
                                          </button>
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            {provided.placeholder}
                          </React.Fragment>
                        )}
                      </Droppable>
                    </React.Fragment>
                  );
                },
              )}
              <TotalRow total={total} formatNumber={formatNumber} />
              <SettlementRow
                total={total}
                participantCount={participantCount}
                onParticipantCountChange={handleParticipantCountChange}
                socket={socket}
              />
            </tbody>
          </table>
        </DragDropContext>
      </div>
    );
  },
);

ExpensesSection.propTypes = {
  socket: PropTypes.object,
  tripId: PropTypes.string.isRequired,
  initialExpenses: PropTypes.object,
  setExpenses: PropTypes.func,
  participantCount: PropTypes.number,
  setParticipantCount: PropTypes.func,
};

export default ExpensesSection;
