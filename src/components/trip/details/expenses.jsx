import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import clsx from 'clsx';
import useExpenses from '../../../hooks/useExpenses';
import useExpenseSocket from '../../../hooks/useExpenseSocket';
import { componentStyles, styleUtils } from '../../../utils/styles';
import {
  CATEGORY_LABELS,
  FIXED_ROW_RULES,
  isValidNewRow,
} from '../../../constants/expenseConstants';
import ExpenseRow from './ExpenseRow';
import TableHeader from './tableHeader';
import TotalRow from './totalRow';
import SettlementRow from './settlementRow';

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

  const {
    emitExpenseUpdate,
    emitExpenseAdd,
    emitExpenseDelete,
    emitNumberOfPeopleUpdate,
  } = useExpenseSocket(socket, tripId, setExpenses, setNumberOfPeople);

  const handleInputChangeWithSocket = (category, index, field, value) => {
    try {
      handleInputChange(category, index, field, value);
      emitExpenseUpdate(category, index, { [field]: value });
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleAmountChangeWithSocket = (category, index, value) => {
    try {
      handleAmountChange(category, index, value);
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue === '') {
        emitExpenseUpdate(category, index, { amount: '' });
        return;
      }
      const formattedValue = parseInt(numericValue).toLocaleString();
      emitExpenseUpdate(category, index, { amount: formattedValue });
    } catch (error) {
      console.error('Error updating amount:', error);
      // TODO: 에러 처리 UI 추가
    }
  };

  const confirmNewRowWithSocket = (category) => {
    try {
      if (newRow[category]) {
        confirmNewRow(category);
        emitExpenseAdd(category, newRow[category]);
      }
    } catch (error) {
      console.error('Error confirming new row:', error);
      // TODO: 에러 처리 UI 추가
    }
  };

  const deleteRowWithSocket = (category, index) => {
    try {
      deleteRow(category, index);
      emitExpenseDelete(category, index);
    } catch (error) {
      console.error('Error deleting row:', error);
      // TODO: 에러 처리 UI 추가
    }
  };

  const isFixedRow = (category, index) => {
    return FIXED_ROW_RULES[category]?.(index) || false;
  };

  const handleNumberOfPeopleChange = (e) => {
    try {
      const value = e.target.value;
      if (value < 1) {
        throw new Error('인원 수는 1명 이상이어야 합니다.');
      }
      setNumberOfPeople(value);
      emitNumberOfPeopleUpdate(value);
    } catch (error) {
      console.error('Error updating number of people:', error);
      // TODO: 에러 처리 UI 추가
    }
  };

  return (
    <div className="bg-[var(--color-background-gray)] font-prompt p-6 rounded-lg">
      <DragDropContext onDragEnd={handleDragEnd}>
        <table className="w-full">
          <TableHeader />
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
                                    onInputChange={handleInputChangeWithSocket}
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
                                            confirmNewRowWithSocket(category)
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

                                {!newRow[category] && (
                                  <tr>
                                    <td colSpan="4" className="p-2">
                                      <button
                                        onClick={() => addRow(category)}
                                        className={styleUtils.addButtonStyle}
                                      >
                                        <span className="text-lg">+</span>
                                        {CATEGORY_LABELS[category]}
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

            <TotalRow total={total} formatNumber={formatNumber} />
            <SettlementRow
              total={total}
              numberOfPeople={numberOfPeople}
              onNumberOfPeopleChange={handleNumberOfPeopleChange}
            />
          </tbody>
        </table>
      </DragDropContext>
    </div>
  );
};

ExpensesSection.propTypes = {
  socket: PropTypes.object.isRequired,
  tripId: PropTypes.string.isRequired,
};

export default ExpensesSection;
