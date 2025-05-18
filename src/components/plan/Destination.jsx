import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRecoilState } from 'recoil';
import selectedDestinationsAtom from '../../recoil/selectedDestinations';
import useDestinations from '../../hooks/useDestinations';
import clsx from 'clsx';

// 기본 스타일
const baseButtonStyles =
  'flex items-center justify-center rounded-full transition-all duration-200';
const baseShadowStyles = 'shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff]';
const hoverShadowStyles =
  'hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]';

// 선택된 버튼 스타일
const selectedButtonStyles = clsx(
  baseButtonStyles,
  'bg-[var(--color-primary)] text-white',
  'shadow-[inset_3px_3px_6px_#c44e1f,inset_-3px_-3px_6px_#ff6c31]',
);

// 선택되지 않은 버튼 스타일
const unselectedButtonStyles = clsx(
  baseButtonStyles,
  'bg-[var(--color-background-gray)] text-[#252422]',
  'hover:bg-[#E0DFDE]',
);

// 네비게이션 버튼 스타일
const navButtonStyles = clsx(
  baseButtonStyles,
  baseShadowStyles,
  hoverShadowStyles,
  'p-3',
);

// 검색 입력 필드 스타일
const searchInputStyles = clsx(
  'w-full h-12 rounded-full bg-[var(--color-background-gray)]',
  'pl-10 pr-4 focus:outline-none focus:border-[var(--color-primary)]',
  'transition-colors',
);

// 목적지 항목 스타일
const destinationItemStyles = clsx(
  'border-b border-[#252422]/10 bg-[var(--color-background-gray)]',
  'px-5 py-5 text-base',
);

// 이미지 컨테이너 스타일
const imageContainerStyles = clsx(
  baseShadowStyles,
  'h-16 w-16 flex-shrink-0 rounded-full overflow-hidden',
);

// 선택 버튼 스타일
const selectionButtonStyles = (isSelected) =>
  clsx(
    baseButtonStyles,
    baseShadowStyles,
    isSelected ? selectedButtonStyles : unselectedButtonStyles,
    'px-5 py-2 text-base font-semibold',
  );

// 다음 버튼 스타일
const nextButtonStyles = clsx(
  baseButtonStyles,
  baseShadowStyles,
  'bg-[var(--color-primary)] text-white font-semibold',
  'py-3 px-8 text-xl hover:bg-[#D54E23]',
  'transition-colors duration-300',
);

function Destination() {
  const navigate = useNavigate();
  const [selectedDestinations, setSelectedDestinations] = useRecoilState(
    selectedDestinationsAtom,
  );
  const { destinations: apiDestinations, loading, error } = useDestinations();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDestinations = useMemo(
    () =>
      apiDestinations.filter((dest) =>
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [apiDestinations, searchTerm],
  );

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

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleNext = () => {
    if (selectedDestinations.length > 0) {
      navigate('/com/my-scrap-list');
    } else {
      alert('여행지를 선택해주세요.');
    }
  };

  if (loading) {
    return (
      <div className="bg-[var(--color-background-gray)] font-prompt h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
        <p className="mt-4 text-[#252422]">목적지를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--color-background-gray)] font-prompt h-full flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">에러가 발생했습니다: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className={clsx(
            baseButtonStyles,
            baseShadowStyles,
            'bg-[var(--color-primary)] text-white px-4 py-2',
          )}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-background-gray)] font-prompt h-full flex flex-col">
      <div className="flex items-center justify-between p-8">
        <button onClick={goBack} className={navButtonStyles}>
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
        <h2 className="text-4xl font-semibold text-[#252422] drop-shadow-[3px_3px_6px_#b8b8b8]">
          어디로 떠나시나요?
        </h2>
        <div className="w-8"></div>
      </div>
      <div className="w-4/5 mx-auto py-8 relative">
        <div className={clsx(baseShadowStyles, 'rounded-full')}>
          <MagnifyingGlassIcon className="absolute h-5 w-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            className={searchInputStyles}
            type="text"
            placeholder="목적지 검색"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div
        className="overflow-y-auto rounded-lg mb-8 mx-8"
        style={{ maxHeight: '400px' }}
      >
        <table className="w-full">
          <tbody className="text-[#252422]">
            {filteredDestinations.map((dest, idx) => (
              <tr key={dest.tripDestinationId}>
                <td className={destinationItemStyles}>
                  <div className="flex items-center">
                    <div className={imageContainerStyles}>
                      <img
                        className="h-full w-full object-cover"
                        src={
                          dest.imgUrl ||
                          `https://loremflickr.com/100/100?random=${5 * idx}`
                        }
                        alt={dest.name}
                        onError={(e) => {
                          e.target.src = `https://loremflickr.com/100/100?random=${5 * idx}`;
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
                      className={selectionButtonStyles(
                        selectedDestinations.some(
                          (d) => d.tripDestinationId === dest.tripDestinationId,
                        ),
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
      <div className="flex justify-center mb-8">
        <button onClick={handleNext} className={nextButtonStyles}>
          다음 단계로
        </button>
      </div>
    </div>
  );
}

export default Destination;
