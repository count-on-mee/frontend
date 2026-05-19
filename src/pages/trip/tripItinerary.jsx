import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { useParams } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useRecoilState } from 'recoil';
import useTrip from '../../hooks/useTrip';
import useTripItinerary from '../../hooks/useTripItinerary';
import ItineraryModal from '../../components/itineraryModal';
import TransportationInfo from '../../components/transportationInfo';
import RecoilDateRangePicker from '../../components/datePickers/recoilDateRangePicker';
import LoadingSpinner from '../../components/loadingSpinner';
import tripDatesAtom from '../../recoil/tripDates/atom';
import defaultImage from '../../assets/logo.png';
import {
  neumorphStyles,
  componentStyles,
  layoutStyles,
  animationStyles,
} from '../../utils/style';
import Map from '../../components/map/Map';

const DayButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-base font-medium ${
      active ? 'bg-[#f5861d] text-white' : 'bg-[#f0f0f3] text-gray-600'
    } ${neumorphStyles.small} ${neumorphStyles.hover}`}
  >
    {children}
  </button>
);

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${String(d.getMonth() + 1).padStart(2, '0')}월 ${String(d.getDate()).padStart(2, '0')}일`;
};

const TripItinerary = () => {
  const { tripId } = useParams();
  const { getTrip } = useTrip();
  const {
    itinerary,
    loading: itineraryLoading,
    error: itineraryError,
    refetch: refetchItinerary,
    updateTripDates,
  } = useTripItinerary(tripId);
  const [meta, setMeta] = useState(null);
  const [metaError, setMetaError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeDay, setActiveDay] = useState(1);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [tripDates, setTripDates] = useRecoilState(tripDatesAtom);
  const [isUpdatingDates, setIsUpdatingDates] = useState(false);
  const [showAllDays, setShowAllDays] = useState(false);

  const fetchTripData = useCallback(async () => {
    if (!tripId) return;

    try {
      setMetaError(null);
      const data = await getTrip(tripId);
      setMeta(data);
    } catch (err) {
      setMetaError(err);
    }
  }, [tripId, getTrip]);

  useEffect(() => {
    fetchTripData();
  }, [fetchTripData]);

  useEffect(() => {
    if (meta) {
      setTripDates({
        startDate: new Date(meta.startDate),
        endDate: new Date(meta.endDate),
      });
    }
  }, [meta, setTripDates]);

  const dayMap = useMemo(() => {
    const map = {};
    itinerary?.forEach((item) => {
      if (!map[item.day]) map[item.day] = [];
      map[item.day].push(item);
    });
    return map;
  }, [itinerary]);

  const allDays = useMemo(() => {
    if (!meta?.startDate || !meta?.endDate) {
      const maxDay = Math.max(...Object.keys(dayMap).map(Number), 1);
      return Array.from({ length: maxDay }, (_, i) => i + 1);
    }
    const start = new Date(meta.startDate);
    const end = new Date(meta.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Array.from({ length: diffDays }, (_, i) => i + 1);
  }, [meta, dayMap]);

  const handleSaveItinerary = async () => {
    setShowModal(false);
    await refetchItinerary();
  };

  const modalSpots = allDays.map((day) => ({
    day,
    list: (dayMap[day] || []).map((item) => ({
      ...item,
      itineraryId: item.tripItineraryId,
    })),
  }));

  const mapRef = useRef(null);
  const markers = modalSpots.flatMap((dayItem) =>
    dayItem.list.map((item) => ({
      ...item.spot,
      day: dayItem.day,
      position: new window.naver.maps.LatLng(
        item.spot.location.lat,
        item.spot.location.lng,
      ),
    })),
  );

  const handleSpotClick = (spot) => {
    if (!mapRef.current || !spot?.spot?.location) return;
    const { lat, lng } = spot.spot.location;
    mapRef.current.setCenter({ lat, lng });
  };

  const filteredMarkers = markers.filter((marker) => marker.day === activeDay);
  const markersToSend = showAllDays ? markers : filteredMarkers;

  const handleDateUpdate = async (startDate, endDate) => {
    try {
      setIsUpdatingDates(true);
      const updatedTrip = await updateTripDates({ startDate, endDate });
      setMeta(updatedTrip);
      setShowStartDatePicker(false);
    } catch (error) {
      console.error('날짜 업데이트 실패:', error);
    } finally {
      setIsUpdatingDates(false);
    }
  };

  if (metaError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-600">{metaError.message}</p>
        </div>
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-600 mb-2">
            여행 정보가 없습니다
          </h2>
        </div>
      </div>
    );
  }

  return (
    <>
      {isUpdatingDates && (
        <LoadingSpinner message="최적 경로 재생성 중이에요!" />
      )}
      <div className="flex flex-col desktop:flex-row w-full">
        <div className="order-1 desktop:order-2 w-full desktop:w-1/2 h-[200px] desktop:h-[500px] flex flex-col overflow-hidden desktop:sticky desktop:top-30">
          <Map
            mapRef={mapRef}
            markers={markersToSend}
            showAllDays={showAllDays}
            markerType="itinerary"
          />
          <div className="flex justify-end p-1 desktop:p-2">
            <button
              onClick={() => setShowAllDays((prev) => !prev)}
              className={`${componentStyles.button.secondary} ${neumorphStyles.small} ${neumorphStyles.hover} text-xs desktop:text-sm ${showAllDays ? 'text-[var(--color-primary)]' : 'text-gray-600'}`}
            >
              {showAllDays ? 'Day 보기' : '전체 보기'}
            </button>
          </div>
        </div>
        <div className="order-2 desktop:order-1 w-full desktop:w-1/2 p-3 desktop:p-8">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <button
                onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                className={`${componentStyles.button.secondary} ${neumorphStyles.small} text-[var(--color-primary)] ${neumorphStyles.hover} text-xs desktop:text-sm`}
              >
                {formatDate(meta.startDate)} - {formatDate(meta.endDate)}
              </button>
              {showStartDatePicker && (
                <div className="absolute z-10 mt-2">
                  <div className="scale-75 origin-top-left w-[800px]">
                    <RecoilDateRangePicker
                      atom={tripDatesAtom}
                      showCompleteButton
                      onComplete={() => {
                        handleDateUpdate(
                          tripDates.startDate,
                          tripDates.endDate,
                        );
                      }}
                      completeButtonText="선택 완료"
                      allowPastDates
                    />
                  </div>
                </div>
              )}
            </div>
            {meta.destinations?.length > 0 && (
              <span
                className={`text-xs desktop:text-base text-gray-600 ${neumorphStyles.small} ${neumorphStyles.hover}`}
              >
                {meta.destinations.join(', ')}
              </span>
            )}
            <button
              onClick={() => setShowModal(true)}
              className={`${componentStyles.button.secondary} ${neumorphStyles.small} ${neumorphStyles.hover} text-[var(--color-primary)] text-xs desktop:text-sm ml-auto`}
            >
              수정
            </button>
          </div>
          <div className="flex gap-2 mt-3 mb-3 overflow-x-auto pb-1 scrollbar-none">
            {allDays.map((day) => (
              <DayButton
                key={day}
                active={activeDay === day}
                onClick={() => {
                  setActiveDay(day);
                  setShowAllDays(false);
                }}
              >
                Day{day}
              </DayButton>
            ))}
          </div>
          <div>
            {itineraryLoading ? (
              <div
                className={`text-center py-8 ${componentStyles.text.loading} ${neumorphStyles.base}`}
              >
                <p>일정을 불러오는 중...</p>
              </div>
            ) : itineraryError ? (
              <div
                className={`text-center py-8 ${componentStyles.text.error} ${neumorphStyles.base}`}
              >
                <p>일정을 불러오는데 실패했습니다: {itineraryError.message}</p>
              </div>
            ) : dayMap[activeDay]?.length > 0 ? (
              (() => {
                const spots = dayMap[activeDay].sort(
                  (a, b) => a.order - b.order,
                );
                return spots.map((item, idx) => (
                  <React.Fragment key={item.tripItineraryId || item.id}>
                    <motion.div
                      {...animationStyles.fadeIn}
                      transition={{
                        ...animationStyles.fadeIn.transition,
                        delay: idx * 0.1,
                      }}
                      className="mb-2"
                    >
                      <div
                        className={`flex items-center gap-3 p-3 desktop:p-4 ${neumorphStyles.base} ${neumorphStyles.hover} cursor-pointer`}
                        onClick={() => handleSpotClick(item)}
                      >
                        <motion.div
                          key={item.order}
                          {...animationStyles.scaleIn}
                          className={`w-7 h-7 desktop:w-8 desktop:h-8 rounded-full bg-[#f5861d] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 ${neumorphStyles.tinyInset}`}
                        >
                          {item.order}
                        </motion.div>
                        <img
                          src={item.spot?.imgUrls?.[0] || defaultImage}
                          alt={item.spot?.name}
                          className={`w-12 h-12 desktop:w-16 desktop:h-16 rounded-xl object-cover flex-shrink-0 ${neumorphStyles.small}`}
                        />
                        <div className="flex-grow min-w-0">
                          <div className="text-sm desktop:text-base font-semibold text-[#252422] truncate">
                            {item.spot?.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate mt-0.5">
                            {item.spot?.address}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    {idx < spots.length - 1 && item.transportation?.next && (
                      <TransportationInfo
                        duration={item.transportation.next.durationMinute}
                        distance={item.transportation.next.distanceKilometer}
                      />
                    )}
                  </React.Fragment>
                ));
              })()
            ) : (
              <div className={`text-center py-8 ${neumorphStyles.base}`}>
                <p className={componentStyles.text.loading}>
                  Day {activeDay}에 등록된 일정이 없습니다.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  수정 버튼을 눌러 일정을 추가해보세요.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ItineraryModal
        open={showModal}
        onClose={() => setShowModal(false)}
        tripId={tripId}
        days={allDays}
        spots={modalSpots}
        onSave={handleSaveItinerary}
        onRefetch={refetchItinerary}
      />
    </>
  );
};

export default TripItinerary;
