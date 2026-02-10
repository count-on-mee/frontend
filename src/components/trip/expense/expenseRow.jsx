import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { FaPlane, FaHotel, FaUtensils, FaEllipsisH } from 'react-icons/fa';
import { componentStyles, styleUtils } from '../../../utils/style';
import { CATEGORY_NAMES } from '../../../constants/expenseConstants';

const CATEGORY_ICONS = {
  transportation: FaPlane,
  accommodation: FaHotel,
  food: FaUtensils,
  etc: FaEllipsisH,
};

const ExpenseRow = ({
  category,
  item,
  index,
  isNewRow = false,
  isFixedRow,
  isSelected,
  expenses,
  newRow,
  onRowClick,
  onDeleteRow,
  onInputChange,
  onNewRowInputChange,
  onAmountChange,
}) => {
  const Icon = CATEGORY_ICONS[category];

  const handleInputChange = (field, value) => {
    if (isNewRow) {
      onNewRowInputChange(category, field, value);
    } else {
      onInputChange(category, index, field, value);
    }
  };

  const getTransportationPlaceholder = () => {
    if (index === 0) {
      return '수단명 (예: 기차, 버스, 택시)';
    }
    return '수단명 입력';
  };

  const getAccommodationPlaceholder = () => {
    if (index === 0) {
      return '숙소명';
    }
    return '숙소명 입력';
  };

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
                {Icon && <Icon className="mr-2" />}
                {CATEGORY_NAMES[category]}
              </span>
            </td>
          )}
          <td className={componentStyles.cell}>
            <div className="flex items-center gap-2">
              {category === 'food' || category === 'etc' ? (
                <input
                  type="text"
                  value={isNewRow ? newRow[category].name : item.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={componentStyles.input}
                  placeholder={
                    index === 0
                      ? category === 'food'
                        ? '음식점명 '
                        : '항목명 (예: 기념품, 입장료)'
                      : ''
                  }
                />
              ) : (
                <input
                  type="text"
                  value={isNewRow ? newRow[category].type : item.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className={componentStyles.input}
                  placeholder={
                    category === 'transportation'
                      ? getTransportationPlaceholder()
                      : category === 'accommodation'
                        ? getAccommodationPlaceholder()
                        : '항목 입력'
                  }
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
            {isSelected &&
              !isNewRow &&
              index > 0 &&
              item.tripDocumentExpenseId !== null && (
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
