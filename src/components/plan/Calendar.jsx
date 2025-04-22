import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import tripDatesAtom from '../../recoil/tripDates';
import currentMonthAtom from '../../recoil/currentMonth';
import { startOfToday } from 'date-fns';
import DateRangePicker from '../common/DateRangePicker';

function Calendar() {
  const navigate = useNavigate();
  const [tripDates, setTripDates] = useRecoilState(tripDatesAtom);
  const today = startOfToday();

  const handleDateRangeChange = useCallback(
    (startDate, endDate) => {
      setTripDates({ startDate, endDate });
    },
    [setTripDates],
  );

  const createEvent = useCallback(() => {
    if (tripDates.startDate && tripDates.endDate) {
      navigate('/com/destination');
    }
  }, [tripDates, navigate]);

  return (
    <div className="bg-[#EBEAE9] font-prompt h-full flex flex-col p-4">
      <div className="flex-grow overflow-y-auto">
        <DateRangePicker
          startDate={tripDates.startDate}
          endDate={tripDates.endDate}
          onDateRangeChange={handleDateRangeChange}
          allowPastDates={false}
          showCompleteButton={true}
          onComplete={createEvent}
          completeButtonText="완료"
          size="default"
        />
      </div>
    </div>
  );
}

export default Calendar;
