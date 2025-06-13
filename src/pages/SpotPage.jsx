import SpotDetail from '../components/spot/SpotDetail';
import SpotList from '../components/spot/SpotList';
import Map from '../components/map/Map';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { getRecoil } from 'recoil-nexus';
import selectedSpotAtom from '../recoil/selectedSpot';
import spotMarkersAtom from '../recoil/spotMarkers';
import userAtom from '../recoil/user';
import authAtom from '../recoil/auth';
import { useRef } from 'react';
import api from '../utils/axiosInstance';
import scrapStateAtom from '../recoil/scrapState';
import { useSpotScrap } from '../hooks/useSpotScrap';

export default function SpotPage() {
  const [selectedSpot, setSelectedSpot] = useRecoilState(selectedSpotAtom);
  const mapRef = useRef(null);
  const [spotMarkers, setSpotMarkers] = useRecoilState(spotMarkersAtom);
  const user = useRecoilValue(userAtom);
  // const spot = selectedSpot;
  const [scrapState, setScrapState] = useRecoilState(scrapStateAtom);

  const handleSpotClick = (spot) => {
    mapRef.current.setCenter(spot.position);
  };

  const { handleSpotScrap } = useSpotScrap({
    setSpotMarkers,
    selectedSpot,
    setSelectedSpot,
  });

  // const handleSpotScrap = async (spotId) => {
  //   // event.stopPropagation();

  //   const currentScrap = scrapState[spotId];
  //   const isScraped = currentScrap?.isScraped ?? false;
  //   const scrapCount = currentScrap?.scrapCount ?? 0;

  //   if (!user) {
  //     alert('로그인이 필요한 서비스입니다.');
  //     return;
  //   }

  //   // console.log(spot);

  //   try {
  //     const token = getRecoil(authAtom).accessToken;
  //     const method = isScraped ? 'delete' : 'post';
  //     await api({
  //       url: `/scraps/spots/${spotId}`,
  //       method,
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     setSpotMarkers((prev) => {
  //       const updateMarkers = Array.isArray(prev) ? prev : [];
  //       return updateMarkers.map((marker) =>
  //         marker.spotId === spotId
  //           ? { ...marker, isScraped: !marker.isScraped, }
  //           : marker,
  //       );
  //     });

  //     setScrapState((prev) => {
  //       return {
  //         ...prev,
  //         [spotId] : {
  //           isScraped: !isScraped,
  //           scrapCount: scrapCount + (isScraped ? -1 : 1),
  //         }
  //       };
  //     });

  //     if (selectedSpot && selectedSpot.spotId === spotId) {
  //       setSelectedSpot((prev) => ({ ...prev, isScraped: !prev.isScraped, }));
  //     }
  //   } catch (error) {
  //     console.error('Failed to update scrap status', error);
  //   }
  // };

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
        <Map mapRef={mapRef} markers={spotMarkers} markerType="spot" />
      </div>
    </div>
  );
}
