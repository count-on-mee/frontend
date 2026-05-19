import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import tripDatesAtom from '../../recoil/tripDates';
import RecoilDateRangePicker from '../datePickers/recoilDateRangePicker';
import { neumorphStyles } from '../../utils/style';
import { useIsDesktop } from '../../hooks/useMediaQuery';

function Calendar() {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  const createEvent = useCallback(() => {
    navigate('/com/destination');
  }, [navigate]);

  return (
    <div
      className={`${neumorphStyles.base} ${neumorphStyles.hover} rounded-2xl p-3 sm:p-6 font-prompt h-full flex flex-col`}
    >
      <RecoilDateRangePicker
        atom={tripDatesAtom}
        showCompleteButton={true}
        onComplete={createEvent}
        completeButtonText="완료"
        size={isDesktop ? 'default' : 'small'}
        allowPastDates={false}
      />
    </div>
  );
}

export default Calendar;
