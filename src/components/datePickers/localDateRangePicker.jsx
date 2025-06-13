import React, { useState } from 'react';
import DateRangePicker from './dateRangePicker';

function LocalDateRangePicker({
  initialDates = { startDate: null, endDate: null },
  showCompleteButton = false,
  onComplete,
  completeButtonText = '완료',
  size = 'default',
  allowPastDates = false,
  onDateRangeChange: externalOnDateRangeChange,
}) {
  const [dates, setDates] = useState(initialDates);

  const handleDateRangeChange = (startDate, endDate) => {
    setDates({ startDate, endDate });
    if (externalOnDateRangeChange) {
      externalOnDateRangeChange(startDate, endDate);
    }
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

export default LocalDateRangePicker;
