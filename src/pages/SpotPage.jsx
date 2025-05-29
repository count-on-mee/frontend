import SpotDetail from '../components/spot/SpotDetail';
import SpotList from '../components/spot/SpotList';
import Map from '../components/map/Map';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { getRecoil } from 'recoil-nexus';
import selectedSpotAtom from '../recoil/selectedSpot';
import markersAtom from '../recoil/markers';
import userAtom from '../recoil/user';
import authAtom from '../recoil/auth';
import { useRef } from 'react';
import api from '../utils/axiosInstance';

export default function SpotPage() {
  const [selectedSpot, setSelectedSpot] = useRecoilState(selectedSpotAtom);
  const mapRef = useRef(null);
  const setMarkers = useSetRecoilState(markersAtom);
  const user = useRecoilValue(userAtom);
  const spot = selectedSpot;

  const handleSpotClick = (spot) => {
    mapRef.current.setCenter(spot.position);
  };

  const handleSpotScrap = async (event) => {
    // event.stopPropagation();

    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    try {
      const token = getRecoil(authAtom).accessToken;
      const method = spot.isScraped ? 'delete' : 'post';
      await api({
        url: `/scraps/spots/${spot.id}`,
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      setMarkers((prev) => {
        const updateMarkers = Array.isArray(prev) ? prev : [];
        return updateMarkers.map((marker) =>
          marker.id === spot.id
            ? { ...marker, isScraped: !marker.isScraped }
            : marker,
        );
      });
      if (selectedSpot && selectedSpot.id === spot.id) {
        setSelectedSpot((prev) => ({ ...prev, isScraped: !prev.isScraped }));
      }
    } catch (error) {
      console.error('Failed to update scrap status', error);
    }
  };
  return (
    <div className="w-full flex h-[calc(100vh-80px)]">
      {/* SpotList */}
      <div className="w-1/4 overflow-y-auto h-full">
        <SpotList
          onSpotClick={handleSpotClick}
          handleSpotScrap={handleSpotScrap}
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
        <Map mapRef={mapRef} />
      </div>
    </div>
  );
}
