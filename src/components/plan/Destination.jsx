import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import selectedDestinationsAtom from '../../recoil/selectedDestinations';
import useDestinations from '../../hooks/useDestinations';
import { useListSearch } from '../../hooks/useSearch';
import {
  baseStyles,
  componentStyles,
  styleUtils,
  neumorphStyles,
  scrapListStyles,
} from '../../utils/style';
import clsx from 'clsx';
import Searchbar from '../ui/Searchbar';

// 목적지 항목 스타일
const destinationItemStyles = clsx(
  'border-b border-[#252422]/10 bg-[#f0f0f3]',
  'px-5 py-5 text-base',
);

// 이미지 컨테이너 스타일
const imageContainerStyles = clsx(
  baseStyles.shadow,
  'h-16 w-16 flex-shrink-0 rounded-full overflow-hidden',
);


function Destination() {
  const navigate = useNavigate();
  const [selectedDestinations, setSelectedDestinations] = useRecoilState(
    selectedDestinationsAtom,
  );
  const { destinations: apiDestinations, loading, error } = useDestinations();
  const {
    searchTerm,
    handleSearch,
    filteredItems: filteredDestinations,
  } = useListSearch(apiDestinations);

  const goBack = () => navigate('/com/calendar');

  const toggleSelection = (dest) => {
    setSelectedDestinations((prev) => {
      const isSelected = prev.some(
        (d) => d.tripDestinationId === dest.tripDestinationId,
      );
      if (isSelected) {
        return prev.filter(
          (d) => d.tripDestinationId !== dest.tripDestinationId,
        );
      } else {
        return [...prev, dest];
      }
    });
  };

  const handleNext = () => {
    if (selectedDestinations.length > 0) {
      navigate('/com/my-scrap-list');
    } else {
      alert('여행지를 선택해주세요.');
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f0f0f3] font-prompt h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
        <p className="mt-4 text-[#252422]">목적지를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#f0f0f3] font-prompt h-full flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">에러가 발생했습니다: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className={clsx(
            baseStyles.button,
            baseStyles.shadow,
            'bg-[var(--color-primary)] text-white px-4 py-2',
          )}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${neumorphStyles.base} ${neumorphStyles.hover} rounded-2xl p-6 font-prompt h-full flex flex-col`}
    >
      <div className="flex items-center justify-between">
        <button onClick={goBack} className={styleUtils.closeButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#252422"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <h2 className={componentStyles.header}>어디로 떠나시나요?</h2>
        <div className="w-8"></div>
      </div>
      <div className="w-4/5 mx-auto py-6">
        <Searchbar
          value={searchTerm}
          onChange={handleSearch}
          placeholder="목적지 검색"
          size="lg"
        />
      </div>
      <div className="flex-grow overflow-y-auto mb-4 mx-8">
        <table className="w-full">
          <tbody className="text-[#252422]">
            {filteredDestinations.map((dest, idx) => (
              <tr key={dest.tripDestinationId}>
                <td className={destinationItemStyles}>
                  <div className="flex items-center">
                    <div className={imageContainerStyles}>
                      <img
                        className="h-full w-full object-cover"
                        src={dest.imgUrl}
                        alt={dest.name}
                        onError={(e) => {
                          e.target.src = 'https://picsum.photos/200/200';
                        }}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="whitespace-no-wrap font-medium">
                        {dest.name}
                      </p>
                      {dest.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {dest.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className={destinationItemStyles}>
                  <div className="flex justify-end">
                    <button
                      onClick={() => toggleSelection(dest)}
                      className={clsx(
                        scrapListStyles.selectionButton(
                          selectedDestinations.some(
                            (d) => d.tripDestinationId === dest.tripDestinationId,
                          ),
                        ),
                        'px-5 py-2 text-base',
                      )}
                    >
                      {selectedDestinations.some(
                        (d) => d.tripDestinationId === dest.tripDestinationId,
                      )
                        ? '선택'
                        : '선택'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center py-4">
        <button
          onClick={handleNext}
          className={styleUtils.buttonStyle('primary', false, 'lg')}
        >
          다음 단계로
        </button>
      </div>
    </div>
  );
}

export default Destination;
