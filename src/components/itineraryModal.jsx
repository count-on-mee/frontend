import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import tripDatesAtom from '../recoil/tripDates/atom';
import useTripItinerary from '../hooks/useTripItinerary';
import LoadingSpinner from './loadingSpinner';
import { itineraryModalStyles } from '../utils/style';
import AddSpotSection from './itinerary/addSpotSection';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
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

const getSpotId = (spot) => {
  return spot.tripItineraryId || spot.itineraryId || spot.id;
};

const DroppableDayCard = ({ day, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `day-${day}-drop`,
  });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        itineraryModalStyles.itineraryCard,
        isOver && 'ring-2 ring-[#f5861d] ring-opacity-50',
      )}
    >
      {children}
    </div>
  );
};

const SortableItem = ({ id, spot, onDeleteClick, loading }) => {
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
          e.preventDefault();
          onDeleteClick(getSpotId(spot));
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
        disabled={loading}
        className={itineraryModalStyles.deleteButton}
        aria-label={`${spot.spot?.name || spot.name} 삭제`}
      >
        삭제
      </button>
    </li>
  );
};

const ItineraryModal = ({
  open,
  onClose,
  tripId,
  days,
  spots,
  onSave,
  onRefetch,
}) => {
  const { moveItineraries, deleteItinerary, addItinerary, refetch } =
    useTripItinerary(tripId);
  const [tripDates] = useRecoilState(tripDatesAtom);
  const [itinerary, setItinerary] = useState(spots);
  const [loading, setLoading] = useState(false);
  const [pendingMoves, setPendingMoves] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (open) {
      setItinerary(spots);
    }
  }, [spots, days, open]);

  const safeItinerary = useMemo(() => {
    const safeDays = days.map((day) => Number(day));
    const result = safeDays.map((day) => {
      const existingDay = itinerary.find((item) => Number(item.day) === day);
      return existingDay || { day, list: [] };
    });

    return result;
  }, [days, itinerary]);

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

      const activeId = String(active.id);
      const overId = String(over.id);

      const [, activeDay, , activeSpotId] = activeId.split('-');

      const isOverDayCard = overId.includes('-drop');
      let overDay, overSpotId;

      if (isOverDayCard) {
        [, overDay] = overId.split('-');
        overSpotId = null;
      } else {
        [, overDay, , overSpotId] = overId.split('-');
      }

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
        (item) => String(getSpotId(item)) === activeSpotId,
      );

      if (activeIndex === -1) return;

      if (isOverDayCard) {
        const overIndex = destList.length;
        if (activeDay === overDay) return;

        const newItinerary = [...safeItinerary];
        const [removed] = sourceList.splice(activeIndex, 1);

        const removedId = getSpotId(removed);

        if (
          !removedId ||
          Number(removedId) === 0 ||
          !Number.isInteger(Number(removedId))
        ) {
          return;
        }

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
              const spotId = getSpotId(item);
              const itineraryId = Number(spotId);
              const day = Number(activeDay);
              const order = Number(item.order);
              if (!Number.isInteger(itineraryId) || itineraryId === 0) {
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
              const spotId = getSpotId(item);
              const itineraryId = Number(spotId);
              const day = Number(overDay);
              const order = Number(item.order);
              if (!Number.isInteger(itineraryId) || itineraryId === 0) {
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

        setItinerary(newItinerary);
        return;
      }

      const overIndex = destList.findIndex(
        (item) => String(getSpotId(item)) === overSpotId,
      );

      if (overIndex === -1) return;

      const newItinerary = [...safeItinerary];

      if (activeDay === overDay) {
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
              const itineraryId = Number(getSpotId(item));
              const day = Number(activeDay);
              const order = Number(item.order);
              if (!Number.isInteger(itineraryId)) {
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
              const itineraryId = Number(getSpotId(item));
              const day = Number(activeDay);
              const order = Number(item.order);
              if (!Number.isInteger(itineraryId)) {
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
              const itineraryId = Number(getSpotId(item));
              const day = Number(overDay);
              const order = Number(item.order);
              if (!Number.isInteger(itineraryId)) {
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

  const handleDeleteSpot = async (itineraryId) => {
    if (!itineraryId) return;

    try {
      await deleteItinerary(itineraryId);

      setItinerary((prev) => {
        return prev.map((dayItem) => ({
          ...dayItem,
          list: dayItem.list.filter((spot) => getSpotId(spot) !== itineraryId),
        }));
      });

      setPendingMoves((prev) =>
        prev.filter((move) => move.itineraryId !== itineraryId),
      );

      if (onRefetch) {
        await onRefetch();
      } else {
        await refetch();
      }
    } catch (error) {
      console.error('일정 삭제 실패:', error);
      alert(
        `일정 삭제에 실패했습니다: ${error.response?.data?.message || error.message || '알 수 없는 오류'}`,
      );
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (pendingMoves.length > 0) {
        const originalSpotsFromProps = spots.reduce((acc, day) => {
          day.list.forEach((spot) => {
            const spotId = getSpotId(spot);
            const numericId = Number(spotId);
            if (Number.isInteger(numericId) && numericId > 0) {
              acc[numericId] = {
                day: Number(day.day),
                order: Number(spot.order),
              };
            }
          });
          return acc;
        }, {});

        const finalSpots = { ...originalSpotsFromProps };
        pendingMoves.forEach((move) => {
          const moveId = Number(move.itineraryId);
          finalSpots[moveId] = {
            day: Number(move.day),
            order: Number(move.order),
          };
        });

        const changedMoves = pendingMoves
          .map((move) => ({
            itineraryId: Number(move.itineraryId),
            day: Number(move.day),
            order: Number(move.order),
          }))
          .filter((move) => {
            const originalSpot = originalSpotsFromProps[move.itineraryId];
            const finalSpot = finalSpots[move.itineraryId];

            if (!originalSpot) {
              return false;
            }

            const isChanged =
              originalSpot.day !== finalSpot.day ||
              originalSpot.order !== finalSpot.order;

            return isChanged;
          });

        if (changedMoves.length > 0) {
          await moveItineraries({ moves: changedMoves });
        }
      }
      onSave?.();
      onClose();
    } catch (e) {
      console.error('저장 실패:', e);
      console.error('에러 응답:', e.response?.data);
      console.error('요청 페이로드:', e.config?.data);
      alert(
        `저장에 실패했습니다: ${e.response?.data?.message || e.message || '알 수 없는 오류'}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const getDateByDay = (day, date) => {
    if (date) return formatKoreanDate(date);
    if (!tripDates.startDate) return '';
    const d = addDays(new Date(tripDates.startDate), day - 1);
    return formatKoreanDate(format(d, 'yyyy-MM-dd'));
  };

  const formatKoreanDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getFullYear()}년 ${String(d.getMonth() + 1).padStart(2, '0')}월 ${String(d.getDate()).padStart(2, '0')}일`;
  };

  const handleAddSpotToDay = async (spot, day, order) => {
    try {
      await addItinerary({
        spotId: spot.spotId,
        day: Number(day),
        order,
      });

      if (onRefetch) {
        await onRefetch();
      } else {
        await refetch();
      }
    } catch (error) {
      console.error('스팟 추가 실패:', error);
      console.error('에러 응답:', error.response?.data);
      throw error;
    }
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

        <AddSpotSection
          days={days}
          onAddSpot={handleAddSpotToDay}
          safeItinerary={safeItinerary}
        />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className={itineraryModalStyles.itineraryContainer}>
            {safeItinerary.map((dayItem) => {
              const daySpots = dayItem.list.filter((spot) => {
                const spotId = getSpotId(spot);
                return spotId;
              });

              const spotIds = daySpots.map((spot) => {
                const spotId = getSpotId(spot);
                return `day-${dayItem.day}-spot-${String(spotId)}`;
              });

              return (
                <DroppableDayCard key={`day-${dayItem.day}`} day={dayItem.day}>
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
                        const spotId = getSpotId(spot);
                        const id = `day-${dayItem.day}-spot-${String(spotId)}`;
                        return (
                          <SortableItem
                            key={id}
                            id={id}
                            spot={spot}
                            onDeleteClick={handleDeleteSpot}
                            loading={loading}
                          />
                        );
                      })}
                    </ul>
                  </SortableContext>
                </DroppableDayCard>
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

        {loading && <LoadingSpinner message="최적 경로 재생성 중이에요!" />}
      </div>
    </div>
  );
};

export default ItineraryModal;
