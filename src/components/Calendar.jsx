import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import {
  add,
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
} from 'date-fns';
import { useState } from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Calendar() {
  const today = startOfToday();
  const [currentMonth, setCurrentMonth] = useState(format(today, 'yyyy-MMM'));
  const firstDayCurrentMonth = parse(currentMonth, 'yyyy-MMM', new Date());

  const [selectedStartDay, setSelectedStartDay] = useState(null);
  const [selectedEndDay, setSelectedEndDay] = useState(null);

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, 'yyyy-MMM'));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'yyyy-MMM'));
  }

  function handleDateClick(day) {
    if (!selectedStartDay || (selectedStartDay && selectedEndDay)) {
      setSelectedStartDay(day);
      setSelectedEndDay(null);
    } else {
      if (day < selectedStartDay) {
        setSelectedStartDay(day);
        setSelectedEndDay(selectedStartDay);
      } else {
        setSelectedEndDay(day);
      }
    }
  }

  function createEvent() {
    if (selectedStartDay && selectedEndDay) {
      const newEvent = {
        // eslint-disable-next-line no-undef
        id: meetings.length + 1,
        name: '여행',
        startDatetime: format(selectedStartDay, 'yyyy-MM-dd'),
        endDatetime: format(selectedEndDay, 'yyyy-MM-dd'),
      };
      // eslint-disable-next-line no-undef
      meetings.push(newEvent);
      setSelectedStartDay(null);
      setSelectedEndDay(null);
    }
  }

  return (
    <div className="bg-[#E9E8E5] font-prompt h-full flex flex-col">
      <div className="flex-grow overflow-y-auto">
        <div className="flex items-center justify-start p-4">
          <button
            type="button"
            onClick={previousMonth}
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
            onClick={nextMonth}
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
                className={classNames(
                  isEqual(day, selectedStartDay) && 'bg-[#EB5E28] text-white',
                  isEqual(day, selectedEndDay) && 'bg-[#EB5E28] text-white',
                  !isEqual(day, selectedStartDay) &&
                    !isEqual(day, selectedEndDay) &&
                    selectedStartDay &&
                    selectedEndDay &&
                    isWithinInterval(day, {
                      start: selectedStartDay,
                      end: selectedEndDay,
                    }) &&
                    'bg-[#EB5E28]',
                  !isEqual(day, selectedStartDay) &&
                    !isEqual(day, selectedEndDay) &&
                    isToday(day) &&
                    'text-red-500',
                  !isEqual(day, selectedStartDay) &&
                    !isEqual(day, selectedEndDay) &&
                    !isToday(day) &&
                    isSameMonth(day, firstDayCurrentMonth) &&
                    'text-gray-900',
                  !isEqual(day, selectedStartDay) &&
                    !isEqual(day, selectedEndDay) &&
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
        {selectedStartDay && selectedEndDay ? (
          <button
            onClick={createEvent}
            type="button"
            className="w-full py-2 px-4 bg-[#EB5E28] text-white rounded-full hover:bg-[#D54E23] transition-colors"
          >
            Create Event
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-[#FFFCF2] opacity-70 backdrop-filter backdrop-blur-xl"></div>
        </div>

        <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-[70vh] relative z-10">
          <Calendar />
        </div>
      </div>
    </div>
  );
}

export default CalendarPopup;
