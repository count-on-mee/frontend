import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import tripDatesAtom from '../recoil/tripDates';
import currentMonthAtom from '../recoil/currentMonth';
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

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

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

  function handleDateClick(day) {
    if (isAfter(day, today) || isEqual(day, today)) {
      if (!tripDates.startDate || (tripDates.startDate && tripDates.endDate)) {
        setTripDates({ startDate: day, endDate: null });
      } else {
        if (day < tripDates.startDate) {
          setTripDates({ startDate: day, endDate: tripDates.startDate });
        } else {
          setTripDates({ ...tripDates, endDate: day });
        }
      }
    }
  }

  function changeMonth(amount) {
    setCurrentMonth(prevMonth => {
      const firstDayNextMonth = parse(
        prevMonth + '-01',
        'yyyy-MMM-dd',
        new Date(),
      );
      firstDayNextMonth.setMonth(firstDayNextMonth.getMonth() + amount);
      return format(firstDayNextMonth, 'yyyy-MMM');
    });
  }

  function createEvent() {
    if (tripDates.startDate && tripDates.endDate) {
      navigate(
        `/destination?start=${format(tripDates.startDate, 'yyyy-MM-dd')}&end=${format(tripDates.endDate, 'yyyy-MM-dd')}`,
      );
    }
  }

  return (
    <div className="bg-[#E9E8E5] font-prompt h-full flex flex-col">
      <div className="flex-grow overflow-y-auto">
        <div className="flex items-center justify-start p-4">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            className="flex items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Previous month</span>
            <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
          </button>
          <h2 className="font-semibold text-left mr-4">
            <span className="block text-6xl text-[#EB5E28]">
              {format(firstDayCurrentMonth, 'MMM')}
            </span>
            <span className="block text-2xl text-[#EB5E28]">
              {format(firstDayCurrentMonth, 'yyyy')}
            </span>
          </h2>
          <button
            onClick={() => changeMonth(1)}
            type="button"
            className="flex items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Next month</span>
            <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <div className="border-t border-black my-4"></div>
        <div className="grid grid-cols-7 mt-4 text-xl leading-6 text-center font-medium">
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>
        <div className="grid grid-cols-7 mt-2 text-xl font-semibold">
          {days.map((day, dayIdx) => (
            <div
              key={day.toString()}
              className={classNames(
                dayIdx === 0 && colStartClasses[getDay(day)],
                'py-1.5',
              )}
            >
              <button
                type="button"
                onClick={() => handleDateClick(day)}
                disabled={isAfter(today, day)}
                className={classNames(
                  isEqual(day, tripDates.startDate) &&
                    'bg-[#EB5E28] text-white',
                  isEqual(day, tripDates.endDate) && 'bg-[#EB5E28] text-white',
                  !isEqual(day, tripDates.startDate) &&
                    !isEqual(day, tripDates.endDate) &&
                    tripDates.startDate &&
                    tripDates.endDate &&
                    isWithinInterval(day, {
                      start: tripDates.startDate,
                      end: tripDates.endDate,
                    }) &&
                    'bg-[#EB5E28]',
                  isAfter(today, day) && 'text-gray-400 cursor-not-allowed',
                  !isAfter(today, day) && isToday(day) && 'text-red-500',
                  !isEqual(day, tripDates.startDate) &&
                    !isEqual(day, tripDates.endDate) &&
                    !isToday(day) &&
                    isSameMonth(day, firstDayCurrentMonth) &&
                    'text-gray-900',
                  !isEqual(day, tripDates.startDate) &&
                    !isEqual(day, tripDates.endDate) &&
                    !isToday(day) &&
                    !isSameMonth(day, firstDayCurrentMonth) &&
                    'text-gray-400',
                  'mx-auto flex h-8 w-8 items-center justify-center rounded-full',
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
      <div className="p-4">
        {tripDates.startDate && tripDates.endDate ? (
          <button
            onClick={createEvent}
            type="button"
            className="w-full py-2 px-4 bg-[#EB5E28] text-white rounded-full hover:bg-[#D54E23] transition-colors"
          >
            완료
          </button>
        ) : (
          <p className="text-center text-gray-500">
            Select start and end dates
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

function CalendarPopup() {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-[#FFFCF2] opacity-70 backdrop-filter backdrop-blur-xl"></div>
        </div>

        <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative z-10 flex flex-col">
          <div className="flex-grow overflow-hidden">
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPopup;
