import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useParams } from 'react-router-dom';
import NewPlace from '../components/NewPlace';

const ItineraryModal = ({ onClose, onAddSpot, selectedDay }) => {
  const { tripId } = useParams();
  const [activeTab, setActiveTab] = useState('전체');
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewPlaceOpen, setIsNewPlaceOpen] = useState(false);
  const [allCandidate, setAllCandidate] = useState([]);
  const [myScrapedCandidate, setMyScrapedCandidate] = useState([]);
  const [spotCandidates, setSpotCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSearch = e => setSearchTerm(e.target.value);

  useEffect(() => {
    const fetchAllCandidate = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(
          `http://localhost:8888/spots/search/trips/${tripId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        setAllCandidate(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching all candidates:', error);
        setIsLoading(false);
      }
    };

    const fetchMyScrapedCandidate = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:8888/scraps/spots`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setMyScrapedCandidate(data);
      } catch (error) {
        console.error('Error fetching my scraped candidates:', error);
      }
    };

    const fetchSpotCandidates = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(
          `http://localhost:8888/trips/${tripId}/documents/spot-candidates`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        const spots = data.map(item => item.spot);
        setSpotCandidates(spots);
      } catch (error) {
        console.error('Error fetching spot candidates:', error);
      }
    };

    fetchAllCandidate();
    fetchMyScrapedCandidate();
    fetchSpotCandidates();
  }, [tripId]);

  useEffect(() => {
    filterSpots();
  }, [searchTerm, activeTab, allCandidate, myScrapedCandidate, spotCandidates]);

  const filterSpots = () => {
    let spots =
      activeTab === '전체'
        ? allCandidate
        : activeTab === '내 스크랩'
          ? myScrapedCandidate
          : spotCandidates;

    if (searchTerm.trim() !== '') {
      spots = spots.filter(spot =>
        spot.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredSpots(spots.length > 0 ? spots : []);
  };

  const openNewPlaceModal = () => {
    setIsNewPlaceOpen(true);
  };

  const closeNewPlaceModal = () => {
    setIsNewPlaceOpen(false);
  };

  const handleAddSpot = async spot => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `http://localhost:8888/trips/${tripId}/itineraries`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            spotId: spot.spotId,
            day: selectedDay,
          }),
        },
      );
      const data = await response.json();
      onAddSpot({
        id: spot.spotId,
        name: spot.title,
        address: spot.address,
        location: spot.location,
        day: selectedDay,
        order: data.order,
      });
    } catch (error) {
      console.error('Error adding spot:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="bg-white p-8 rounded-lg max-w-2xl w-full shadow-lg"
        style={{ maxHeight: '90vh' }}
      >
        <div className="flex items-center justify-between mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#252422"
            className="size-10 cursor-pointer"
            onClick={onClose}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          <h2 className="text-2xl font-bold text-[#252422]">
            추가할 스팟 선택 (Day {selectedDay})
          </h2>
          <div className="size-10"></div>
        </div>

        {/* 검색창 */}
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

        <div className="flex space-x-2 mb-6">
          {['전체', '내 스크랩', 'Spot 후보'].map(tab => (
            <button
              key={tab}
              className={`py-2 px-4 rounded-full ${
                activeTab === tab
                  ? 'bg-[#D54E23] text-white'
                  : 'bg-gray-200 text-black'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div
          className="overflow-y-auto rounded-lg mb-4"
          style={{ maxHeight: 'calc(100vh - 350px)' }}
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading...</p>
            </div>
          ) : (
            <table className="w-full">
              <tbody className="text-[#252422]">
                {filteredSpots.map((spot, index) => (
                  <tr
                    key={spot.spotId || index}
                    className="flex items-center border-b border-gray-300"
                  >
                    <td className="px-5 py-3 text-sm flex-grow">
                      <div className="flex items-center">
                        <div className="ml-3">
                          <p className="whitespace-normal">
                            {spot?.title || 'Untitled Spot'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleAddSpot(spot)}
                        className="rounded-full px-3 py-1 text-sm font-semibold bg-[#D54E23] text-white hover:bg-[#EB5E28]"
                      >
                        추가
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {searchTerm?.trim() && filteredSpots.length === 0 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={openNewPlaceModal}
              className="bg-[#D54E23] text-white font-semibold py-3 px-8 rounded-full hover:bg-[#EB5E28]"
            >
              + 신규 장소 등록
            </button>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black font-semibold py-3 px-8 rounded-full hover:bg-gray-400"
          >
            닫기
          </button>
        </div>
      </div>
      {isNewPlaceOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <NewPlace onClose={closeNewPlaceModal} />
        </div>
      )}
    </div>
  );
};

export default ItineraryModal;
