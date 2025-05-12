import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { componentStyles, styleUtils } from '../../../utils/styles';
import { format, parse } from 'date-fns';
import LocalDateRangePicker from '../../datePickers/localDateRangePicker';

const Accommodation = ({
  accommodations: initialAccommodations,
  socket,
  tripId,
}) => {
  const [accommodations, setAccommodations] = useState(
    initialAccommodations || [],
  );
  const [newAccommodation, setNewAccommodation] = useState({
    name: '',
    checkIn: '',
    checkOut: '',
    note: '',
    address: '',
    price: '',
    bookingReference: '',
    status: '예약완료',
  });
  const [selectedRow, setSelectedRow] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [editingAccommodation, setEditingAccommodation] = useState(null);

  useEffect(() => {
    if (initialAccommodations) {
      setAccommodations(initialAccommodations);
    }
  }, [initialAccommodations]);

  useEffect(() => {
    if (socket) {
      socket.on('accommodationAdded', (data) => {
        setAccommodations((prev) => [...prev, data.accommodation]);
      });

      socket.on('accommodationUpdated', (data) => {
        setAccommodations((prev) =>
          prev.map((acc) =>
            acc.id === data.accommodation.id ? data.accommodation : acc,
          ),
        );
      });

      socket.on('accommodationDeleted', (data) => {
        setAccommodations((prev) =>
          prev.filter((acc) => acc.id !== data.accommodationId),
        );
      });

      return () => {
        socket.off('accommodationAdded');
        socket.off('accommodationUpdated');
        socket.off('accommodationDeleted');
      };
    }
  }, [socket]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccommodation((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAccommodation = () => {
    if (
      newAccommodation.name &&
      newAccommodation.checkIn &&
      newAccommodation.checkOut
    ) {
      const accommodation = {
        id: Date.now(),
        name: newAccommodation.name,
        checkIn: newAccommodation.checkIn,
        checkOut: newAccommodation.checkOut,
        note: newAccommodation.note || null,
        address: newAccommodation.address || null,
        price: newAccommodation.price || null,
        bookingReference: newAccommodation.bookingReference || null,
        status: newAccommodation.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      socket.emit('addAccommodation', { tripId, accommodation });

      setAccommodations((prev) => [...prev, accommodation]);

      setNewAccommodation({
        name: '',
        checkIn: '',
        checkOut: '',
        note: '',
        address: '',
        price: '',
        bookingReference: '',
        status: '예약완료',
      });
      setDateRange({
        startDate: null,
        endDate: null,
      });
    }
  };

  const handleUpdateAccommodation = (id, updatedData) => {
    socket.emit('updateAccommodation', {
      tripId,
      accommodation: { id, ...updatedData },
    });
  };

  const handleDeleteAccommodation = (id) => {
    if (socket) {
      socket.emit('deleteAccommodation', { tripId, accommodationId: id });

      setAccommodations((prev) => prev.filter((acc) => acc.id !== id));
    }
  };

  const handleFieldClick = (accommodation, field) => {
    setEditingAccommodation({
      ...accommodation,
      editingField: field,
    });
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    const updatedAccommodation = {
      ...editingAccommodation,
      [name]: value,
      updatedAt: new Date().toISOString(),
    };
    setEditingAccommodation(updatedAccommodation);
    socket.emit('updateAccommodation', {
      tripId,
      accommodation: updatedAccommodation,
    });
  };

  const handleDateClick = (accommodation) => {
    setEditingAccommodation({
      ...accommodation,
      editingField: 'date',
    });
    setShowCalendar(true);
    setDateRange({
      startDate: parse(accommodation.checkIn, 'yyyy-MM-dd', new Date()),
      endDate: parse(accommodation.checkOut, 'yyyy-MM-dd', new Date()),
    });
  };

  const handleCalendarToggle = () => {
    setShowCalendar((prev) => !prev);
  };

  const handleDateRangeChange = (startDate, endDate) => {
    if (startDate && endDate) {
      setDateRange({ startDate, endDate });
      setNewAccommodation((prev) => ({
        ...prev,
        checkIn: format(startDate, 'yyyy-MM-dd'),
        checkOut: format(endDate, 'yyyy-MM-dd'),
      }));
      setShowCalendar(false);
    } else {
      setDateRange({ startDate, endDate });
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    return format(date, 'yyyy.MM.dd');
  };

  return (
    <div className="bg-[var(--color-background-gray)] font-prompt p-6 rounded-lg shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-1/6 p-2 text-left text-gray-600">숙소명</th>
              <th className="w-1/2 p-2 text-left text-gray-600">
                체크인/체크아웃
              </th>
              <th className="w-1/4 p-2 text-left text-gray-600">메모</th>
              <th className="w-16 p-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-[#E0DFDE]/50 transition-colors duration-200">
              <td className="p-3">
                <input
                  type="text"
                  name="name"
                  value={newAccommodation.name}
                  onChange={handleInputChange}
                  placeholder="숙소명"
                  className="w-full bg-[var(--color-background-gray)] rounded-full px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]"
                />
              </td>
              <td className="p-3">
                <div className="relative">
                  <input
                    type="text"
                    value={
                      newAccommodation.checkIn && newAccommodation.checkOut
                        ? `${formatDateForDisplay(newAccommodation.checkIn)} - ${formatDateForDisplay(newAccommodation.checkOut)}`
                        : ''
                    }
                    placeholder="체크인/체크아웃 날짜 선택"
                    readOnly
                    className="w-full bg-[var(--color-background-gray)] rounded-full px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff] pr-16"
                    onClick={handleCalendarToggle}
                  />
                  <button
                    onClick={handleCalendarToggle}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff] transition-all duration-200"
                  >
                    📅
                  </button>
                </div>
              </td>
              <td className="p-3">
                <input
                  type="text"
                  name="note"
                  value={newAccommodation.note}
                  onChange={handleInputChange}
                  placeholder="메모"
                  className="w-full bg-[var(--color-background-gray)] rounded-full px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]"
                />
              </td>
              <td className="p-3 text-right">
                <button
                  onClick={handleAddAccommodation}
                  className="flex items-center justify-center rounded-full transition-all duration-200 shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff] w-20 py-2 text-white text-lg gap-2 hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff] bg-[var(--color-primary)] hover:bg-[#D54E23] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  disabled={
                    !newAccommodation.name ||
                    !newAccommodation.checkIn ||
                    !newAccommodation.checkOut
                  }
                >
                  <span className="text-lg">✓</span> 추가
                </button>
              </td>
            </tr>
            {accommodations &&
              accommodations.map((accommodation) => (
                <tr
                  key={accommodation.id}
                  className="hover:bg-[#E0DFDE]/50 transition-colors duration-200"
                >
                  <td className="p-3 rounded-full shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]">
                    {editingAccommodation?.id === accommodation.id &&
                    editingAccommodation.editingField === 'name' ? (
                      <input
                        type="text"
                        name="name"
                        value={editingAccommodation.name}
                        onChange={handleFieldChange}
                        onBlur={() => setEditingAccommodation(null)}
                        autoFocus
                        className="w-full bg-[var(--color-background-gray)] rounded-full px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]"
                      />
                    ) : (
                      <div
                        onClick={() => handleFieldClick(accommodation, 'name')}
                        className="cursor-pointer"
                      >
                        {accommodation.name}
                      </div>
                    )}
                  </td>
                  <td className="p-3 rounded-full shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]">
                    <div
                      onClick={() => handleDateClick(accommodation)}
                      className="cursor-pointer"
                    >
                      {`${formatDateForDisplay(accommodation.checkIn)} - ${formatDateForDisplay(accommodation.checkOut)}`}
                    </div>
                  </td>
                  <td className="p-3 rounded-full shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]">
                    {editingAccommodation?.id === accommodation.id &&
                    editingAccommodation.editingField === 'note' ? (
                      <input
                        type="text"
                        name="note"
                        value={editingAccommodation.note || ''}
                        onChange={handleFieldChange}
                        onBlur={() => setEditingAccommodation(null)}
                        autoFocus
                        className="w-full bg-[var(--color-background-gray)] rounded-full px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]"
                      />
                    ) : (
                      <div
                        onClick={() => handleFieldClick(accommodation, 'note')}
                        className="cursor-pointer"
                      >
                        {accommodation.note || '-'}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAccommodation(accommodation.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-full shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff] transition-all duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {showCalendar && (
        <div className="mt-4 rounded-lg shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff]">
          <LocalDateRangePicker
            initialDates={dateRange}
            onDateRangeChange={(startDate, endDate) => {
              if (startDate && endDate) {
                setDateRange({ startDate, endDate });
                if (editingAccommodation) {
                  const updatedAccommodation = {
                    ...editingAccommodation,
                    checkIn: format(startDate, 'yyyy-MM-dd'),
                    checkOut: format(endDate, 'yyyy-MM-dd'),
                    updatedAt: new Date().toISOString(),
                  };
                  setEditingAccommodation(null);
                  socket.emit('updateAccommodation', {
                    tripId,
                    accommodation: updatedAccommodation,
                  });
                } else {
                  setNewAccommodation((prev) => ({
                    ...prev,
                    checkIn: format(startDate, 'yyyy-MM-dd'),
                    checkOut: format(endDate, 'yyyy-MM-dd'),
                  }));
                }
                setShowCalendar(false);
              } else {
                setDateRange({ startDate, endDate });
              }
            }}
            showCompleteButton={true}
            onComplete={() => setShowCalendar(false)}
            completeButtonText="날짜 선택 완료"
          />
        </div>
      )}
    </div>
  );
};

export default Accommodation;
