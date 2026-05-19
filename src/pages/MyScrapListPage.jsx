import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import authAtom from '../recoil/auth';
import selectedSpotsAtom from '../recoil/selectedSpots';
import selectedDestinationsAtom from '../recoil/selectedDestinations';
import tripDatesAtom from '../recoil/tripDates';
import defaultImage from '../assets/logo.png';
import CurationModal from '../components/plan/CurationModal';
import LoadingSpinner from '../components/loadingSpinner';
import clsx from 'clsx';
import useScrapedSpots from '../hooks/useScrapedSpots';
import useScrapedCurations from '../hooks/useScrapedCurations';
import useTrip from '../hooks/useTrip';
import { useListSearch } from '../hooks/useSearch';
import {
  baseStyles,
  componentStyles,
  scrapListStyles,
  neumorphStyles,
} from '../utils/style';
import Searchbar from '../components/ui/Searchbar';
import ScrapSpots from '../components/scrap/ScrapSpots';
import ScrapCurations from '../components/scrap/ScrapCurations';
import Map from '../components/map/Map';
import api from '../utils/axiosInstance';
import { formatSpotData, formatSpotsData } from '../utils/spotUtils';

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
  const [spotSearchTerm, setSpotSearchTerm] = useState('');
  const [spotSearchResults, setSpotSearchResults] = useState([]);
  const [spotSearchLoading, setSpotSearchLoading] = useState(false);
  const [spotSearchError, setSpotSearchError] = useState(null);
  const abortControllerRef = useRef(null);
  const searchRequestIdRef = useRef(0);

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
  const { createTrip, loading: tripLoading } = useTrip();
  const {
    searchTerm: scrapedSearchTerm,
    filteredItems: filteredSpots,
    handleSearch: handleScrapedSearch,
  } = useListSearch(scrapedSpots);
  const mapRef = useRef(null);
  const markers = selectedSpots.map((spot) => ({
    ...spot,
    position: {
      lat: spot.location.lat,
      lng: spot.location.lng,
    },
  }));

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

  const handleSearchSpots = async (searchValue) => {
    if (!searchValue || searchValue.trim() === '') {
      setSpotSearchResults([]);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    searchRequestIdRef.current += 1;
    const currentRequestId = searchRequestIdRef.current;

    setSpotSearchLoading(true);
    setSpotSearchError(null);

    try {
      const response = await api.get('/spots/search', {
        params: { name: searchValue.trim() },
        signal: abortController.signal,
      });

      if (
        abortController.signal.aborted ||
        currentRequestId !== searchRequestIdRef.current
      )
        return;

      const formattedSpots = formatSpotsData(response.data || []);
      setSpotSearchResults(formattedSpots);
    } catch (error) {
      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') return;
      if (currentRequestId !== searchRequestIdRef.current) return;

      console.error('Failed to search spots:', error);
      setSpotSearchError('검색 중 오류가 발생했습니다.');
      setSpotSearchResults([]);
    } finally {
      if (currentRequestId === searchRequestIdRef.current) {
        setSpotSearchLoading(false);
      }
    }
  };

  const handleSpotSearchChange = (value) => {
    setSpotSearchTerm(value);
    if (value.trim() === '') {
      setSpotSearchResults([]);
    }
  };

  const handleSelectSpot = async (spotId) => {
    try {
      const response = await api.get(`/spots/${spotId}`);
      const formattedSpot = formatSpotData(response.data);

      // 이미 선택된 spot인지 확인
      const isAlreadySelected = selectedSpots.some(
        (spot) => spot.spotId === formattedSpot.spotId,
      );

      if (!isAlreadySelected) {
        toggleSelection(formattedSpot);
      }
    } catch (error) {
      console.error('Failed to fetch spot:', error);
      alert('장소 정보를 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

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
        startDate: tripDates.startDate
          ? tripDates.startDate.toISOString().slice(0, 10)
          : null,
        endDate: tripDates.endDate
          ? tripDates.endDate.toISOString().slice(0, 10)
          : null,
        spotIds,
        participantFields: {
          count: 1,
        },
      });

      setSelectedDestinations([]);
      setTripDates({
        startDate: null,
        endDate: null,
      });
      setSelectedSpots([]);

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

  if (tripLoading) {
    return <LoadingSpinner message="최적 경로를 생성하고 있어요!" />;
  }

  return (
    <div className="fixed inset-0 z-40 overflow-hidden top-14 bottom-16 desktop:top-[80px] desktop:bottom-0">
      <div className="flex items-center justify-center h-full p-1 sm:p-4 md:p-6">
        <div
          className="fixed inset-0 top-14 desktop:top-[80px] transition-opacity"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-background opacity-70 backdrop-filter backdrop-blur-xl"></div>
        </div>

        <div
          className={`${neumorphStyles.base} ${neumorphStyles.hover} rounded-2xl p-3 sm:p-6 w-full max-w-7xl h-full relative z-10 flex flex-col`}
        >
          <div className="relative flex items-center justify-between py-2 px-1 sm:pt-8 sm:pb-4 sm:px-8">
            <button
              onClick={goBack}
              className={clsx(
                baseStyles.button,
                baseStyles.shadow,
                baseStyles.hoverShadow,
                'p-1.5 sm:p-3',
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 sm:w-6 sm:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <h2 className="text-sm sm:text-xl font-semibold text-[#252422]">
              나의 스크랩 리스트
            </h2>
            <div className="w-7 sm:w-12" />
          </div>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden gap-2 sm:gap-0">
            <div className="w-full md:w-1/2 overflow-y-auto px-1 sm:px-8 py-1 sm:py-4">
              {/* Spot 검색 섹션 */}
              <div className="mb-3 sm:mb-6">
                <div className="w-full mb-2 sm:mb-4">
                  <Searchbar
                    value={spotSearchTerm}
                    onChange={handleSpotSearchChange}
                    onSubmit={handleSearchSpots}
                    placeholder="장소를 검색해보세요"
                    size="lg"
                  />
                </div>
                {spotSearchLoading && (
                  <div className="text-center py-4 text-gray-500">
                    검색 중...
                  </div>
                )}
                {spotSearchError && (
                  <div className="text-center py-4 text-red-500">
                    {spotSearchError}
                  </div>
                )}
                {spotSearchResults.length > 0 && (
                  <div className="mt-4">
                    <h3
                      className={scrapListStyles.sectionHeaderTitle + ' mb-4'}
                    >
                      검색 결과
                    </h3>
                    <div className={scrapListStyles.grid}>
                      {spotSearchResults.map((spot) => {
                        const isSelected = selectedSpots.some(
                          (s) => s.spotId === spot.spotId,
                        );
                        return (
                          <div
                            key={spot.spotId}
                            className={scrapListStyles.spotCard}
                          >
                            <div className={scrapListStyles.imageContainer}>
                              <img
                                src={spot.imgUrls?.[0] || defaultImage}
                                alt={spot.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className={scrapListStyles.infoContainer}>
                              <h3 className={scrapListStyles.name}>
                                {spot.name}
                              </h3>
                              <p className={scrapListStyles.address}>
                                {spot.address}
                              </p>
                              <button
                                onClick={() => handleSelectSpot(spot.spotId)}
                                className={scrapListStyles.selectionButton(
                                  isSelected,
                                )}
                              >
                                {isSelected ? '선택' : '선택'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <ScrapSpots
                spots={sortedSpots}
                loading={spotsLoading}
                error={spotsError}
                selectedSpots={selectedSpots}
                onToggleSelection={toggleSelection}
                searchTerm={scrapedSearchTerm}
                onSearchChange={handleScrapedSearch}
              />

              <ScrapCurations
                curations={scrapedCurations}
                loading={curationsLoading}
                error={curationsError}
                onCurationClick={handleCurationClick}
              />
            </div>

            <div className="w-full md:w-1/2 relative px-1 sm:px-8 py-1 sm:py-8 h-[180px] md:h-auto flex-shrink-0">
              <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-xl overflow-hidden">
                <Map markers={markers} mapRef={mapRef} markerType="scrapList" />
              </div>
            </div>
          </div>

          <div className="py-2 sm:p-6 flex justify-center">
            <button
              onClick={handleStartTrip}
              className={scrapListStyles.startTripButton}
              disabled={selectedSpots.length === 0 || tripLoading}
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
