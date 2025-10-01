import { useSetRecoilState } from 'recoil';
import Searchbar from '../ui/Searchbar';
import Spot from './Spot';
import { withCenter } from '../../recoil/selectedSpot';
import { useState, useEffect } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { neumorphStyles } from '../../utils/style';

export default function SpotList({ handleSpotScrap, onSpotClick, spots }) {
  const setSelectedSpotWithCenter = useSetRecoilState(withCenter);
  const [currentPage, setCurrentPage] = useState(1);
  const spotsPerPage = 15;
  const { searchTerm, handleSearch, filteredItems } = useSearch(spots);
  const isSearching = searchTerm && searchTerm.trim() !== '';
  const sourcedItems = isSearching ? filteredItems : spots;
  const indexOfLastSpot = currentPage * spotsPerPage;
  const indexOfFirstSpot = indexOfLastSpot - spotsPerPage;
  const currentItems = sourcedItems.slice(indexOfFirstSpot, indexOfLastSpot);

  const totalItems = sourcedItems.length;
  const totalPages = Math.ceil(totalItems / spotsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 페이지 그룹화 (5페이지씩)
  const [currentPageGroup, setCurrentPageGroup] = useState(1);
  const pageGroupSize = 5;
  const totalGroups = Math.ceil(totalPages / pageGroupSize);

  const startPageGroup = (currentPageGroup - 1) * pageGroupSize + 1;
  const endPageGroup = Math.min(startPageGroup + pageGroupSize - 1, totalPages);

  const handlePrevGroup = () => {
    if (currentPageGroup > 1) {
      setCurrentPageGroup(currentPageGroup - 1);
      paginate((currentPageGroup - 2) * pageGroupSize + 1);
    }
  };

  const handleNextGroup = () => {
    if (currentPageGroup < totalGroups) {
      setCurrentPageGroup(currentPageGroup + 1);
      paginate(currentPageGroup * pageGroupSize + 1);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <Searchbar value={searchTerm} onChange={handleSearch} />
      </div>

      <div className="flex-1 overflow-y-auto">
        {spots.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              스팟을 검색하거나 지도를 움직여 주세요.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentItems.map((spot) => (
              <Spot
                key={spot.spotId}
                spot={spot}
                handleScrapClick={handleSpotScrap}
                onClick={() => {
                  setSelectedSpotWithCenter(spot);
                  onSpotClick(spot);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 페이지네이션  */}
      {spots.length > 0 && (
        <div className="mt-6 pt-4">
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={handlePrevGroup}
              disabled={currentPageGroup === 1}
              className={`px-3 py-2 rounded-lg text-[#252422] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${neumorphStyles.small} ${neumorphStyles.hover}`}
            >
              &lt;
            </button>
            {Array.from(
              { length: endPageGroup - startPageGroup + 1 },
              (_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === pageNumber
                        ? 'bg-[#EB5E28] text-white shadow-[inset_3px_3px_6px_#c44e1f,inset_-3px_-3px_6px_#ff6c31]'
                        : `${neumorphStyles.small} ${neumorphStyles.hover} text-[#252422]`
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              },
            )}
            <button
              onClick={handleNextGroup}
              disabled={currentPageGroup === totalGroups}
              className={`px-3 py-2 rounded-lg text-[#252422] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${neumorphStyles.small} ${neumorphStyles.hover}`}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
