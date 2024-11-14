import React, { createContext, useState, useContext, useCallback } from 'react';
import { format, isAfter, isEqual, startOfToday, parse } from 'date-fns';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const today = startOfToday();
  const [tripDates, setTripDates] = useState({
    startDate: null,
    endDate: null,
  });
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedSpots, setSelectedSpots] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(format(today, 'yyyy-MMM'));

  const handleDateClick = useCallback(
    day => {
      if (isAfter(day, today) || isEqual(day, today)) {
        setTripDates(prevDates => {
          if (
            !prevDates.startDate ||
            (prevDates.startDate && prevDates.endDate)
          ) {
            return { startDate: day, endDate: null };
          } else {
            return day < prevDates.startDate
              ? { startDate: day, endDate: prevDates.startDate }
              : { ...prevDates, endDate: day };
          }
        });
      }
    },
    [today],
  );

  const changeMonth = useCallback(amount => {
    setCurrentMonth(prevMonth => {
      const firstDayNextMonth = parse(
        prevMonth + '-01',
        'yyyy-MMM-dd',
        new Date(),
      );
      firstDayNextMonth.setMonth(firstDayNextMonth.getMonth() + amount);
      return format(firstDayNextMonth, 'yyyy-MMM');
    });
  }, []);

  const contextValue = {
    tripDates,
    setTripDates,
    selectedDestinations,
    setSelectedDestinations,
    selectedSpots,
    setSelectedSpots,
    currentMonth,
    handleDateClick,
    changeMonth,
  };

  return (
    <TripContext.Provider value={contextValue}>{children}</TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);
