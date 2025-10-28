import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import tripDatesAtom from '../../recoil/tripDates';
import RecoilDateRangePicker from '../datePickers/recoilDateRangePicker';
import { neumorphStyles } from '../../utils/style';

function Calendar() {
  const navigate = useNavigate();

  const createEvent = useCallback(() => {
    navigate('/com/destination');
  }, [navigate]);

  return (
    <div
      className={`${neumorphStyles.base} ${neumorphStyles.hover} rounded-2xl p-6 font-prompt h-full flex flex-col`}
    >
      <RecoilDateRangePicker
        atom={tripDatesAtom}
        showCompleteButton={true}
        onComplete={createEvent}
        completeButtonText="완료"
        size="default"
        allowPastDates={false}
      />
    </div>
  );
}

export default Calendar;
