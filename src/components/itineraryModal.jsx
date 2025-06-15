import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import tripDatesAtom from '../recoil/tripDates/atom';
import useTripItinerary from '../hooks/useTripItinerary';
import { itineraryModalStyles } from '../utils/style';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { addDays, format } from 'date-fns';
import clsx from 'clsx';

// Sortable Item 컴포넌트
const SortableItem = ({ id, spot, onDelete, loading }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging && {
      opacity: 0.8,
      background: '#f0f0f0',
      cursor: 'grabbing',
    }),
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={itineraryModalStyles.itineraryItem}
    >
      <span className="text-[#252422]">{spot.spot?.name || spot.name}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(spot.tripItineraryId || spot.itineraryId || spot.id);
        }}
        disabled={loading}
        className={itineraryModalStyles.deleteButton}
      >
        삭제
      </button>
    </li>
  );
};

const ItineraryModal = ({ open, onClose, tripId, days, spots, onSave }) => {
  const { addItinerary, moveItineraries, updateItinerary, deleteItinerary } =
    useTripItinerary(tripId);
  const [tripDates] = useRecoilState(tripDatesAtom);
  const [itinerary, setItinerary] = useState(spots);
  const [loading, setLoading] = useState(false);
  const [pendingMoves, setPendingMoves] = useState([]);
  const [activeId, setActiveId] = useState(null);

  // DnD Kit 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    setItinerary(spots);
  }, [spots, days]);

  // useMemo로 메모이제이션하여 불필요한 리렌더링 방지
  const safeItinerary = useMemo(() => {
    const safeDays = days.map((day) => Number(day));
    const result = safeDays.map((day) => {
      const existingDay = itinerary.find((item) => Number(item.day) === day);
      return existingDay || { day, list: [] };
    });

    return result;
  }, [days, itinerary]);

  // @dnd-kit 드래그 핸들러
  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;

      setActiveId(null);

      if (!over || active.id === over.id || loading) {
        return;
      }

      // ID에서 day와 spot 정보 추출
      const activeId = String(active.id);
      const overId = String(over.id);

      const [, activeDay, , activeSpotId] = activeId.split('-');
      const [, overDay, , overSpotId] = overId.split('-');

      const sourceDayIdx = safeItinerary.findIndex(
        (d) => Number(d.day) === Number(activeDay),
      );
      const destDayIdx = safeItinerary.findIndex(
        (d) => Number(d.day) === Number(overDay),
      );

      if (sourceDayIdx === -1 || destDayIdx === -1) return;

      const sourceList = Array.from(safeItinerary[sourceDayIdx].list);
      const destList =
        activeDay === overDay
          ? sourceList
          : Array.from(safeItinerary[destDayIdx].list);

      const activeIndex = sourceList.findIndex(
        (item) =>
          String(item.tripItineraryId || item.itineraryId || item.id) ===
          activeSpotId,
      );
      const overIndex = destList.findIndex(
        (item) =>
          String(item.tripItineraryId || item.itineraryId || item.id) ===
          overSpotId,
      );

      if (activeIndex === -1 || overIndex === -1) return;

      const newItinerary = [...safeItinerary];

      if (activeDay === overDay) {
        // 같은 날짜 내 이동
        const reorderedList = arrayMove(sourceList, activeIndex, overIndex);
        const newList = reorderedList.map((item, idx) => ({
          ...item,
          order: idx + 1,
        }));

        newItinerary[sourceDayIdx] = {
          ...newItinerary[sourceDayIdx],
          list: newList,
        };

        setPendingMoves((prev) => {
          const filtered = prev.filter(
            (m) => Number(m.day) !== Number(activeDay),
          );
          const newMoves = newList
            .map((item) => {
              const itineraryId = Number(item.tripItineraryId);
              const day = Number(activeDay);
              const order = Number(item.order);
              if (!Number.isInteger(itineraryId)) {
                console.warn('tripItineraryId가 정수가 아님:', item);
                return null;
              }
              return { itineraryId, day, order };
            })
            .filter(
              (move) =>
                move &&
                Number.isInteger(move.itineraryId) &&
                Number.isInteger(move.day) &&
                Number.isInteger(move.order),
            );
          return [...filtered, ...newMoves];
        });
      } else {
        // 다른 날짜 간 이동
        const [removed] = sourceList.splice(activeIndex, 1);
        destList.splice(overIndex, 0, removed);

        const newSourceList = sourceList.map((item, idx) => ({
          ...item,
          order: idx + 1,
        }));
        const newDestList = destList.map((item, idx) => ({
          ...item,
          order: idx + 1,
        }));

        newItinerary[sourceDayIdx] = {
          ...newItinerary[sourceDayIdx],
          list: newSourceList,
        };
        newItinerary[destDayIdx] = {
          ...newItinerary[destDayIdx],
          list: newDestList,
        };

        setPendingMoves((prev) => {
          const filtered = prev.filter(
            (m) =>
              Number(m.day) !== Number(activeDay) &&
              Number(m.day) !== Number(overDay),
          );
          const newMoves = newSourceList
            .map((item) => {
              const itineraryId = Number(item.tripItineraryId);
              const day = Number(activeDay);
              const order = Number(item.order);
              if (!Number.isInteger(itineraryId)) {
                console.warn('tripItineraryId가 정수가 아님:', item);
                return null;
              }
              return { itineraryId, day, order };
            })
            .filter(
              (move) =>
                move &&
                Number.isInteger(move.itineraryId) &&
                Number.isInteger(move.day) &&
                Number.isInteger(move.order),
            );
          const newMovesDest = newDestList
            .map((item) => {
              const itineraryId = Number(item.tripItineraryId);
              const day = Number(overDay);
              const order = Number(item.order);
              if (!Number.isInteger(itineraryId)) {
                console.warn('tripItineraryId가 정수가 아님:', item);
                return null;
              }
              return { itineraryId, day, order };
            })
            .filter(
              (move) =>
                move &&
                Number.isInteger(move.itineraryId) &&
                Number.isInteger(move.day) &&
                Number.isInteger(move.order),
            );
          return [...filtered, ...newMoves, ...newMovesDest];
        });
      }

      setItinerary(newItinerary);
    },
    [loading, safeItinerary],
  );

  const handleAddSpot = async (spotId, day, order) => {
    setLoading(true);
    try {
      await addItinerary({ spotId, day, order });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSpot = async (itineraryId) => {
    setLoading(true);
    try {
      await deleteItinerary(itineraryId);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (pendingMoves.length > 0) {
        // 원본 데이터와 비교하여 실제로 변경된 스팟만 필터링
        const originalSpots = spots.reduce((acc, day) => {
          day.list.forEach((spot) => {
            const spotId = spot.tripItineraryId || spot.itineraryId || spot.id;
            acc[spotId] = {
              day: Number(day.day),
              order: Number(spot.order),
            };
          });
          return acc;
        }, {});

        // 실제로 변경된 스팟만 필터링
        const changedMoves = pendingMoves
          .map((move) => ({
            itineraryId: Number(move.itineraryId),
            day: Number(move.day),
            order: Number(move.order),
          }))
          .filter((move) => {
            const originalSpot = originalSpots[move.itineraryId];
            return (
              !originalSpot ||
              originalSpot.day !== move.day ||
              originalSpot.order !== move.order
            );
          });

        if (changedMoves.length > 0) {
          await moveItineraries({ moves: changedMoves });
        }
      }
      onSave?.();
      onClose();
    } catch (e) {
      alert('저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Day별 날짜 계산 함수
  const getDateByDay = (day, date) => {
    if (date) return formatKoreanDate(date);
    if (!tripDates.startDate) return '';
    const d = addDays(new Date(tripDates.startDate), day - 1);
    return formatKoreanDate(format(d, 'yyyy-MM-dd'));
  };

  // 날짜 포맷 함수 (YYYY년 MM월 DD일)
  const formatKoreanDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getFullYear()}년 ${String(d.getMonth() + 1).padStart(2, '0')}월 ${String(d.getDate()).padStart(2, '0')}일`;
  };

  if (!open) return null;

  return (
    <div className={itineraryModalStyles.modalBg}>
      <div
        className={clsx(
          itineraryModalStyles.modalContent,
          'min-w-[900px] max-w-[95vw]',
        )}
      >
        {/* 상단 날짜 UI - tripItinerary 기준 */}
        <div className={itineraryModalStyles.dateContainer}>
          <div className={itineraryModalStyles.dateBox}>
            {safeItinerary[0]?.date
              ? formatKoreanDate(safeItinerary[0].date)
              : getDateByDay(safeItinerary[0]?.day)}
          </div>
          <div className={itineraryModalStyles.dateBox}>
            {safeItinerary[safeItinerary.length - 1]?.date
              ? formatKoreanDate(safeItinerary[safeItinerary.length - 1].date)
              : getDateByDay(safeItinerary[safeItinerary.length - 1]?.day)}
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className={itineraryModalStyles.itineraryContainer}>
            {safeItinerary.map((dayItem) => {
              const daySpots = dayItem.list.filter((spot) => {
                const spotId =
                  spot.tripItineraryId || spot.itineraryId || spot.id;
                return spotId && spotId !== undefined && spotId !== null;
              });

              const spotIds = daySpots.map((spot) => {
                const spotId =
                  spot.tripItineraryId || spot.itineraryId || spot.id;
                return `day-${dayItem.day}-spot-${String(spotId)}`;
              });

              return (
                <div
                  key={`day-${dayItem.day}`}
                  className={itineraryModalStyles.itineraryCard}
                >
                  <h4 className={itineraryModalStyles.itineraryTitle}>
                    Day{dayItem.day}
                    <span className={itineraryModalStyles.itineraryDate}>
                      {getDateByDay(dayItem.day, dayItem.date)}
                    </span>
                  </h4>
                  <SortableContext
                    items={spotIds}
                    strategy={verticalListSortingStrategy}
                  >
                    <ul className={itineraryModalStyles.itineraryList}>
                      {daySpots.map((spot) => {
                        const spotId =
                          spot.tripItineraryId || spot.itineraryId || spot.id;
                        const id = `day-${dayItem.day}-spot-${String(spotId)}`;
                        return (
                          <SortableItem
                            key={id}
                            id={id}
                            spot={spot}
                            onDelete={handleDeleteSpot}
                            loading={loading}
                          />
                        );
                      })}
                    </ul>
                  </SortableContext>
                </div>
              );
            })}
          </div>
          <DragOverlay>
            {activeId ? (
              <div className={itineraryModalStyles.dragOverlay}>
                드래그 중...
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* 완료/취소 버튼 */}
        <div className={itineraryModalStyles.buttonContainer}>
          <button
            onClick={handleSave}
            disabled={loading}
            className={clsx(
              itineraryModalStyles.completeButton,
              'bg-[var(--color-primary)] hover:bg-[#D54E23]',
            )}
          >
            완료
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className={itineraryModalStyles.cancelButton}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryModal;
