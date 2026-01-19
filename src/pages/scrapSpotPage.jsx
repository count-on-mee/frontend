import SpotDetail from '../components/spot/SpotDetail';
import ScrapSpots from '../components/scrap/ScrapSpots';
import Map from '../components/map/Map';
import { useRecoilState, useRecoilValue } from 'recoil';
import selectedSpotAtom from '../recoil/selectedSpot';
import userAtom from '../recoil/user';
import { useRef, useState, useEffect } from 'react';
import scrapStateAtom from '../recoil/scrapState';
import { useSpotScrap } from '../hooks/useSpotScrap';
import { FaRegPenToSquare } from 'react-icons/fa6';
import SpotUploader from '../components/spot/SpotUploader';
import { useParams } from 'react-router-dom';
import api from '../utils/axiosInstance';

export default function ScrapSpotPage() {
  const { spotId } = useParams();
  const [selectedSpot, setSelectedSpot] = useRecoilState(selectedSpotAtom);
  const mapRef = useRef(null);
  const user = useRecoilValue(userAtom);
  const [scrapState, setScrapState] = useRecoilState(scrapStateAtom);
  const [isUploaderOpen, setIsUploaderOpen] = useState(null);
  const [scrapedSpots, setScrapedSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin';

  const handleSpotClick = (spot) => {
    mapRef.current.setCenter(spot.position);
  };

  const { handleSpotScrap } = useSpotScrap({
    selectedSpot,
    setSelectedSpot,
  });

  const handleOpenUploader = () => {
    setIsUploaderOpen(true);
  };

  // 스크랩된 스팟들 가져오기
  const fetchScrapedSpots = async () => {
    try {
      setLoading(true);
      const response = await api.get('/scraps/spots');
      const data = await response.data;

      // 스팟 데이터를 SpotPage에서 사용하는 형태로 변환
      const formattedSpots = data.map((spot) => ({
        ...spot,
        spotId: spot.spotId,
        name: spot.name,
        address: spot.address,
        imgUrls: spot.imgUrls ? [spot.imgUrls] : [],
        location: spot.location,
        position: {
          lat: spot.location.lat,
          lng: spot.location.lng,
        },
        categories: spot.categories || [],
        isScraped: true,
      }));

      setScrapedSpots(formattedSpots);
    } catch (error) {
      console.error('Failed to fetch scraped spots:', error);
    } finally {
      setLoading(false);
    }
  };

  // URL 파라미터로 받은 spotId에 해당하는 스팟을 선택
  useEffect(() => {
    if (spotId && scrapedSpots?.length > 0) {
      const targetSpot = scrapedSpots.find(
        (spot) => spot.spotId === parseInt(spotId),
      );
      if (targetSpot) {
        setSelectedSpot(targetSpot);
        if (mapRef.current) {
          mapRef.current.setCenter(targetSpot.position);
        }
      }
    }
  }, [spotId, scrapedSpots]);

  useEffect(() => {
    fetchScrapedSpots();
  }, []);

  useEffect(() => {
    const initial = {};
    if (Array.isArray(scrapedSpots)) {
      scrapedSpots.forEach((spot) => {
        initial[spot.spotId] = {
          isScraped: spot.isScraped,
          scrapCount: spot.scrapedCount || 0,
        };
      });
    }
    setScrapState(initial);
  }, [scrapedSpots]);

  return (
    <div className="w-full flex h-[calc(100vh-80px)]">
      {/* ScrapSpots */}
      <div className="w-1/4 overflow-y-auto h-full">
        <ScrapSpots
          spots={scrapedSpots}
          loading={loading}
          error={null}
          selectedSpots={[]}
          onToggleSelection={() => {}}
          onSpotClick={handleSpotClick}
        />
      </div>
      {/* SpotDetail */}
      {selectedSpot && (
        <div className="w-1/4 overflow-y-auto h-full">
          <SpotDetail
            selectedSpot={selectedSpot}
            setSelectedSpot={setSelectedSpot}
            handleSpotScrap={handleSpotScrap}
          />
        </div>
      )}
      {/* MapLayout */}
      <div className={`${selectedSpot ? 'w-1/2' : 'w-3/4'}`}>
        <Map mapRef={mapRef} markers={scrapedSpots} markerType="spot" />
      </div>
      {/* SpotUploader */}
      {isAdmin && (
        <div>
          <div className="fixed bottom-5 right-15">
            <button
              className="flex z-50 p-3 text-xl font-bold bg-background-light box-shadow rounded-2xl text-charcoal px-2 hover:bg-primary hover:text-background-light hover:p-5"
              onClick={handleOpenUploader}
            >
              <FaRegPenToSquare className="mx-1 my-1" />
              <div>Spot 등록</div>
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
