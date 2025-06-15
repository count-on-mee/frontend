import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import useTrip from '../../hooks/useTrip';
import useTripItinerary from '../../hooks/useTripItinerary';
import ItineraryModal from '../../components/itineraryModal';
import Invitation from '../../components/invitation';
import TransportationInfo from '../../components/transportationInfo';
import defaultImage from '../../assets/icon.png';
import koreaMap from '../../assets/Korea.png';
import {
  neumorphStyles,
  componentStyles,
  layoutStyles,
  animationStyles,
} from '../../utils/style';

const TripItineraryContainer = ({ children }) => (
  <div className="flex flex-col p-8 max-w-7xl mx-auto bg-[#f0f0f3] min-h-screen">
    {children}
  </div>
);

const Header = ({ children }) => (
  <div className="flex justify-between items-center mb-8 bg-[#f0f0f3] rounded-2xl p-6 shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff]">
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-3xl font-bold p-4 text-[#FF8C4B]">{children}</h2>
);

const DateDisplay = ({ children }) => (
  <div className="px-4 py-2 rounded-full text-sm bg-[#f0f0f3] shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] text-gray-700">
    {children}
  </div>
);

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
  } = useTripItinerary(tripId);
  const [meta, setMeta] = useState(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeDay, setActiveDay] = useState(1);

  const fetchTripData = useCallback(async () => {
    if (!tripId) return;

    try {
      setMetaLoading(true);
      setMetaError(null);

      const data = await getTrip(tripId);
      setMeta(data);
    } catch (err) {
      setMetaError(err);
    } finally {
      setMetaLoading(false);
    }
  }, [tripId, getTrip]);

  useEffect(() => {
    fetchTripData();
  }, [fetchTripData]);

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

  return (
    <div className="flex w-full">
      <div className="w-1/2 p-8">
        {metaLoading ? (
          <span className={componentStyles.text.loading}>로딩 중...</span>
        ) : metaError ? (
          <span className={componentStyles.text.error}>
            정보를 불러오지 못했습니다: {metaError.message}
          </span>
        ) : !meta ? (
          <span className={componentStyles.text.loading}>
            여행 정보가 없습니다.
          </span>
        ) : (
          <>
            <span
              className={`${componentStyles.button.secondary} mr-9 ${neumorphStyles.small} text-[var(--color-primary)] ${neumorphStyles.hover}`}
            >
              {formatDate(meta.startDate)}
            </span>
            <span
              className={`${componentStyles.button.secondary} ${neumorphStyles.small} text-[var(--color-primary)] ${neumorphStyles.hover}`}
            >
              {formatDate(meta.endDate)}
            </span>
            {meta.destinations?.length > 0 && (
              <span
                className={`ml-4 text-base text-gray-600 ${neumorphStyles.small} ${neumorphStyles.hover}`}
              >
                {meta.destinations.join(', ')}
              </span>
            )}
          </>
        )}
        {!metaLoading && !metaError && meta && (
          <>
            <div
              className={`${layoutStyles.flex.between} ${layoutStyles.spacing.section} mt-8 `}
            >
              <div
                className={`${componentStyles.container.base} ${neumorphStyles.base} text-[var(--color-primary)] ${neumorphStyles.hover} flex items-center gap-3`}
              >
                <img src={koreaMap} alt="Korea Map" className="w-15 h-15" />
                <Invitation tripId={tripId} />
              </div>
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
                  onClick={() => setActiveDay(day)}
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
                  <p>
                    일정을 불러오는데 실패했습니다: {itineraryError.message}
                  </p>
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
          </>
        )}
      </div>
      <div className="w-1/2">{/* 지도 구현 예정 */}</div>
      <ItineraryModal
        open={showModal}
        onClose={() => setShowModal(false)}
        tripId={tripId}
        days={allDays}
        spots={modalSpots}
        onSave={handleSaveItinerary}
      />
    </div>
  );
};

export default TripItinerary;
