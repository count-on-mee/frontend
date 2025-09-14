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

export default function SpotPage() {
  const [selectedSpot, setSelectedSpot] = useRecoilState(selectedSpotAtom);
  const mapRef = useRef(null);
  const [spotMarkers, setSpotMarkers] = useRecoilState(spotMarkersAtom);
  const user = useRecoilValue(userAtom);
  const [scrapState, setScrapState] = useRecoilState(scrapStateAtom);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [isUploaderOpen, setIsUploaderOpen] = useState(null);
  const isAdmin = user?.role === "admin"

  const handleSpotClick = (spot) => {
    mapRef.current.setCenter(spot.position);
  };

  const { handleSpotScrap } = useSpotScrap({
    setSpotMarkers,
    selectedSpot,
    setSelectedSpot,
  });

  const handleOpenUploader = () => {
    // if (!user) {
    //   navigate('/login-notice');
    //   return;
    // }
    setIsUploaderOpen(true);
  };

  // console.log(user?.role);

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
      {/* SpotUploader */}
      {isAdmin && 
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
      }
    </div>
  );
}
