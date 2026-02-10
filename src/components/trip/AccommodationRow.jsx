import React, { useRef, useState, useCallback } from 'react';
import { componentStyles } from '../../utils/style';
import LocalDateRangePicker from '../datePickers/localDateRangePicker';

function formatNumberWithCommas(value) {
  if (typeof value !== 'string') return value;
  const numeric = value.replace(/[^0-9]/g, '');
  if (!numeric) return '';
  return parseInt(numeric, 10).toLocaleString();
}

function useDebouncedCallback(callback, delay) {
  const timeoutRef = useRef();
  const debounced = useCallback(
    (...args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
  return debounced;
}

const AccommodationRow = ({
  item,
  index,
  isNewRow = false,
  isPlaceholder = false,
  isSelected = false,
  onRowClick,
  onDeleteRow,
  onInputChange,
  onNewRowInputChange,
  onDateChange,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const dateButtonRef = useRef(null);
  const [accommodationInput, setAccommodationInput] = useState(
    item.accommodation || '',
  );
  const [memoInput, setMemoInput] = useState(item.memo || '');

  // Debounced handlers
  const debouncedAccommodationChange = useDebouncedCallback((value) => {
    handleChange('accommodation', value);
  }, 300);
  const debouncedMemoChange = useDebouncedCallback((value) => {
    handleChange('memo', value);
  }, 300);

  // 날짜 표시 포맷 (YY/MM/DD)
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = String(d.getFullYear()).slice(-2);
    return `${year}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
  };

  // 날짜 범위 표시 포맷
  const formatDateRange = () => {
    const checkIn = item.checkInDate ? formatDate(item.checkInDate) : '';
    const checkOut = item.checkOutDate ? formatDate(item.checkOutDate) : '';

    if (checkIn && checkOut) {
      return `${checkIn}~${checkOut}`;
    } else if (checkIn) {
      return `${checkIn}~`;
    } else if (checkOut) {
      return `~${checkOut}`;
    } else {
      return '날짜 선택';
    }
  };

  // 날짜 버튼 클릭 시 캘린더 표시
  const handleDateButtonClick = (e) => {
    e.stopPropagation();
    setShowCalendar(true);
  };

  // 날짜 선택 완료
  const handleDateRangeChange = (startDate, endDate) => {
    if (isNewRow || isPlaceholder) {
      onNewRowInputChange({
        checkInDate: startDate ? startDate.toISOString().slice(0, 10) : '',
        checkOutDate: endDate ? endDate.toISOString().slice(0, 10) : '',
      });
    } else {
      onDateChange(index, startDate, endDate);
    }
    // 두 날짜 모두 선택된 경우에만 닫기
    if (startDate && endDate) {
      setShowCalendar(false);
    }
  };

  // 입력 핸들러
  const handleChange = (field, value) => {
    if (isNewRow || isPlaceholder) {
      onNewRowInputChange(field, value);
    } else {
      onInputChange(index, field, value);
    }
  };

  // accommodation, memo 입력값 동기화
  React.useEffect(() => {
    setAccommodationInput(item.accommodation || '');
  }, [item.accommodation]);
  React.useEffect(() => {
    setMemoInput(item.memo || '');
  }, [item.memo]);

  // 메모 입력: 숫자만 입력하면 자동 콤마
  const handleMemoInput = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setMemoInput(formatNumberWithCommas(value));
      debouncedMemoChange(formatNumberWithCommas(value));
    } else {
      setMemoInput(value);
      debouncedMemoChange(value);
    }
  };

  return (
    <tr
      className={isSelected ? 'bg-blue-50' : ''}
      onClick={() => onRowClick(index)}
    >
      {/* 숙소명 */}
      <td className={componentStyles.cell}>
        <input
          type="text"
          value={accommodationInput}
          onChange={(e) => {
            setAccommodationInput(e.target.value);
            debouncedAccommodationChange(e.target.value);
          }}
          className={componentStyles.input}
          placeholder={isPlaceholder ? '숙소명을 입력하세요' : ''}
        />
      </td>
      {/* 체크인 ~ 체크아웃 날짜 범위 */}
      <td className={componentStyles.cell}>
        <button
          type="button"
          ref={dateButtonRef}
          onClick={handleDateButtonClick}
          className={componentStyles.input + ' text-left whitespace-nowrap'}
        >
          {formatDateRange()}
        </button>
        {showCalendar && (
          <div className="absolute z-50">
            <LocalDateRangePicker
              initialDates={{
                startDate: item.checkInDate ? new Date(item.checkInDate) : null,
                endDate: item.checkOutDate ? new Date(item.checkOutDate) : null,
              }}
              onDateRangeChange={handleDateRangeChange}
              showCompleteButton={true}
              onComplete={() => setShowCalendar(false)}
              completeButtonText="완료"
              allowPastDates={true}
              size="small"
            />
          </div>
        )}
      </td>
      {/* 메모 */}
      <td className={componentStyles.cell}>
        <input
          type="text"
          value={memoInput}
          onChange={handleMemoInput}
          className={componentStyles.input}
          placeholder={isPlaceholder ? '메모를 입력하세요' : ''}
        />
      </td>
      {/* 삭제 버튼 */}
      <td className={componentStyles.cell}>
        {!isPlaceholder && !isNewRow && isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteRow(index);
            }}
            className={componentStyles.deleteButton}
          >
            ⛔️
          </button>
        )}
      </td>
    </tr>
  );
};

export default React.memo(AccommodationRow);
