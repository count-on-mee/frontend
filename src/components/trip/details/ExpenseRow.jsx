import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import clsx from 'clsx';
import { componentStyles, styleUtils } from '../../../utils/styles';

const ExpenseRow = ({
  category,
  item,
  index,
  isNewRow = false,
  isFixedRow,
  isSelected,
  expenses,
  newRow,
  categoryIcons,
  onRowClick,
  onDeleteRow,
  onInputChange,
  onNewRowInputChange,
  onAmountChange,
}) => {
  return (
    <Draggable
      key={`${category}-${index}`}
      draggableId={`${category}-${index}`}
      index={index}
      isDragDisabled={isFixedRow || isNewRow}
    >
      {(provided, snapshot) => (
        <tr
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={styleUtils.rowStyle(
            isSelected,
            snapshot.isDragging,
            isFixedRow,
            isNewRow,
          )}
          onClick={() => !isNewRow && onRowClick(category, index)}
        >
          {index === 0 && !isNewRow && (
            <td
              rowSpan={expenses[category].length + (newRow[category] ? 2 : 1)}
              className={componentStyles.cell}
            >
              <span className={componentStyles.category}>
                {categoryIcons[category]}
                {category === 'transportation'
                  ? '교통편'
                  : category === 'accommodation'
                    ? '숙박비'
                    : category === 'food'
                      ? '식비'
                      : '기타'}
              </span>
            </td>
          )}
          <td className={componentStyles.cell}>
            <div className="flex items-center gap-2">
              {category === 'food' || category === 'etc' ? (
                <input
                  type="text"
                  value={isNewRow ? newRow[category].name : item.name}
                  onChange={(e) =>
                    isNewRow
                      ? onNewRowInputChange(category, 'name', e.target.value)
                      : onInputChange(category, index, 'name', e.target.value)
                  }
                  className={componentStyles.input}
                  placeholder={
                    index === 0
                      ? category === 'food'
                        ? '음식점명'
                        : '항목명'
                      : ''
                  }
                />
              ) : index < 2 && !isNewRow ? (
                <span className={componentStyles.category}>{item.type}</span>
              ) : (
                <input
                  type="text"
                  value={isNewRow ? newRow[category].type : item.type}
                  onChange={(e) =>
                    isNewRow
                      ? onNewRowInputChange(category, 'type', e.target.value)
                      : onInputChange(category, index, 'type', e.target.value)
                  }
                  className={componentStyles.input}
                  placeholder="항목 입력"
                />
              )}
            </div>
          </td>
          <td className={componentStyles.cell}>
            <input
              type="text"
              value={isNewRow ? newRow[category].amount : item.amount}
              onChange={(e) =>
                isNewRow
                  ? onNewRowInputChange(category, 'amount', e.target.value)
                  : onAmountChange(category, index, e.target.value)
              }
              className={componentStyles.input}
              placeholder="금액 입력"
              inputMode="numeric"
            />
          </td>
          <td className={componentStyles.cell}>
            {isSelected && !isNewRow && !isFixedRow && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteRow(category, index);
                }}
                className={componentStyles.deleteButton}
              >
                ⛔️
              </button>
            )}
          </td>
        </tr>
      )}
    </Draggable>
  );
};

export default React.memo(ExpenseRow);
