import Spot from './Spot';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import markersAtom from '../recoil/markers';
import { withCenter } from '../recoil/selectedSpot';
import { useState, useEffect } from 'react';

export default function SpotList() {
  const spots = useRecoilValue(markersAtom);
  const setSelectedSpotWithCenter = useSetRecoilState(withCenter);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSpots, setCurrentSpots] = useState([]);
  const spotsPerPage = 15;

  useEffect(() => {
    const indexOfLastSpot = currentPage * spotsPerPage;
    const indexOfFirstSpot = indexOfLastSpot - spotsPerPage;
    setCurrentSpots(spots.slice(indexOfFirstSpot, indexOfLastSpot));
  }, [spots, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [spots]);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="h-lvh w-full overflow-y-auto pb-44">
      {currentSpots.map(spot => (
        <Spot
          key={spot.id}
          spot={spot}
          onClick={() => setSelectedSpotWithCenter(spot)}
        />
      ))}
      <div className="flex justify-center mt-4">
        {Array.from(
          { length: Math.ceil(spots.length / spotsPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? 'bg-[#2E2F35] text-[#FFFCF2]'
                  : 'bg-[#FFFCF2] text-[#2E2F35]'
              }`}
            >
              {i + 1}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
