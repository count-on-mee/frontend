import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useRecoilState } from 'recoil';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  isWithinInterval,
  isAfter,
} from 'date-fns';
import { useCallback } from 'react';
import clsx from 'clsx';
import currentMonthAtom from '../../recoil/currentMonth';
import { dateRangePickerStyles } from '../../utils/style';

function DateRangePicker({
  startDate,
  endDate,
  onDateRangeChange,
  allowPastDates = false,
  showCompleteButton = false,
  onComplete,
  completeButtonText = '완료',
  size = 'default',
}) {
  const [currentMonth, setCurrentMonth] = useRecoilState(currentMonthAtom);
  const today = startOfToday();
  const firstDayCurrentMonth = parse(currentMonth, 'yyyy-MMM', new Date());

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  const handleDateClick = useCallback(
    (day) => {
      if (isAfter(day, today) || isEqual(day, today)) {
        if (!startDate || (startDate && endDate)) {
          onDateRangeChange(day, null);
        } else {
          if (day < startDate) {
            onDateRangeChange(day, startDate);
          } else {
            onDateRangeChange(startDate, day);
          }
        }
      }
    },
    [startDate, endDate, onDateRangeChange, today],
  );

  const changeMonth = useCallback(
    (amount) => {
      setCurrentMonth((prevMonth) => {
        const firstDayNextMonth = parse(
          prevMonth + '-01',
          'yyyy-MMM-dd',
          new Date(),
        );
        firstDayNextMonth.setMonth(firstDayNextMonth.getMonth() + amount);
        return format(firstDayNextMonth, 'yyyy-MMM');
      });
    },
    [setCurrentMonth],
  );

  return (
    <div className="bg-[#EBEAE9] font-prompt h-full flex flex-col">
      <div className="flex-grow overflow-y-auto">
        <div className={dateRangePickerStyles.headerSize[size].container}>
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            className={clsx(
              dateRangePickerStyles.navButton(size),
              dateRangePickerStyles.baseShadow,
              dateRangePickerStyles.hoverShadow,
            )}
          >
            <span className="sr-only">Previous month</span>
            <ChevronLeftIcon
              className={dateRangePickerStyles.headerSize[size].icon}
              aria-hidden="true"
            />
          </button>
          <h2 className="font-semibold text-left ml-4 mr-4">
            <span className={dateRangePickerStyles.headerSize[size].month}>
              {format(firstDayCurrentMonth, 'MMM')}
            </span>
            <span className={dateRangePickerStyles.headerSize[size].year}>
              {format(firstDayCurrentMonth, 'yyyy')}
            </span>
          </h2>
          <button
            onClick={() => changeMonth(1)}
            type="button"
            className={clsx(
              dateRangePickerStyles.navButton(size),
              dateRangePickerStyles.baseShadow,
              dateRangePickerStyles.hoverShadow,
            )}
          >
            <span className="sr-only">Next month</span>
            <ChevronRightIcon
              className={dateRangePickerStyles.headerSize[size].icon}
              aria-hidden="true"
            />
          </button>
        </div>
        <div className="border-t border-black/10 my-6"></div>
        <div className={dateRangePickerStyles.gridSize[size]}>
          <div className={dateRangePickerStyles.dayHeaderSize[size]}>S</div>
          <div className={dateRangePickerStyles.dayHeaderSize[size]}>M</div>
          <div className={dateRangePickerStyles.dayHeaderSize[size]}>T</div>
          <div className={dateRangePickerStyles.dayHeaderSize[size]}>W</div>
          <div className={dateRangePickerStyles.dayHeaderSize[size]}>T</div>
          <div className={dateRangePickerStyles.dayHeaderSize[size]}>F</div>
          <div className={dateRangePickerStyles.dayHeaderSize[size]}>S</div>
        </div>
        <div className={dateRangePickerStyles.gridSize[size] + ' mt-4'}>
          {days.map((day, dayIdx) => (
            <div
              key={day.toString()}
              className={clsx(
                dayIdx === 0 && dateRangePickerStyles.colStart[getDay(day)],
                'flex justify-center',
              )}
            >
              <button
                type="button"
                onClick={() => handleDateClick(day)}
                disabled={isAfter(today, day)}
                className={clsx(
                  dateRangePickerStyles.baseButton(size),
                  dateRangePickerStyles.baseShadow,
                  {
                    [dateRangePickerStyles.selectedDate]:
                      isEqual(day, startDate) || isEqual(day, endDate),
                    [dateRangePickerStyles.dateRange]:
                      startDate &&
                      endDate &&
                      isWithinInterval(day, {
                        start: startDate,
                        end: endDate,
                      }) &&
                      !(isEqual(day, startDate) || isEqual(day, endDate)),
                    [dateRangePickerStyles.disabledDate]: isAfter(today, day),
                    [dateRangePickerStyles.todayDate]:
                      !isAfter(today, day) && isToday(day),
                    [dateRangePickerStyles.currentMonthDate]:
                      !(isEqual(day, startDate) || isEqual(day, endDate)) &&
                      !(
                        startDate &&
                        endDate &&
                        isWithinInterval(day, {
                          start: startDate,
                          end: endDate,
                        })
                      ) &&
                      !isToday(day) &&
                      isSameMonth(day, firstDayCurrentMonth),
                    [dateRangePickerStyles.otherMonthDate]:
                      !(isEqual(day, startDate) || isEqual(day, endDate)) &&
                      !(
                        startDate &&
                        endDate &&
                        isWithinInterval(day, {
                          start: startDate,
                          end: endDate,
                        })
                      ) &&
                      !isToday(day) &&
                      !isSameMonth(day, firstDayCurrentMonth),
                  },
                )}
              >
                <time dateTime={format(day, 'yyyy-MM-dd')}>
                  {format(day, 'd')}
                </time>
              </button>
            </div>
          ))}
        </div>
      </div>
      {showCompleteButton && (
        <div className="p-4">
          {startDate && endDate ? (
            <button
              onClick={onComplete}
              type="button"
              className={dateRangePickerStyles.completeButtonSize[size]}
            >
              {completeButtonText}
            </button>
          ) : (
            <p className={dateRangePickerStyles.completeTextSize[size]}>
              여행 날짜를 선택해주세요!
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default DateRangePicker;
