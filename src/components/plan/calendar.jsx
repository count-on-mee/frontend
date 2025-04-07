import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import tripDatesAtom from '../../recoil/tripDates';
import currentMonthAtom from '../../recoil/currentMonth';
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

// 기본 스타일
const baseButtonStyles =
  'flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 text-2xl';
const baseShadowStyles = 'shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff]';
const hoverShadowStyles =
  'hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]';

// 선택된 날짜 스타일
const selectedDateStyles =
  'bg-primary text-white shadow-[inset_3px_3px_6px_#c44e1f,inset_-3px_-3px_6px_#ff6c31]';

// 날짜 범위 내 스타일
const dateRangeStyles = 'bg-primary/30 text-primary';

// 비활성화된 날짜 스타일
const disabledDateStyles = 'text-gray-400 cursor-not-allowed shadow-none';

// 오늘 날짜 스타일
const todayDateStyles = 'text-red-500';

// 현재 월의 날짜 스타일
const currentMonthDateStyles =
  'text-gray-900 hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]';

// 다른 월의 날짜 스타일
const otherMonthDateStyles = 'text-gray-400';

// 네비게이션 버튼 스타일
const navButtonStyles =
  'flex items-center justify-center p-3 text-gray-400 hover:text-gray-500 transition-all duration-200 rounded-full';

// 완료 버튼 스타일
const completeButtonStyles =
  'w-full py-4 px-6 bg-primary text-white rounded-full hover:bg-[#D54E23] transition-all duration-200 text-xl shadow-[3px_3px_6px_#c44e1f,-3px_-3px_6px_#ff6c31] hover:shadow-[inset_3px_3px_6px_#c44e1f,inset_-3px_-3px_6px_#ff6c31]';

function Calendar() {
  const navigate = useNavigate();
  const [tripDates, setTripDates] = useRecoilState(tripDatesAtom);
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
        if (
          !tripDates.startDate ||
          (tripDates.startDate && tripDates.endDate)
        ) {
          setTripDates({ startDate: day, endDate: null });
        } else {
          if (day < tripDates.startDate) {
            setTripDates({ startDate: day, endDate: tripDates.startDate });
          } else {
            setTripDates({ ...tripDates, endDate: day });
          }
        }
      }
    },
    [tripDates, setTripDates, today],
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

  const createEvent = useCallback(() => {
    if (tripDates.startDate && tripDates.endDate) {
      navigate('/com/destination-list');
    }
  }, [tripDates, navigate]);

  return (
    <div className="bg-[#EBEAE9] font-prompt h-full flex flex-col">
      <div className="flex-grow overflow-y-auto">
        <div className="flex items-center p-8">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            className={clsx(
              navButtonStyles,
              baseShadowStyles,
              hoverShadowStyles,
            )}
          >
            <span className="sr-only">Previous month</span>
            <ChevronLeftIcon className="w-8 h-8" aria-hidden="true" />
          </button>
          <h2 className="font-semibold text-left ml-4 mr-4">
            <span className="block text-7xl text-[#EB5E28] drop-shadow-[3px_3px_6px_#b8b8b8]">
              {format(firstDayCurrentMonth, 'MMM')}
            </span>
            <span className="block text-3xl text-[#EB5E28] drop-shadow-[3px_3px_6px_#b8b8b8]">
              {format(firstDayCurrentMonth, 'yyyy')}
            </span>
          </h2>
          <button
            onClick={() => changeMonth(1)}
            type="button"
            className={clsx(
              navButtonStyles,
              baseShadowStyles,
              hoverShadowStyles,
            )}
          >
            <span className="sr-only">Next month</span>
            <ChevronRightIcon className="w-8 h-8" aria-hidden="true" />
          </button>
        </div>
        <div className="border-t border-black/10 my-6"></div>
        <div className="grid grid-cols-7 gap-4 px-8">
          <div className="text-2xl leading-6 text-center font-medium text-gray-600">
            S
          </div>
          <div className="text-2xl leading-6 text-center font-medium text-gray-600">
            M
          </div>
          <div className="text-2xl leading-6 text-center font-medium text-gray-600">
            T
          </div>
          <div className="text-2xl leading-6 text-center font-medium text-gray-600">
            W
          </div>
          <div className="text-2xl leading-6 text-center font-medium text-gray-600">
            T
          </div>
          <div className="text-2xl leading-6 text-center font-medium text-gray-600">
            F
          </div>
          <div className="text-2xl leading-6 text-center font-medium text-gray-600">
            S
          </div>
        </div>
        <div className="grid grid-cols-7 gap-4 px-8 mt-4">
          {days.map((day, dayIdx) => (
            <div
              key={day.toString()}
              className={clsx(
                dayIdx === 0 && colStartClasses[getDay(day)],
                'flex justify-center',
              )}
            >
              <button
                type="button"
                onClick={() => handleDateClick(day)}
                disabled={isAfter(today, day)}
                className={clsx(baseButtonStyles, baseShadowStyles, {
                  [selectedDateStyles]:
                    isEqual(day, tripDates.startDate) ||
                    isEqual(day, tripDates.endDate),
                  [dateRangeStyles]:
                    tripDates.startDate &&
                    tripDates.endDate &&
                    isWithinInterval(day, {
                      start: tripDates.startDate,
                      end: tripDates.endDate,
                    }) &&
                    !(
                      isEqual(day, tripDates.startDate) ||
                      isEqual(day, tripDates.endDate)
                    ),
                  [disabledDateStyles]: isAfter(today, day),
                  [todayDateStyles]: !isAfter(today, day) && isToday(day),
                  [currentMonthDateStyles]:
                    !(
                      isEqual(day, tripDates.startDate) ||
                      isEqual(day, tripDates.endDate)
                    ) &&
                    !(
                      tripDates.startDate &&
                      tripDates.endDate &&
                      isWithinInterval(day, {
                        start: tripDates.startDate,
                        end: tripDates.endDate,
                      })
                    ) &&
                    !isToday(day) &&
                    isSameMonth(day, firstDayCurrentMonth),
                  [otherMonthDateStyles]:
                    !(
                      isEqual(day, tripDates.startDate) ||
                      isEqual(day, tripDates.endDate)
                    ) &&
                    !(
                      tripDates.startDate &&
                      tripDates.endDate &&
                      isWithinInterval(day, {
                        start: tripDates.startDate,
                        end: tripDates.endDate,
                      })
                    ) &&
                    !isToday(day) &&
                    !isSameMonth(day, firstDayCurrentMonth),
                })}
              >
                <time dateTime={format(day, 'yyyy-MM-dd')}>
                  {format(day, 'd')}
                </time>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="p-6">
        {tripDates.startDate && tripDates.endDate ? (
          <button
            onClick={createEvent}
            type="button"
            className={completeButtonStyles}
          >
            완료
          </button>
        ) : (
          <p className="text-center text-gray-500 text-xl">
            여행 날짜를 선택해주세요!
          </p>
        )}
      </div>
    </div>
  );
}

const colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
];

export default Calendar;
