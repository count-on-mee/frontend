import React, { useEffect } from 'react';
import clsx from 'clsx';
import useAccommodations from '../../hooks/useAccommodations';
import { useSocketDebounce } from '../../utils/debounce';
import { componentStyles } from '../../utils/style';

import AccommodationRow from './AccommodationRow';

const AccommodationSection = ({
  accommodations: initialAccommodations,
  socket,
  tripId,
}) => {
  const debouncedSocketEmit = useSocketDebounce(socket, 800);
  const {
    accommodations,
    newRow,
    selectedRow,
    setSelectedRow,
    handleRowClick,
    handleInputChange,
    handleNewRowInputChange,
    confirmNewRow,
    deleteRow,
    setNewRow,
    finishEdit,
    setAccommodations,
  } = useAccommodations(initialAccommodations);

  // 소켓 이벤트 리스너 등록
  useEffect(() => {
    if (!socket) return;
    const handleAdded = (newAccommodation) => {
      setAccommodations((prev) => [...prev, newAccommodation]);
    };
    const handleUpdated = ({
      tripDocumentAccommodationId,
      accommodationFields,
    }) => {
      setAccommodations((prev) =>
        prev.map((accommodation) =>
          accommodation.tripDocumentAccommodationId ===
          tripDocumentAccommodationId
            ? { ...accommodation, ...accommodationFields }
            : accommodation,
        ),
      );
    };
    const handleDeleted = ({ tripDocumentAccommodationId }) => {
      setAccommodations((prev) =>
        prev.filter(
          (accommodation) =>
            accommodation.tripDocumentAccommodationId !==
            tripDocumentAccommodationId,
        ),
      );
    };
    socket.on('accommodationAdded', handleAdded);
    socket.on('accommodationUpdated', handleUpdated);
    socket.on('accommodationDeleted', handleDeleted);
    return () => {
      socket.off('accommodationAdded', handleAdded);
      socket.off('accommodationUpdated', handleUpdated);
      socket.off('accommodationDeleted', handleDeleted);
    };
  }, [socket]);

  // 입력/수정 시 소켓 emit
  const handleRowInputChange = (index, field, value) => {
    handleInputChange(index, field, value);
    const item = accommodations[index];
    if (item && item.tripDocumentAccommodationId) {
      debouncedSocketEmit('updateAccommodation', {
        tripDocumentAccommodationId: item.tripDocumentAccommodationId,
        accommodationFields: { [field]: value },
      });
    }
  };

  // 날짜 변경 시 소켓 emit
  const handleRowDateChange = (index, startDate, endDate) => {
    handleInputChange(
      index,
      'checkInDate',
      startDate ? startDate.toISOString().slice(0, 10) : '',
    );
    handleInputChange(
      index,
      'checkOutDate',
      endDate ? endDate.toISOString().slice(0, 10) : '',
    );
    const item = accommodations[index];
    if (item && item.tripDocumentAccommodationId) {
      debouncedSocketEmit('updateAccommodation', {
        tripDocumentAccommodationId: item.tripDocumentAccommodationId,
        accommodationFields: {
          checkInDate: startDate ? startDate.toISOString().slice(0, 10) : '',
          checkOutDate: endDate ? endDate.toISOString().slice(0, 10) : '',
        },
      });
    }
  };

  // 새 행 추가(완료)
  const handleConfirmNewRow = () => {
    if (
      newRow &&
      newRow.accommodation &&
      newRow.checkInDate &&
      newRow.checkOutDate
    ) {
      debouncedSocketEmit('addAccommodation', {
        accommodationData: {
          accommodation: newRow.accommodation,
          checkInDate: newRow.checkInDate,
          checkOutDate: newRow.checkOutDate,
          memo: newRow.memo || null,
        },
      });
      confirmNewRow();
    }
  };

  // 행 삭제
  const handleDeleteRow = (index) => {
    const item = accommodations[index];
    if (item && item.tripDocumentAccommodationId) {
      debouncedSocketEmit('deleteAccommodation', {
        tripDocumentAccommodationId: item.tripDocumentAccommodationId,
      });
    }
    deleteRow(index);
  };

  // 새 행 입력 활성화
  const handleShowNewRow = () => {
    setNewRow({
      accommodation: '',
      checkInDate: '',
      checkOutDate: '',
      memo: '',
    });
    setSelectedRow(null);
  };

  return (
    <div className="bg-[var(--color-background-gray)] font-prompt p-6 rounded-lg shadow-[4px_4px_8px_#b8b8b8,-4px_-4px_8px_#ffffff]">
      <table className="w-full table-fixed">
        <thead>
          <tr>
            <th className="w-1/4 p-2">
              <span className={componentStyles.header}>숙소명</span>
            </th>
            <th className="w-1/3 p-2">
              <span className={componentStyles.header}>체크인 ~ 체크아웃</span>
            </th>
            <th className="w-1/3 p-2">
              <span className={componentStyles.header}>메모</span>
            </th>
            <th className="w-12 p-2"></th>
          </tr>
        </thead>
        <tbody>
          {accommodations.map((item, idx) => (
            <AccommodationRow
              key={item.tripDocumentAccommodationId || `placeholder-${idx}`}
              item={item}
              index={idx}
              isPlaceholder={item.isPlaceholder}
              isSelected={selectedRow === idx}
              onRowClick={handleRowClick}
              onDeleteRow={handleDeleteRow}
              onInputChange={handleRowInputChange}
              onNewRowInputChange={handleNewRowInputChange}
              onDateChange={handleRowDateChange}
            />
          ))}
          {newRow && (
            <AccommodationRow
              item={newRow}
              index={accommodations.length}
              isNewRow={true}
              isSelected={false}
              onRowClick={() => {}}
              onDeleteRow={() => setNewRow(null)}
              onInputChange={() => {}}
              onNewRowInputChange={handleNewRowInputChange}
              onDateChange={() => {}}
            />
          )}
        </tbody>
      </table>
      {/* 새 행 추가 버튼 */}
      {!newRow && (
        <div className="p-2">
          <button
            onClick={handleShowNewRow}
            className="px-6 py-2 rounded-lg shadow-[2px_2px_4px_#b8b8b8,-2px_-2px_4px_#ffffff] hover:shadow-[inset_2px_2px_4px_#b8b8b8,inset_-2px_-2px_4px_#ffffff] transition-all duration-200 bg-[var(--color-primary)] text-white font-medium"
          >
            <span className="text-lg">+</span> 숙소 추가
          </button>
        </div>
      )}
      {/* 새 행 입력 완료 버튼 */}
      {newRow && (
        <div className="p-2">
          <button
            onClick={handleConfirmNewRow}
            className={clsx(
              'px-6 py-2 rounded-lg font-medium',
              newRow.accommodation && newRow.checkInDate && newRow.checkOutDate
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300',
            )}
            disabled={
              !(
                newRow.accommodation &&
                newRow.checkInDate &&
                newRow.checkOutDate
              )
            }
          >
            <span className="text-lg">✓</span> 완료
          </button>
        </div>
      )}
    </div>
  );
};

export default AccommodationSection;
