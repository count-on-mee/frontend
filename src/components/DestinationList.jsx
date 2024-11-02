import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

function DestinationList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState({});

  const destinations = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Destination ${i + 1}`,
      })),
    [],
  );

  const filteredDestinations = useMemo(
    () =>
      destinations.filter(dest =>
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [destinations, searchTerm],
  );

  const goBack = () => navigate(-1);

  const toggleSelection = id => {
    setSelectedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearch = e => setSearchTerm(e.target.value);

  const handleNext = () => {
    const selectedDestinations = Object.keys(selectedItems).filter(
      id => selectedItems[id],
    );
    if (selectedDestinations.length > 0) {
      console.log('Selected destinations:', selectedDestinations);
    } else {
      alert('여행지를 선택해주세요.메롱메롱');
    }
  };

  return (
    <div className="mx-auto max-w-screen px-4 py-14 sm:px-8 font-prompt bg-[#FFFCF2]">
      <div className="flex items-center justify-between pb-10">
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
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
        <h2 className="text-6xl font-semibold text-[#252422]">
          어디로 떠나시나요?
        </h2>
        <div className="size-10"></div>
      </div>
      <div className="w-4/5 mx-auto py-10 relative">
        <MagnifyingGlassIcon className="absolute h-5 w-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          className="w-full h-12 rounded-full border-2 border-[#403D39] font-prompt pl-10 pr-4 focus:outline-none focus:border-[#EB5E28] transition-colors"
          type="text"
          placeholder="목적지 검색"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div
        className="overflow-y-auto rounded-lg mb-10"
        style={{ maxHeight: '400px' }}
      >
        <table className="w-full">
          <tbody className="text-[#252422]">
            {filteredDestinations.map(dest => (
              <tr key={dest.id}>
                <td className="border-b border-[#252422] bg-[#FFFCF2] px-5 py-5 text-base">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-full w-full rounded-full"
                        src={`https://source.unsplash.com/100x100/?travel,${dest.name}`}
                        alt={dest.name}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="whitespace-no-wrap">{dest.name}</p>
                    </div>
                  </div>
                </td>
                <td className="border-b border-[#252422] bg-[#FFFCF2] px-5 py-5">
                  <div className="flex justify-end">
                    <button
                      onClick={() => toggleSelection(dest.id)}
                      className={`rounded-full px-5 py-2 text-base font-semibold transition-colors duration-200 ease-in-out 
                      ${
                        selectedItems[dest.id]
                          ? 'bg-[#EB5E28] text-white hover:bg-[#D64E1E]'
                          : 'bg-[#FFFCF2] border border-[#252422] text-[#252422] hover:bg-gray-200'
                      }`}
                    >
                      {selectedItems[dest.id] ? '선택' : '선택'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleNext}
          className="bg-[#EB5E28] text-white font-semibold py-3 px-8 rounded-full hover:bg-[#D64E1E] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          다음 단계로
        </button>
      </div>
    </div>
  );
}

function DestinationListPopup() {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-[#FFFCF2] opacity-70 backdrop-filter backdrop-blur-xl"></div>
        </div>

        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] relative z-10 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <DestinationList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DestinationListPopup;
