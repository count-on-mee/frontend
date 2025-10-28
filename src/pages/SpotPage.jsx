import SpotDetail from '../components/spot/SpotDetail';
import SpotList from '../components/spot/SpotList';
import Map from '../components/map/Map';
import { useRecoilState, useRecoilValue } from 'recoil';
import selectedSpotAtom from '../recoil/selectedSpot';
import spotMarkersAtom from '../recoil/spotMarkers';
import userAtom from '../recoil/user';
import { useRef, useState, useEffect } from 'react';
import scrapStateAtom from '../recoil/scrapState';
import { useSpotScrap } from '../hooks/useSpotScrap';
import { FaRegPenToSquare } from 'react-icons/fa6';
import SpotUploader from '../components/spot/SpotUploader';
import { useParams, useLocation } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { getRecoil } from 'recoil-nexus';
import authAtom from '../recoil/auth';
import { neumorphStyles } from '../utils/style';

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
  const [scrapState, setScrapState] = useRecoilState(scrapStateAtom);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [isUploaderOpen, setIsUploaderOpen] = useState(null);
  const isAdmin = user?.role === 'admin';

  const handleSpotClick = (spot) => {
    mapRef.current.setCenter(spot.position);
  };

  const { handleSpotScrap } = useSpotScrap({
    setSpotMarkers,
    selectedSpot,
    setSelectedSpot,
  });

  const handleOpenUploader = () => {
    setIsUploaderOpen(true);
  };

  // URL 파라미터로 받은 spotId에 해당하는 스팟을 선택
  useEffect(() => {
    if (spotId && spotMarkers?.length > 0) {
      const targetSpot = spotMarkers.find(
        (spot) => spot.spotId === parseInt(spotId),
      );
      if (targetSpot) {
        setSelectedSpot(targetSpot);
        if (mapRef.current) {
          mapRef.current.setCenter(targetSpot.position);
        }
      }
    }
  }, [spotId, spotMarkers]);

  // spotId가 있지만 spotMarkers에 없는 경우 개별 spot 정보를 가져오기
  useEffect(() => {
    const fetchSpotById = async () => {
      if (
        spotId &&
        (!spotMarkers?.length ||
          !spotMarkers.find((spot) => spot.spotId === parseInt(spotId)))
      ) {
        try {
          const response = await api.get(`/spots/${spotId}`);
          const spotData = response.data;

          // spot 데이터를 필요한 형태로 변환
          const formattedSpot = {
            ...spotData,
            position: {
              lat: spotData.location.lat,
              lng: spotData.location.lng,
            },
            imgUrls: spotData.imgUrls || [],
            categories: spotData.categories || [],
          };

          // 개별로 가져온 spot을 spotMarkers에 추가하여 마커로 표시
          setSpotMarkers((prev) => {
            const exists = prev.find(
              (spot) => spot.spotId === formattedSpot.spotId,
            );
            if (!exists) {
              return [...prev, formattedSpot];
            }
            return prev;
          });

          setSelectedSpot(formattedSpot);
          if (mapRef.current) {
            mapRef.current.setCenter(formattedSpot.position);
          }
        } catch (error) {
          console.error('Failed to fetch spot:', error);
        }
      }
    };

    fetchSpotById();
  }, [spotId, spotMarkers]);

  // 스크랩에서 온 경우에만 스크랩된 spot들을 가져와서 리스트에 표시
  useEffect(() => {
    const fetchScrapedSpots = async () => {
      if (!isFromScrap) return; // 스크랩에서 온 경우에만 실행

      try {
        const token = getRecoil(authAtom).accessToken;
        if (!token) return;

        const response = await api.get('/scraps/spots', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const scrapedSpots = response.data;

        // 스크랩된 spot들을 필요한 형태로 변환
        const formattedScrapedSpots = scrapedSpots.map((scrap) => ({
          spotId: scrap.spotId,
          name: scrap.name,
          address: scrap.address,
          position: {
            lat: scrap.location.lat,
            lng: scrap.location.lng,
          },
          imgUrls: scrap.imgUrls || [],
          categories: scrap.categories || [],
          isScraped: true,
          tel: scrap.tel,
        }));

        // 스크랩된 spot들로 spotMarkers를 대체
        setSpotMarkers(formattedScrapedSpots);
      } catch (error) {
        console.error('Failed to fetch scraped spots:', error);
      }
    };

    fetchScrapedSpots();
  }, [isFromScrap]);

  useEffect(() => {
    if (spotMarkers?.length > 0) {
      let filteredSpots = spotMarkers;

      // 카테고리 필터 적용
      if (activeCategories?.length > 0) {
        filteredSpots = spotMarkers.filter(
          (marker) =>
            Array.isArray(marker.categories) &&
            Array.isArray(activeCategories) &&
            activeCategories.some((category) =>
              marker.categories.includes(category),
            ),
        );
      }

      // 스크랩에서 온 경우에만 스크랩된 spot들을 우선적으로 정렬
      if (isFromScrap) {
        const sortedSpots = [...filteredSpots].sort((a, b) => {
          if (a.isScraped && !b.isScraped) return -1;
          if (!a.isScraped && b.isScraped) return 1;
          return 0;
        });
        setFilteredMarkers(sortedSpots);
      } else {
        setFilteredMarkers(filteredSpots);
      }
    }
  }, [spotMarkers, activeCategories, isFromScrap]);

  // selectedSpot이 있지만 spotMarkers에 없는 경우 filteredMarkers에 추가
  useEffect(() => {
    if (selectedSpot && spotMarkers?.length > 0) {
      const spotExists = spotMarkers.find(
        (spot) => spot.spotId === selectedSpot.spotId,
      );
      if (spotExists) {
        setFilteredMarkers((prev) => {
          const exists = prev.find(
            (spot) => spot.spotId === selectedSpot.spotId,
          );
          if (!exists) {
            return [...prev, selectedSpot];
          }
          return prev;
        });
      }
    }
  }, [selectedSpot, spotMarkers]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f0f0f3] font-prompt">
      {/* 헤더 */}
      <div className="w-full bg-[#f0f0f3] pt-4 sm:pt-6 lg:pt-8">
        <div className="w-full px-8 sm:px-12 lg:px-16 py-6 lg:py-3"></div>
      </div>
      {/* 메인 콘텐츠 */}
      <div className="w-full px-8 sm:px-12 lg:px-16 pb-8">
        <div className="max-w-8xl mx-auto">
          <div className="w-full flex flex-col lg:flex-row h-[calc(100vh-280px)] gap-6">
            {/* 스팟 리스트 */}
            <div
              className={`w-full lg:w-1/4 overflow-y-auto h-full rounded-2xl ${neumorphStyles.base}`}
            >
              <div className="p-6">
                <SpotList
                  onSpotClick={handleSpotClick}
                  handleSpotScrap={handleSpotScrap}
                  spots={filteredMarkers}
                />
              </div>
            </div>

            {/* 스팟 상세 */}
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

            {/* 지도 레이아웃 */}
            <div
              className={`w-full ${selectedSpot ? 'lg:w-1/2' : 'lg:w-3/4'} rounded-2xl ${neumorphStyles.base} overflow-hidden relative`}
              style={{ height: 'calc(100vh - 280px)' }}
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

      {/* 스팟 업로더 */}
      {isAdmin && (
        <div>
          <div className="fixed bottom-6 right-6">
            <button
              className="group relative flex items-center gap-3 z-50 px-6 py-4 bg-[#f0f0f3] text-[#252422] rounded-2xl font-semibold text-lg shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.5)] hover:shadow-[inset_8px_8px_16px_rgba(163,177,198,0.4),inset_-8px_-8px_16px_rgba(255,255,255,0.7)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] transition-all duration-300 ease-out hover:scale-105 active:scale-95 border-2 border-transparent hover:border-[#EB5E28] hover:border-opacity-60"
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
