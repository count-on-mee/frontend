import { Suspense, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import authAtom from '../recoil/auth';
import selectedSpotsAtom from '../recoil/selectedSpots';
import selectedDestinationsAtom from '../recoil/selectedDestinations';
import tripDatesAtom from '../recoil/tripDates';
import defaultImage from '../assets/icon.png';
import CurationModal from '../components/plan/CurationModal';
import clsx from 'clsx';
import useScrapedSpots from '../hooks/useScrapedSpots';
import useScrapedCurations from '../hooks/useScrapedCurations';
import useCuration from '../hooks/useCuration';
import useTrip from '../hooks/useTrip';
import { useListSearch } from '../hooks/useSearch';
import { baseStyles, componentStyles, scrapListStyles } from '../utils/style';
import Searchbar from '../components/ui/Searchbar';
import ScrapSpots from '../components/scrap/ScrapSpots';
import ScrapCurations from '../components/scrap/ScrapCurations';

// 스팟 카드 컴포넌트
const SpotCard = ({ spot, isSelected, onToggleSelection }) => (
  <div className={scrapListStyles.spotCard}>
    <div className={scrapListStyles.imageContainer}>
      <img
        src={spot.imgUrls?.[0] || defaultImage}
        alt={spot.name}
        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
    </div>
    <div className="p-2 sm:p-3 pb-0">
      <h3 className="font-medium text-sm sm:text-base mb-1">{spot.name}</h3>
      <p className="text-gray-600 text-xs sm:text-sm mb-2">{spot.address}</p>
      <button
        onClick={() => onToggleSelection(spot)}
        className={scrapListStyles.selectionButton(isSelected)}
      >
        {isSelected ? '선택' : '선택'}
      </button>
    </div>
  </div>
);

// 큐레이션 카드 컴포넌트
const CurationCard = ({ curation, onClick }) => (
  <div className={scrapListStyles.curationImage} onClick={onClick}>
    <img
      src={curation.imgUrl}
      alt={curation.name}
      className="w-full h-full object-cover"
    />
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
      <h4 className="text-white text-xs sm:text-sm font-medium">
        {curation.name}
      </h4>
    </div>
  </div>
);

// 섹션 헤더 컴포넌트
const SectionHeader = ({ title }) => (
  <div className={scrapListStyles.sectionHeader}>
    <h3 className={scrapListStyles.sectionHeaderTitle}>{title}</h3>
  </div>
);

export default function MyScrapListPage() {
  const navigate = useNavigate();
  const auth = useRecoilValue(authAtom);
  const [selectedSpots, setSelectedSpots] = useRecoilState(selectedSpotsAtom);
  const [selectedDestinations, setSelectedDestinations] = useRecoilState(
    selectedDestinationsAtom,
  );
  const [tripDates, setTripDates] = useRecoilState(tripDatesAtom);
  const [selectedCurationId, setSelectedCurationId] = useState(null);
  const [showCurationModal, setShowCurationModal] = useState(false);

  const {
    scrapedSpots,
    loading: spotsLoading,
    error: spotsError,
  } = useScrapedSpots();
  const {
    scrapedCurations,
    loading: curationsLoading,
    error: curationsError,
  } = useScrapedCurations();
  const {
    curationSpots,
    loading: curationLoading,
    error: curationError,
    fetchCuration,
  } = useCuration(selectedCurationId);
  const { createTrip, loading: tripLoading, error: tripError } = useTrip();
  const {
    searchTerm,
    filteredItems: filteredSpots,
    handleSearch,
  } = useListSearch(scrapedSpots);

  // 선택된 destination의 주소와 일치하는 스팟을 우선적으로 보여주기 위한 정렬 함수
  const sortedSpots = useMemo(() => {
    if (!selectedDestinations.length) return filteredSpots;

    return [...filteredSpots].sort((a, b) => {
      const aIsInSelectedDestination = selectedDestinations.some((dest) =>
        a.address.includes(dest.name),
      );
      const bIsInSelectedDestination = selectedDestinations.some((dest) =>
        b.address.includes(dest.name),
      );

      if (aIsInSelectedDestination && !bIsInSelectedDestination) return -1;
      if (!aIsInSelectedDestination && bIsInSelectedDestination) return 1;
      return 0;
    });
  }, [filteredSpots, selectedDestinations]);

  const handleCurationClick = async (curationId) => {
    setSelectedCurationId(curationId);
    await fetchCuration(curationId);
    setShowCurationModal(true);
  };

  const goBack = () => navigate('/com/destination');

  const toggleSelection = (place) => {
    setSelectedSpots((prev) => {
      const isSelected = prev.some((spot) => spot.spotId === place.spotId);
      if (isSelected) {
        return prev.filter((spot) => spot.spotId !== place.spotId);
      } else {
        return [...prev, place];
      }
    });
  };

  const closeCurationModal = () => {
    setShowCurationModal(false);
    setSelectedCurationId(null);
  };

  const handleStartTrip = async () => {
    if (selectedSpots.length === 0) {
      alert('스팟을 선택해주세요.');
      return;
    }

    if (!tripDates.startDate || !tripDates.endDate) {
      alert('여행 기간을 선택해주세요.');
      return;
    }

    try {
      const spotIds = selectedSpots.map((spot) => spot.spotId);
      const destinations = selectedDestinations.map((dest) => dest.name);

      const trip = await createTrip({
        title: `${destinations.join(', ')} 여행`,
        destinations,
        startDate: tripDates.startDate,
        endDate: tripDates.endDate,
        spotIds,
      });

      // 상태 초기화
      setSelectedDestinations([]);
      setTripDates({
        startDate: null,
        endDate: null,
      });
      setSelectedSpots([]);

      // URL 변경
      navigate(`/trip/${trip.tripId}/itinerary`);
    } catch (error) {
      console.error('여행 생성 실패:', error);
      alert('여행 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (!auth.isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-24 h-24 mb-6">
          <img
            src={defaultImage}
            alt="로그인 필요"
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
        <p className="text-gray-600 mb-8">
          스크랩한 장소와 큐레이션을 보려면 로그인해주세요.
        </p>
        <button
          onClick={() => navigate('/login')}
          className={clsx(
            'px-6 py-3 rounded-full text-white font-medium',
            'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]',
            'transition-colors duration-200',
            'shadow-lg hover:shadow-xl',
          )}
        >
          로그인하기
        </button>
      </div>
    );
  }

  if (spotsLoading || curationsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (spotsError || curationsError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 mb-4 text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">
          데이터를 불러오는데 실패했습니다
        </h2>
        <p className="text-gray-600 mb-4">{spotsError || curationsError}</p>
        <button
          onClick={() => window.location.reload()}
          className={clsx(
            'px-4 py-2 rounded-full text-white font-medium',
            'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]',
            'transition-colors duration-200',
          )}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex items-center justify-center min-h-screen p-2 sm:p-4 md:p-6">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-background opacity-70 backdrop-filter backdrop-blur-xl"></div>
        </div>

        <div className="bg-background-gray rounded-lg shadow-xl w-full max-w-7xl h-[calc(100vh-8rem)] relative z-10 flex flex-col">
          {/* 헤더 */}
          <div className="relative pt-8 pb-8 px-8 border-b border-gray-200">
            <button
              onClick={goBack}
              className={clsx(
                baseStyles.button,
                baseStyles.shadow,
                baseStyles.hoverShadow,
                'p-2 sm:p-3 absolute left-8 top-8',
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <h2
              className={clsx(
                componentStyles.header,
                'absolute left-1/2 top-8 -translate-x-1/2',
              )}
            >
              나의 스크랩 리스트
            </h2>
          </div>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* 왼쪽: 스팟과 큐레이션 */}
            <div className="w-full md:w-1/2 flex-grow overflow-y-auto px-8 py-8 border-b md:border-b-0 md:border-r border-gray-200">
              {/* 서치바 */}
              <div className="w-full mb-8">
                <Searchbar
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="장소 검색"
                  size="lg"
                />
              </div>

              {/* 스크랩된 스팟 */}
              <ScrapSpots
                spots={sortedSpots}
                loading={spotsLoading}
                error={spotsError}
                selectedSpots={selectedSpots}
                onToggleSelection={toggleSelection}
              />

              {/* 스크랩된 큐레이션 */}
              <ScrapCurations
                curations={scrapedCurations}
                loading={curationsLoading}
                error={curationsError}
                onCurationClick={handleCurationClick}
              />
            </div>

            {/* 오른쪽 섹션: 지도 */}
            <div className="w-full md:w-1/2 h-[300px] md:h-auto relative px-8 py-8">
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">지도가 여기에 표시됩니다</p>
              </div>
            </div>
          </div>

          {/* 하단 여행 시작 버튼 */}
          <div className="p-6 border-t border-gray-200 flex justify-center">
            <button
              onClick={handleStartTrip}
              className={scrapListStyles.startTripButton}
              disabled={selectedSpots.length === 0}
            >
              여행 시작하기
            </button>
          </div>

          {showCurationModal && (
            <CurationModal
              curationId={selectedCurationId}
              onClose={closeCurationModal}
            />
          )}
        </div>
      </div>
    </div>
  );
}
