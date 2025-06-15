import React from 'react';
import { useRecoilState } from 'recoil';
import DateRangePicker from './dateRangePicker';

function RecoilDateRangePicker({
  atom,
  showCompleteButton = false,
  onComplete,
  completeButtonText = '완료',
  size = 'default',
  allowPastDates = false,
}) {
  const [dates, setDates] = useRecoilState(atom);

  const handleDateRangeChange = (startDate, endDate) => {
    setDates({ startDate, endDate });
  };

  return (
    <DateRangePicker
      startDate={dates.startDate}
      endDate={dates.endDate}
      onDateRangeChange={handleDateRangeChange}
      showCompleteButton={showCompleteButton}
      onComplete={onComplete}
      completeButtonText={completeButtonText}
      size={size}
      allowPastDates={allowPastDates}
    />
  );
}

export default RecoilDateRangePicker;
