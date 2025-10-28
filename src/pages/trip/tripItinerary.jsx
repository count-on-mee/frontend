import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRecoilState } from 'recoil';
import useTrip from '../../hooks/useTrip';
import useTripItinerary from '../../hooks/useTripItinerary';
import ItineraryModal from '../../components/itineraryModal';
import TransportationInfo from '../../components/transportationInfo';
import RecoilDateRangePicker from '../../components/datePickers/recoilDateRangePicker';
import LoadingSpinner from '../../components/loadingSpinner';
import tripDatesAtom from '../../recoil/tripDates/atom';
import defaultImage from '../../assets/icon.png';
import koreaMap from '../../assets/Korea.png';
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
      active
        ? 'bg-[#FF8C4B] text-[var(--color-primary)]'
        : 'bg-[#f0f0f3] text-gray-600'
    } ${neumorphStyles.small} ${neumorphStyles.hover}`}
  >
    {children}
  </button>
);

// 날짜 포맷 함수
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

  // Day별 spot 리스트로 변환
  const dayMap = useMemo(() => {
    const map = {};
    itinerary?.forEach((item) => {
      if (!map[item.day]) map[item.day] = [];
      map[item.day].push(item);
    });
    return map;
  }, [itinerary]);

  const days = useMemo(
    () =>
      Object.keys(dayMap)
        .map(Number)
        .sort((a, b) => a - b),
    [dayMap],
  );

  const handleSaveItinerary = async () => {
    setShowModal(false);
    await refetchItinerary();
  };

  // ItineraryModal에 전달할 데이터 생성
  const maxDay = Math.max(...days, 1);
  const allDays = Array.from({ length: maxDay }, (_, i) => i + 1);
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
      position: new naver.maps.LatLng(
      item.spot.location.lat,
      item.spot.location.lng)
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
      <div className="flex w-full">
        <div className="w-1/2 p-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                className={`${componentStyles.button.secondary} ${neumorphStyles.small} text-[var(--color-primary)] ${neumorphStyles.hover}`}
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
          </div>
          {meta.destinations?.length > 0 && (
            <span
              className={`ml-4 text-base text-gray-600 ${neumorphStyles.small} ${neumorphStyles.hover}`}
            >
              {meta.destinations.join(', ')}
            </span>
          )}
          <div
            className={`${layoutStyles.flex.between} ${layoutStyles.spacing.section} mt-8 `}
          >
            <button
              onClick={() => setShowModal(true)}
              className={`${componentStyles.button.secondary} ${neumorphStyles.small} ${neumorphStyles.hover} text-[var(--color-primary)]`}
            >
              수정
            </button>
          </div>
          <div
            className={`${layoutStyles.flex.gap} ${layoutStyles.spacing.section}`}
          >
            {days.map((day) => (
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
                className={`text-center py-12 ${componentStyles.text.loading} ${neumorphStyles.base}`}
              >
                <p>일정을 불러오는 중...</p>
              </div>
            ) : itineraryError ? (
              <div
                className={`text-center py-12 ${componentStyles.text.error} ${neumorphStyles.base}`}
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
                      className={layoutStyles.spacing.item}
                    >
                      <div
                        className={`${layoutStyles.flex.gap} p-6 ${neumorphStyles.base} ${neumorphStyles.hover}`}
                        onClick={() => handleSpotClick(item)}
                      >
                        <motion.div
                          key={item.order}
                          {...animationStyles.scaleIn}
                          className={`w-8 h-8 rounded-full bg-[#FF8C4B] text-[var(--color-primary)] flex items-center justify-center font-bold ${neumorphStyles.tinyInset} ${neumorphStyles.hover}`}
                        >
                          {item.order}
                        </motion.div>
                        <img
                          src={item.spot?.imgUrls?.[0] || defaultImage}
                          alt={item.spot?.name}
                          className={`w-20 h-20 rounded-xl object-cover ${neumorphStyles.small} ${neumorphStyles.hover}`}
                        />
                        <div className="flex-grow">
                          <div className={componentStyles.text.title}>
                            {item.spot?.name}
                          </div>
                          <div className={componentStyles.text.subtitle}>
                            {item.spot?.address}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    {/* 마지막 spot이 아니면 다음 spot으로의 이동 정보만 출력 */}
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
              <div className={`text-center py-12 ${neumorphStyles.base}`}>
                <p className={componentStyles.text.loading}>
                  Day {activeDay}에 등록된 일정이 없습니다.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  수정 버튼을 눌러 일정을 추가해보세요.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="w-1/2 h-[500px] flex flex-col overflow-hidden sticky top-30">
          <Map
            mapRef={mapRef}
            markers={markersToSend}
            showAllDays={showAllDays}
            markerType="itinerary"
          />
          <div className='flex justify-end p-2'>
            <button
              onClick={() => setShowAllDays(prev => !prev)}
              className={`${componentStyles.button.secondary} ${neumorphStyles.small} ${neumorphStyles.hover} ${showAllDays ? 'text-[var(--color-primary)]' : 'text-gray-600'}`}
            >
              {showAllDays ? 'Day 보기' : '전체 보기'}
            </button>
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
      />
    </>
  );
};

export default TripItinerary;
