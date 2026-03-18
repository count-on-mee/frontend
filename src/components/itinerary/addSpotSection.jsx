import React, { useState } from 'react';
import Searchbar from '../ui/Searchbar';
import axiosInstance from '../../utils/axiosInstance';
import defaultImage from '../../assets/logo.png';
import { neumorphStyles } from '../../utils/style';

const AddSpotSection = ({ days, onAddSpot, safeItinerary }) => {
  const [showAddSpot, setShowAddSpot] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDayForAdd, setSelectedDayForAdd] = useState(null);

  const handleSearchSpots = async (searchValue) => {
    if (!searchValue || searchValue.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axiosInstance.get('/spots/search', {
        params: { name: searchValue.trim() },
      });
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('스팟 검색 실패:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddSpotToDay = async (spot, day) => {
    if (!spot.spotId || !day) return;

    try {
      const daySpots =
        safeItinerary.find((d) => Number(d.day) === Number(day))?.list || [];
      const order = daySpots.length + 1;

      await onAddSpot(spot, day, order);

      setSearchTerm('');
      setSearchResults([]);
      setSelectedDayForAdd(null);
    } catch (error) {
      console.error('스팟 추가 실패:', error);
      alert(
        `스팟 추가에 실패했습니다: ${error.response?.data?.message || error.message || '알 수 없는 오류'}`,
      );
    }
  };

  if (showAddSpot) {
    return (
      <div
        className={`mb-6 w-full p-6 rounded-2xl ${neumorphStyles.base} ${neumorphStyles.hover}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#252422]">스팟 추가</h3>
          <button
            onClick={() => {
              setShowAddSpot(false);
              setSelectedDayForAdd(null);
              setSearchTerm('');
              setSearchResults([]);
            }}
            className={`${neumorphStyles.small} ${neumorphStyles.hover} px-4 py-2 rounded-full text-sm font-medium text-[#252422]`}
          >
            취소
          </button>
        </div>
        <div className="mb-4">
          <Searchbar
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              if (value.trim()) {
                handleSearchSpots(value);
              } else {
                setSearchResults([]);
              }
            }}
            onSubmit={handleSearchSpots}
            placeholder="스팟 검색"
            className="w-full"
          />
        </div>

        {selectedDayForAdd ? (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[#252422]">
                Day {selectedDayForAdd}에 추가할 스팟을 선택하세요
              </span>
              <button
                onClick={() => setSelectedDayForAdd(null)}
                className={`text-sm px-3 py-1 rounded-full ${neumorphStyles.small} ${neumorphStyles.hover} text-[#252422] font-medium`}
              >
                취소
              </button>
            </div>
            {isSearching ? (
              <div className="text-center py-4 text-[#252422]">검색 중...</div>
            ) : searchResults.length > 0 ? (
              <div className="max-h-60 overflow-y-auto space-y-2">
                {searchResults.map((spot) => (
                  <div
                    key={spot.spotId}
                    onClick={() => handleAddSpotToDay(spot, selectedDayForAdd)}
                    className={`p-3 rounded-full cursor-pointer transition-all duration-200 ${neumorphStyles.small} ${neumorphStyles.hover}`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={spot.imgUrls?.[0] || defaultImage}
                        alt={spot.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#252422] truncate">
                          {spot.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {spot.address}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchTerm.trim() ? (
              <div className="text-center py-4 text-[#252422]">
                검색 결과가 없습니다.
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <p className="text-sm font-medium text-[#252422] mb-3">
              추가할 날짜를 선택하세요
            </p>
            <div className="flex flex-wrap gap-2">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDayForAdd(day)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${neumorphStyles.small} ${neumorphStyles.hover} ${
                    selectedDayForAdd === day
                      ? 'bg-[#f5861d] text-white shadow-[inset_2px_2px_4px_#b85a0f,inset_-2px_-2px_4px_#ffa82b]'
                      : 'text-[#252422]'
                  }`}
                >
                  Day {day}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4 flex justify-end">
      <button
        onClick={() => {
          setShowAddSpot(true);
        }}
        className={`${neumorphStyles.small} ${neumorphStyles.hover} px-4 py-2 rounded-full text-sm font-medium text-[var(--color-primary)]`}
      >
        + 스팟 추가
      </button>
    </div>
  );
};

export default AddSpotSection;
