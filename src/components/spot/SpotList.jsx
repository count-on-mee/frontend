import { useRecoilValue, useSetRecoilState } from 'recoil';
import Searchbar from '../ui/Searchbar';
import Spot from './Spot';
import spotMarkersAtom from '../../recoil/spotMarkers';
import { withCenter } from '../../recoil/selectedSpot';
import { useState, useEffect } from 'react';
import { useSearch } from '../../hooks/useSearch';

export default function SpotList({ handleSpotScrap, onSpotClick, spots }) {
  // const spots = useRecoilValue(spotMarkersAtom);
  const setSelectedSpotWithCenter = useSetRecoilState(withCenter);
  const [currentPage, setCurrentPage] = useState(1);
  // const [currentSpots, setCurrentSpots] = useState([]);
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

  //페이지 다섯개만 나오도록 그룹화(5페이지씩)
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
    <div>
      <Searchbar value={searchTerm} onChange={handleSearch}/>
      {spots.length === 0 ? (
        <p className="text-center">스팟을 검색하거나 지도를 움직여 주세요.</p>
      ) : (
        <div>
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
          <div className="text-center py-3">
            <button
              onClick={handlePrevGroup}
              disabled={currentPageGroup === 1}
              className="mx-1 px-2 py-1 rounded bg-background-light text-[#2E2F35] box-shadow"
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
                    className={`mx-1 px-1.5 py-1 rounded box-shadow ${
                      currentPage === pageNumber
                        ? 'bg-primary text-background-light'
                        : 'bg-background-light text-[#2E2F35]'
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
              className="mx-1 px-2 py-1 rounded box-shadow bg-background-light text-[#2E2F35]"
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
