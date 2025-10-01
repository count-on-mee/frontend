import Searchbar from '../components/ui/Searchbar';
import CurationList from '../components/curation/CurationList';
import CurationDetail from '../components/curation/CurationDetail';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import selectedCurationAtom from '../recoil/selectedCuration';
import selectedCurationSpotAtom from '../recoil/selectedCurationSpot';
import CurationUploader from '../components/curation/CurationUploader';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { useState, useEffect, useRef } from 'react';
import authAtom from '../recoil/auth';
import { getRecoil } from 'recoil-nexus';
import api from '../utils/axiosInstance';
import userAtom from '../recoil/user';
import curationMarkersAtom from '../recoil/curationMarkers';
import Map from '../components/map/Map';
import SpotDetail from '../components/spot/SpotDetail';
import { useSpotScrap } from '../hooks/useSpotScrap';
import scrapStateAtom from '../recoil/scrapState';
import { useSearch } from '../hooks/useSearch';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { animationStyles } from '../utils/style';

export default function CurationPage() {
  const { curationId } = useParams();
  const [curations, setCurations] = useState([]);
  const [selectedCuration, setSelectedCuration] =
    useRecoilState(selectedCurationAtom);
  const [selectedCurationSpot, setSelectedCurationSpot] = useRecoilState(
    selectedCurationSpotAtom,
  );
  const setScrapState = useSetRecoilState(scrapStateAtom);
  const [isUploaderOpen, setIsUploaderOpen] = useState(null);
  const [curationMarkers, setCurationMarkers] =
    useRecoilState(curationMarkersAtom);
  const user = useRecoilValue(userAtom);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  const { handleSpotScrap } = useSpotScrap({
    selectedSpot: selectedCurationSpot,
    setSelectedSpot: setSelectedCurationSpot,
  });

  const { searchTerm, handleSearch, filteredItems } = useSearch(curations);

  const fetchCuration = async () => {
    try {
      const response = await api.get('/curations', {});

      const data = response.data;
      setCurations((prev) => {
        if (
          prev.length !== data.length ||
          prev.some((p, i) => p.isScraped !== data[i].isScraped)
        ) {
          return data.map((c) => ({ ...c }));
        }
        return prev;
      });
    } catch (error) {
      console.error('Failed to fetch curation:', error);
    }
  };

  useEffect(() => {
    fetchCuration();
  }, [curations]);

  // URL 파라미터로 받은 curationId에 해당하는 큐레이션을 선택
  useEffect(() => {
    if (curationId && curations?.length > 0) {
      const targetCuration = curations.find(
        (curation) => curation.curationId === parseInt(curationId),
      );
      if (targetCuration) {
        setSelectedCuration(targetCuration);
      }
    }
  }, [curationId, curations]);

  useEffect(() => {
    if (!selectedCuration) return;

    const markers = selectedCuration.spots.map((spot) => ({
      ...spot,
      position: {
        lat: spot.location.lat,
        lng: spot.location.lng,
      },
    }));

    setCurationMarkers(markers);
  }, [selectedCuration]);

  useEffect(() => {
    const initial = {};
    if (Array.isArray(selectedCuration?.spots)) {
      selectedCuration.spots.forEach((spot) => {
        initial[spot.spotId] = {
          isScraped: spot.isScraped,
          scrapCount: spot.scrapedCount,
        };
      });
    }
    setScrapState(initial);
  }, [selectedCuration]);

  const handleScrapClick = async (curation) => {
    if (!user) {
      navigate('/login-notice');
      return;
    }

    if (!curation) {
      console.warn('curation이 null입니다.');
      return;
    }
    try {
      const token = getRecoil(authAtom).accessToken;
      const method = curation.isScraped ? 'DELETE' : 'POST';
      await api({
        url: `/scraps/curations/${curation.curationId}`,
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      setCurations((prev) => {
        const updatedCurations = Array.isArray(prev) ? prev : [];
        return updatedCurations.map((updatedCuration) =>
          updatedCuration.curationId === curation.curationId
            ? { ...updatedCuration, isScraped: !updatedCuration.isScraped }
            : updatedCuration,
        );
      });
      if (
        selectedCuration &&
        selectedCuration.curationId === curation.curationId
      ) {
        setSelectedCuration((prev) => ({
          ...prev,
          isScraped: !prev.isScraped,
        }));
      }
    } catch (error) {
      console.error('Failed to update scrap status', error);
    }
  };

  const handleOpenUploader = () => {
    if (!user) {
      navigate('/login-notice');
      return;
    }
    setIsUploaderOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f0f0f3] font-prompt">
      {!selectedCuration ? (
        <div className="w-full">
          {/* 헤더 영역 */}
          <div className="w-full bg-[#f0f0f3] pt-12 sm:pt-16 lg:pt-20">
            <div className="w-full px-8 sm:px-12 lg:px-16 py-6 lg:py-3">
              <div className="text-center">
                {/* 검색 영역 */}
                <div className="max-w-3xl mx-auto mb-6">
                  <Searchbar
                    value={searchTerm}
                    onChange={handleSearch}
                    size="lg"
                  />
                </div>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto">
                  다양한 큐레이션을 둘러보고 나만의 큐레이션을 추천해주세요!
                </p>
              </div>
            </div>
          </div>

          {/* 큐레이션 리스트 */}
          <div className="w-full px-8 sm:px-12 lg:px-16 pb-20">
            <div className="max-w-8xl mx-auto">
              <CurationList
                handleScrapClick={handleScrapClick}
                onSelectedCuration={setSelectedCuration}
                curations={filteredItems}
                searchTerm={searchTerm}
              />
            </div>
          </div>

          {/* 업로드 버튼 */}
          <div className="fixed bottom-6 right-6">
            <motion.button
              className="group relative flex items-center gap-3 z-50 px-6 py-4 bg-[#f0f0f3] text-[#252422] rounded-2xl font-semibold text-lg shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.5)] hover:shadow-[inset_8px_8px_16px_rgba(163,177,198,0.4),inset_-8px_-8px_16px_rgba(255,255,255,0.7)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] transition-all duration-300 ease-out hover:scale-105 active:scale-95 border-2 border-transparent hover:border-[#EB5E28] hover:border-opacity-60"
              onClick={handleOpenUploader}
              {...animationStyles.floatingButton}
              whileHover={animationStyles.hover}
              whileTap={animationStyles.tap}
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: 'easeInOut',
                }}
              >
                <FaRegPenToSquare className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
              </motion.div>
              <span className="hidden sm:block">Curation 만들기</span>
              <span className="sm:hidden">만들기</span>
            </motion.button>
          </div>

          <CurationUploader
            isOpen={isUploaderOpen}
            onClose={() => setIsUploaderOpen(false)}
            fetchCuration={fetchCuration}
          />
        </div>
      ) : (
        // 큐레이션 상세 레이아웃
        <div className="w-full">
          {/* 헤더 */}
          <div className="w-full bg-[#f0f0f3]  pt-12 sm:pt-16 lg:pt-20">
            <div className="w-full px-8 sm:px-12 lg:px-16 py-6 lg:py-3">
              <div className="text-center">
                <h1 className="text-3xl sm:text-2xl lg:text-4xl font-bold mb-2 text-[#252422]">
                  {selectedCuration.name}
                </h1>
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="w-full px-8 sm:px-12 lg:px-16 pb-8">
            <div className="max-w-8xl mx-auto">
              <div className="w-full flex h-[calc(100vh-200px)] gap-6">
                <div className="w-1/4 overflow-y-auto h-full bg-white shadow-lg">
                  <CurationDetail
                    selectedCuration={selectedCuration}
                    setSelectedCuration={setSelectedCuration}
                    handleScrapClick={handleScrapClick}
                    fetchCuration={fetchCuration}
                  />
                </div>
                {selectedCurationSpot && (
                  <div className="w-1/4 overflow-y-auto h-full bg-white shadow-lg">
                    <SpotDetail
                      selectedSpot={selectedCurationSpot}
                      setSelectedSpot={setSelectedCurationSpot}
                      handleSpotScrap={handleSpotScrap}
                    />
                  </div>
                )}
                <div
                  className={`${selectedCurationSpot ? 'w-1/2' : 'w-3/4'} bg-white shadow-lg overflow-hidden`}
                >
                  <Map
                    mapRef={mapRef}
                    markers={curationMarkers}
                    markerType="curation"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
