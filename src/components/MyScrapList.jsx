import React, { Suspense, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Container as MapDiv, NaverMap, useNavermaps } from 'react-naver-maps';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import axios from 'axios';
import selectedSpotsAtom from '../recoil/selectedSpots';
import selectedDestinationsAtom from '../recoil/selectedDestinations';
import tripDatesAtom from '../recoil/tripDates';
import scrapListAtom from '../recoil/scrapList';

function MyScriptList() {
  const navigate = useNavigate();
  const [selectedSpots, setSelectedSpots] = useRecoilState(selectedSpotsAtom);
  const selectedDestinations = useRecoilValue(selectedDestinationsAtom);
  const tripDates = useRecoilValue(tripDatesAtom);
  const [scrapList, setScrapList] = useRecoilState(scrapListAtom);
  const [displayList, setDisplayList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const goBack = () => navigate('/com/destination');

  const recommendedList = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `Recommended List ${i + 1}`,
      places: Array.from({ length: 5 }, (_, j) => ({
        id: `${i + 1}-${j + 1}`,
        name: `Place ${j + 1} in Recommended List ${i + 1}`,
        url: `https://loremflickr.com/100/100?random=${5 * i + j}`,
      })),
    }));
  }, []);

  useEffect(() => {
    if (scrapList.length === 0) {
      const initialScrapList = [
        ...Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          name: `My List ${i + 1}`,
          places: Array.from({ length: 5 }, (_, j) => ({
            id: `${i + 1}-${j + 1}`,
            name: `Place ${j + 1} in List ${i + 1}`,
            url: `https://loremflickr.com/100/100?random=${5 * i + j}`,
          })),
        })),
      ];
      setScrapList(initialScrapList);
    }
    setDisplayList(scrapList.length > 0 ? scrapList : recommendedList);
  }, [scrapList, recommendedList, setScrapList]);

  const allPlaces = useMemo(() => {
    const places = [];
    displayList.forEach(list => {
      places.push(...list.places);
    });
    return places;
  }, [displayList]);

  const filteredPlaces = useMemo(
    () =>
      allPlaces.filter(place =>
        place.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [allPlaces, searchTerm],
  );

  const handleSearch = e => setSearchTerm(e.target.value);

  const toggleSelection = place => {
    setSelectedSpots(prev => {
      const isSelected = prev.some(spot => spot.id === place.id);
      if (isSelected) {
        return prev.filter(spot => spot.id !== place.id);
      } else {
        return [...prev, place];
      }
    });
  };

  const api = axios.create({
    baseURL: 'http://localhost:8888',
  });

  const handleStartTrip = async () => {
    if (selectedSpots.length > 0) {
      try {
        const response = await api.post('/api/trips/create', {
          title: '새로운 여행',
          destination: selectedDestinations.map(d => d.name).join(', '),
          start_date: tripDates.startDate,
          end_date: tripDates.endDate,
        });

        const newTripId = response.data.tripId;
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
                {filteredPlaces.map(place => (
                  <tr
                    key={place.id}
                    className="flex flex-wrap items-center border-b border-[#252422] bg-[#FFFCF2]"
                  >
                    <td className="px-5 py-3 text-sm flex-grow">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-full w-full rounded-full"
                            src={place.url}
                            alt={place.name}
                            loading="lazy"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="whitespace-normal">{place.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleSelection(place)}
                        className={`rounded-full px-3 py-1 text-sm font-semibold transition-colors duration-200 ease-in-out w-full sm:w-auto ${
                          selectedSpots.some(spot => spot.id === place.id)
                            ? 'bg-[#EB5E28] text-white hover:bg-[#D64E1E]'
                            : 'bg-[#FFFCF2] border border-[#252422] text-[#252422] hover:bg-gray-200'
                        }`}
                      >
                        {selectedSpots.some(spot => spot.id === place.id)
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
            {recommendedList.slice(0, 4).map(list => (
              <div
                key={list.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-4">
                  <h4 className="text-lg font-semibold">{list.name}</h4>
                </div>
              </div>
            ))}
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
            <MyScriptList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyScrapListPopup;
