import SpotDetail from '../components/spot/SpotDetail';
import SpotList from '../components/spot/SpotList';
import Map from '../components/map/Map';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { getRecoil } from 'recoil-nexus';
import selectedSpotAtom from '../recoil/selectedSpot';
import spotMarkersAtom from '../recoil/spotMarkers';
import userAtom from '../recoil/user';
import authAtom from '../recoil/auth';
import { useRef, useState, useEffect } from 'react';
import api from '../utils/axiosInstance';
import scrapStateAtom from '../recoil/scrapState';
import { useSpotScrap } from '../hooks/useSpotScrap';

export default function SpotPage() {
  const [selectedSpot, setSelectedSpot] = useRecoilState(selectedSpotAtom);
  const mapRef = useRef(null);
  const [spotMarkers, setSpotMarkers] = useRecoilState(spotMarkersAtom);
  const user = useRecoilValue(userAtom);
  const [scrapState, setScrapState] = useRecoilState(scrapStateAtom);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);

  const handleSpotClick = (spot) => {
    mapRef.current.setCenter(spot.position);
  };

  const { handleSpotScrap } = useSpotScrap({
    setSpotMarkers,
    selectedSpot,
    setSelectedSpot,
  });

  useEffect(() => {
    if (spotMarkers?.length > 0){
      if (activeCategories?.length === 0) {
         setFilteredMarkers(spotMarkers);
      } else {
        const newMarkers = spotMarkers.filter(marker =>
          Array.isArray(marker.categories) &&  Array.isArray(activeCategories) && activeCategories.some(category => marker.categories.includes(category)));
          setFilteredMarkers(newMarkers);
        }
    }
      // console.log("ac:", activeCategories);
      // console.log("fm:", filteredMarkers);
  }, [spotMarkers, activeCategories]);

  return (
    <div className="w-full flex h-[calc(100vh-80px)]">
      {/* SpotList */}
      <div className="w-1/4 overflow-y-auto h-full">
        <SpotList
          onSpotClick={handleSpotClick}
          handleSpotScrap={handleSpotScrap}
          spots={filteredMarkers}
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
        <Map mapRef={mapRef} markers={spotMarkers} markerType="spot" filteredMarkers={filteredMarkers} activeCategories={activeCategories} setActiveCategories={setActiveCategories}/>
      </div>
    </div>
  );
}
