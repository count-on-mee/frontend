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
import curationsAtom from '../recoil/curations';
import { getRecoil } from 'recoil-nexus';
import api from '../utils/axiosInstance';
import userAtom from '../recoil/user';
import curationMarkersAtom from '../recoil/curationMarkers';
import Map from '../components/map/Map';
import SpotDetail from '../components/spot/SpotDetail';
import { useSpotScrap } from '../hooks/useSpotScrap';
import scrapStateAtom from '../recoil/scrapState';
import { useSearch } from '../hooks/useSearch';
import { useNavigate } from 'react-router-dom';

export default function CurationPage() {
  const [curations, setCurations] = useRecoilState(curationsAtom);
  const [selectedCuration, setSelectedCuration] =
    useRecoilState(selectedCurationAtom);
  const [selectedCurationSpot, setSelectedCurationSpot] = useRecoilState(
    selectedCurationSpotAtom,
  );
  const setScrapState = useSetRecoilState(scrapStateAtom)
  const [isUploaderOpen, setIsUploaderOpen] = useState(null);
  const [curationMarkers, setCurationMarkers] =
    useRecoilState(curationMarkersAtom);
  const curation = selectedCuration;
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
      const response = await api.get('/curations', {
      });

      const data = response.data;
      // console.log(data);
      if (curations.length !== data.length) {
        setCurations(data);
      }
    } catch (error) {
      console.error('Failed to fetch curation:', error);
    }
  };

  useEffect(() => {
    fetchCuration();
  }, [curations]);

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
    // console.log(curationMarkers);
  }, [selectedCuration]);

  useEffect(() => {
    const initial = {};
    // console.log(selectedCuration);
    if (Array.isArray(selectedCuration?.spots)) {
      selectedCuration.spots.forEach((spot) => {
      initial[spot.spotId] = {
        isScraped: spot.isScraped,
        scrapCount: spot.scrapedCount,
      };
    });
  }
    setScrapState(initial); // useSetRecoilState(scrapStateAtom)
}, [selectedCuration]);

  const handleScrapClick = async (curation) => {
    // event.stopPropagation();
    if (!user) {
      navigate('/login-notice');
      return;
    }

    if (!curation) {
      console.warn('curation이 null입니다.');
      return;
    }

    // console.log(curation.curationId);

    try {
      const token = getRecoil(authAtom).accessToken;
      const method = curation.isScraped ? 'DELETE' : 'POST';
      await api({
        url: `/scraps/curations/${curation.curationId}`,
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log("token:", token);

      setCurations((prev) => {
        const updatedCurations = Array.isArray(prev) ? prev : [];
        return updatedCurations.map((updatedCuration) =>
          updatedCuration.curationId === curation.curationId
            ? { ...updatedCuration, isScraped: !curation.isScraped }
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
  }

  return (
    <div className="w-full">
      {!selectedCuration ? (
        <div>
          <div className="w-1/2 mb-4 mt-6 ml-5">
            <Searchbar value={searchTerm} onChange={handleSearch} size="lg" />
          </div>
          {/* curationList */}
          <div className="">
            <CurationList
              handleScrapClick={handleScrapClick}
              onSelectedCuration={setSelectedCuration}
              curations={filteredItems}
            />
          </div>
          {/* curationUploader */}
          <div className="fixed bottom-5 right-5">
            <button
              className="flex z-50 p-3 text-xl font-bold bg-background-light box-shadow rounded-2xl text-charcoal px-2 hover:bg-primary hover:text-background-light hover:p-5"
              onClick={handleOpenUploader}
            >
              <FaRegPenToSquare className="mx-1 my-1" />
              <div>Curation 만들기</div>
            </button>
          </div>
          <CurationUploader
            isOpen={isUploaderOpen}
            onClose={() => setIsUploaderOpen(false)}
            fetchCuration={fetchCuration}
          />
        </div>
      ) : (
        // curationDetail
        <div className="w-full flex h-[calc(100vh-80px)]">
          <div className="w-1/4 overflow-y-auto h-full">
            <CurationDetail
              selectedCuration={selectedCuration}
              setSelectedCuration={setSelectedCuration}
              handleScrapClick={handleScrapClick}
              fetchCuration={fetchCuration}
            />
          </div>
          {selectedCurationSpot && (
            <div className="w-1/4 overflow-y-auto h-full">
              <SpotDetail
                selectedSpot={selectedCurationSpot}
                setSelectedSpot={setSelectedCurationSpot}
                handleSpotScrap={handleSpotScrap}
              />
            </div>
          )}
          <div className={`${selectedCurationSpot ? 'w-1/2' : 'w-3/4'}`}>
            <Map
              mapRef={mapRef}
              markers={curationMarkers}
              markerType="curation"
            />
          </div>
        </div>
      )}
    </div>
  );
}
