import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import tripDatesAtom from '../../recoil/tripDates';
import RecoilDateRangePicker from '../datePickers/recoilDateRangePicker';

function Calendar() {
  const navigate = useNavigate();

  const createEvent = useCallback(() => {
    navigate('/com/destination');
  }, [navigate]);

  return (
    <div className="bg-[#EBEAE9] font-prompt h-full flex flex-col p-4">
      <div className="flex-grow overflow-y-auto">
        <RecoilDateRangePicker
          atom={tripDatesAtom}
          showCompleteButton={true}
          onComplete={createEvent}
          completeButtonText="완료"
          size="default"
          allowPastDates={false}
        />
      </div>
    </div>
  );
}

export default Calendar;
