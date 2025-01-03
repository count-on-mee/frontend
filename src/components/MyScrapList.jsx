import { Suspense, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Container as MapDiv, NaverMap, useNavermaps } from 'react-naver-maps';
import { useRecoilState } from 'recoil';
import selectedSpotsAtom from '../recoil/selectedSpots';
import selectedDestinationsAtom from '../recoil/selectedDestinations';
import tripDatesAtom from '../recoil/tripDates';
import defaultImage from '../assets/img/icon.png';
import CurationModal from './CurationModal';

function MyScrapList() {
  const navigate = useNavigate();
  const [selectedSpots, setSelectedSpots] = useRecoilState(selectedSpotsAtom);
  const [selectedDestinations, setSelectedDestinations] = useRecoilState(
    selectedDestinationsAtom,
  );
  const [tripDates, setTripDates] = useRecoilState(tripDatesAtom);
  const [scrapedSpots, setScrapedSpots] = useState([]);
  const [scrapedCurations, setScrapedCurations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurationId, setSelectedCurationId] = useState(null);
  const [showCurationModal, setShowCurationModal] = useState(false);
  const [curationSpots, setCurationSpots] = useState([]);

  const handleCurationClick = async curationId => {
    try {
      setSelectedCurationId(curationId); // Ensure curationId is set
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `http://localhost:8888/curations/${curationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error('spot 데이터 fetch 실패.');

      const curationData = await response.json();
      setCurationSpots(curationData.spots);
      setShowCurationModal(true);
    } catch (error) {
      console.error('Error fetching curation data:', error);
    }
  };

  const goBack = () => navigate('/com/destination');

  useEffect(() => {
    const fetchScrapedSpots = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:8888/scraps/spots', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setScrapedSpots(data);
      } catch (error) {
        console.error('Failed to fetch scraped spots:', error);
      }
    };

    const fetchScrapedCurations = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:8888/scraps/curations', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('큐레이션 데이터:', data);
        setScrapedCurations(data);
      } catch (error) {
        console.error('큐레이션 데이터를 가져오지 못했습니다:', error);
      }
    };

    fetchScrapedSpots();
    fetchScrapedCurations();
  }, []);

  const handleSearch = e => setSearchTerm(e.target.value);

  const toggleSelection = place => {
    setSelectedSpots(prev => {
      const isSelected = prev.some(spot => spot.spotId === place.spotId);
      if (isSelected) {
        return prev.filter(spot => spot.spotId !== place.spotId);
      } else {
        return [...prev, place];
      }
    });
  };

  const closeCurationModal = () => {
    setShowCurationModal(false);
    setSelectedCurationId(null);
  };

  const handleStartTrip = async () => {
    if (selectedSpots.length > 0) {
      const spotIds = selectedSpots
        .map(spot => spot.spotId)
        .filter(spotId => spotId !== null && spotId !== undefined);
      try {
        const token = localStorage.getItem('accessToken');
        const method = 'POST';
        const response = await fetch(`http://localhost:8888/trips`, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: `${selectedDestinations.map(d => d.name).join(', ')} 여행`,
            destination: selectedDestinations.map(d => d.name).join(', '),
            startDate: tripDates.startDate,
            endDate: tripDates.endDate,
            spotIds,
          }),
        });

        setSelectedDestinations([]);
        setTripDates({
          startDate: null,
          endDate: null,
        });
        setSelectedSpots([]);
        const responseBody = await response.json();
        const newTripId = responseBody.tripId;
        navigate(`/com/${newTripId}/itinerary`);
      } catch (error) {
        console.error('여행 저장 실패:', error);
        alert('여행 저장에 실패했습니다. 다시 시도해주세요.');
      }
    } else {
      alert('스팟을 선택해주세요.');
    }
  };

  function MapLayout() {
    const navermaps = useNavermaps();
    return (
      <div className="w-1/2 p-4">
        <MapDiv style={{ width: '100%', height: 'calc(100vh - 100px)' }}>
          <NaverMap
            defaultCenter={new navermaps.LatLng(37.3595704, 127.105399)}
            defaultZoom={15}
          ></NaverMap>
        </MapDiv>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#FFFCF2] px-10 py-7 ">
      <div className="flex items-center justify-between p-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#252422"
          className="size-10 cursor-pointer"
          onClick={goBack}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        <h2 className="text-3xl font-semibold text-[#252422]">My Scrap List</h2>
        <div className="size-10"></div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 p-4 overflow-y-auto">
          <h2 className="text-2xl font-semibold text-[#252422] mb-6">
            {selectedDestinations.length > 0
              ? `${selectedDestinations.map(d => d.name).join(', ')}`
              : 'Your List'}
          </h2>
          <div className="w-full mb-6 relative">
            <MagnifyingGlassIcon className="absolute h-5 w-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              className="w-full h-9 rounded-full border-2 border-[#403D39] pl-10 pr-4 focus:outline-none focus:border-[#EB5E28] transition-colors"
              type="text"
              placeholder="장소 검색"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div
            className="overflow-y-auto rounded-lg mb-10"
            style={{ maxHeight: 'calc(100vh - 350px)' }}
          >
            <table className="w-full">
              <tbody className="text-[#252422]">
                {scrapedSpots.map(spot => (
                  <tr
                    key={spot.spotId}
                    className="flex flex-wrap items-center border-b border-[#252422] bg-[#FFFCF2]"
                  >
                    <td className="px-5 py-3 text-sm flex-grow">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-full w-full rounded-full"
                            src={spot.imgUrl || defaultImage}
                            alt={spot.title}
                            loading="lazy"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="whitespace-normal">{spot.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleSelection(spot)}
                        className={`rounded-full px-3 py-1 text-sm font-semibold transition-colors duration-200 ease-in-out w-full sm:w-auto ${
                          selectedSpots.some(
                            selectedSpot => selectedSpot.spotId === spot.spotId,
                          )
                            ? 'bg-[#EB5E28] text-white hover:bg-[#D64E1E]'
                            : 'bg-[#FFFCF2] border border-[#252422] text-[#252422] hover:bg-gray-200'
                        }`}
                      >
                        {selectedSpots.some(
                          selectedSpot => selectedSpot.spotId === spot.spotId,
                        )
                          ? '선택'
                          : '선택'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="text-2xl font-semibold text-[#252422] mt-8 mb-4">
            Curations
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {scrapedCurations.length === 0 ? (
              <p>큐레이션이 없습니다.</p>
            ) : (
              scrapedCurations.map(curation => (
                <div
                  key={curation.curationId}
                  className="bg-white rounded-lg shadow-md overflow-hidden text-white"
                  style={{
                    backgroundImage: `url(${curation.imgUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                  onClick={() => {
                    handleCurationClick(curation.curationId);
                  }}
                >
                  <div className="p-4">
                    <h4 className="text-lg font-semibold">{curation.title}</h4>
                  </div>
                </div>
              ))
            )}

            {showCurationModal && (
              <CurationModal
                selectedCurationId={selectedCurationId}
                setShowCurationModal={setShowCurationModal}
              />
            )}
          </div>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <MapLayout />
        </Suspense>
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={handleStartTrip}
          className="bg-[#EB5E28] text-white font-semibold py-3 px-8 rounded-full hover:bg-[#D64E1E] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          여행 시작하기!
        </button>
      </div>
    </div>
  );
}

function MyScrapListPopup() {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-[#FFFCF2] opacity-70 backdrop-filter backdrop-blur-xl"></div>
        </div>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] relative z-10 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <MyScrapList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyScrapListPopup;
