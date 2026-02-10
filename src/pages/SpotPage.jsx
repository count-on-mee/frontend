import SpotDetail from '../components/spot/SpotDetail';
import SpotList from '../components/spot/SpotList';
import Map from '../components/map/Map';
import { useRecoilState, useRecoilValue } from 'recoil';
import selectedSpotAtom from '../recoil/selectedSpot';
import spotMarkersAtom from '../recoil/spotMarkers';
import userAtom from '../recoil/user';
import { useRef, useState, useEffect, useMemo } from 'react';
import { useSpotScrap } from '../hooks/useSpotScrap';
import { FaRegPenToSquare } from 'react-icons/fa6';
import SpotUploader from '../components/spot/SpotUploader';
import { useParams, useLocation } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { neumorphStyles } from '../utils/style';
import { formatSpotData, formatSpotsData } from '../utils/spotUtils';

export default function SpotPage() {
  const { spotId } = useParams();
  const location = useLocation();
  const [selectedSpot, setSelectedSpot] = useRecoilState(selectedSpotAtom);

  // 스크랩에서 온 것인지 확인
  const isFromScrap =
    new URLSearchParams(location.search).get('from') === 'scrap';
  const mapRef = useRef(null);
  const [spotMarkers, setSpotMarkers] = useRecoilState(spotMarkersAtom);
  const user = useRecoilValue(userAtom);
  const [activeCategories, setActiveCategories] = useState([]);
  const [isUploaderOpen, setIsUploaderOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const isAdmin = user?.role === 'admin';
  const abortControllerRef = useRef(null);
  const searchRequestIdRef = useRef(0);

  const selectSpot = (spot) => {
    setSelectedSpot(spot);
    if (spot) mapRef.current?.setCenter(spot.position);
  };

  const handleSpotClick = (spot) => {
    mapRef.current?.setCenter(spot.position);
  };

  const handleSearchSpots = async (searchValue) => {
    if (!searchValue || searchValue.trim() === '') {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    searchRequestIdRef.current += 1;
    const currentRequestId = searchRequestIdRef.current;

    try {
      const response = await api.get('/spots/search', {
        params: { name: searchValue.trim() },
        signal: abortController.signal,
      });

      if (abortController.signal.aborted || currentRequestId !== searchRequestIdRef.current) return;

      const formattedSpots = formatSpotsData(response.data || []);
      setSpotMarkers(formattedSpots);
      selectSpot(formattedSpots[0] || null);
    } catch (error) {
      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') return;
      if (currentRequestId !== searchRequestIdRef.current) return;

      console.error('Failed to search spots:', error);
      setSpotMarkers([]);
      setSelectedSpot(null);
    }
  };

  const { handleSpotScrap } = useSpotScrap({
    setSpotMarkers,
    selectedSpot,
    setSelectedSpot,
  });

  const handleOpenUploader = () => {
    setIsUploaderOpen(true);
  };

  useEffect(() => {
    if (!spotId) return;

    const targetSpot = spotMarkers?.find(
      (spot) => spot.spotId === parseInt(spotId),
    );

    if (targetSpot) {
      selectSpot(targetSpot);
      return;
    }

    const fetchSpotById = async () => {
      try {
        const response = await api.get(`/spots/${spotId}`);
        const formattedSpot = formatSpotData(response.data);

        setSpotMarkers((prev) => {
          const exists = prev?.find(
            (spot) => spot.spotId === formattedSpot.spotId,
          );
          return exists ? prev : [...(prev || []), formattedSpot];
        });

        selectSpot(formattedSpot);
      } catch (error) {
        console.error('Failed to fetch spot:', error);
      }
    };

    fetchSpotById();
  }, [spotId, spotMarkers]);
  useEffect(() => {
    if (!isFromScrap) return;

    const fetchScrapedSpots = async () => {
      try {
        const response = await api.get('/scraps/spots');
        const formattedSpots = formatSpotsData(response.data).map((spot) => ({
          ...spot,
          isScraped: true,
        }));
        setSpotMarkers(formattedSpots);
      } catch (error) {
        console.error('Failed to fetch scraped spots:', error);
      }
    };

    fetchScrapedSpots();
  }, [isFromScrap]);

  const filteredMarkers = useMemo(() => {
    if (!spotMarkers?.length) return [];

    let filtered = spotMarkers;
    if (activeCategories?.length > 0) {
      filtered = spotMarkers.filter(
        (marker) =>
          Array.isArray(marker.categories) &&
          activeCategories.some((cat) => marker.categories.includes(cat)),
      );
    }

    if (isFromScrap) {
      return [...filtered].sort((a, b) => {
        if (a.isScraped && !b.isScraped) return -1;
        if (!a.isScraped && b.isScraped) return 1;
        return 0;
      });
    }

    return filtered;
  }, [spotMarkers, activeCategories, isFromScrap]);

  useEffect(() => () => abortControllerRef.current?.abort(), []);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f0f0f3] font-prompt">
      <div className="w-full bg-[#f0f0f3] pt-4 sm:pt-6 lg:pt-8">
        <div className="w-full px-8 sm:px-12 lg:px-16 py-6 lg:py-3"></div>
      </div>
      <div className="w-full px-8 sm:px-12 lg:px-16 pb-8">
        <div className="max-w-8xl mx-auto">
          <div className="w-full flex flex-col lg:flex-row h-[calc(100vh-200px)] gap-6">
            <div
              className={`w-full lg:w-1/4 overflow-y-auto h-full rounded-2xl ${neumorphStyles.base}`}
            >
              <div className="p-6">
                <SpotList
                  onSpotClick={handleSpotClick}
                  handleSpotScrap={handleSpotScrap}
                  spots={filteredMarkers}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onSearchSubmit={handleSearchSpots}
                />
              </div>
            </div>
            {selectedSpot && (
              <div
                className={`w-full lg:w-1/4 overflow-y-auto h-full rounded-2xl ${neumorphStyles.base}`}
              >
                <SpotDetail
                  selectedSpot={selectedSpot}
                  setSelectedSpot={setSelectedSpot}
                  handleSpotScrap={handleSpotScrap}
                />
              </div>
            )}

            <div
              className={`w-full ${selectedSpot ? 'lg:w-1/2' : 'lg:w-3/4'} rounded-2xl ${neumorphStyles.base} overflow-hidden relative`}
              style={{ height: 'calc(100vh - 200px)' }}
            >
              <Map
                mapRef={mapRef}
                markers={spotMarkers}
                markerType="spot"
                filteredMarkers={filteredMarkers}
                activeCategories={activeCategories}
                setActiveCategories={setActiveCategories}
              />
            </div>
          </div>
        </div>
      </div>
      {isAdmin && (
        <div>
          <div className="fixed bottom-6 right-6">
            <button
              className="group relative flex items-center gap-3 z-50 px-6 py-4 bg-[#f0f0f3] text-[#252422] rounded-2xl font-semibold text-lg shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.5)] hover:shadow-[inset_8px_8px_16px_rgba(163,177,198,0.4),inset_-8px_-8px_16px_rgba(255,255,255,0.7)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] transition-all duration-300 ease-out hover:scale-105 active:scale-95 border-2 border-transparent hover:border-[#f5861d] hover:border-opacity-60"
              onClick={handleOpenUploader}
            >
              <FaRegPenToSquare className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
              <span className="hidden sm:block">Spot 등록</span>
              <span className="sm:hidden">등록</span>
            </button>
          </div>
          <SpotUploader
            isOpen={isUploaderOpen}
            onClose={() => setIsUploaderOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
