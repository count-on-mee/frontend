import { useState, useMemo } from 'react';
import Curation from './Curation';
import SpotDetail from './SpotDetail';
import spotsAtom from '../recoil/spot';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useRecoilValue } from 'recoil';

export default function CurationDetail({
  selectedCuration,
  setSelectedCuration,
}) {
  const spots = useRecoilValue(spotsAtom);

  // const getRandomSpots = (spots, count) => {
  //   const shuffled = [...spots].sort(() => Math.random() - 0.5);
  //   return shuffled.slice(0, count);
  // };
  // const randomSpots = useMemo(() => getRandomSpots(spots, 10), [spots]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const handleSelectSpot = (spot) => {
    setSelectedSpot(spot);
  };

  return (
    <>
      <div className="w-1/2 bg-[#FFFCF2] border-r-2 border-[#403D39] overflow-y-auto pt-[86px]">
        <div className="flex-wrap">
          <button>
            <ChevronLeftIcon
              className="w-6 h-6 m-3"
              onClick={() => setSelectedCuration()}
            />
          </button>
          <Curation className="my-10 flex" curation={selectedCuration} />
        </div>
        {randomSpots.map(spot => (
          <div
            key={spot.id}
            onClick={() => handleSelectSpot(spot)}
            className="mx-auto w-4/5 bg-white border border-[#403D39] rounded-xl my-3"
          >
            <img
              src={spot.imgUrl || '../src/assets/img/icon.png'}
              className="inline border border-[#403D39] my-3 w-10 h-10 mx-3 opacity-70 object-cover rounded-full"
              alt={spot.title}
            />
            <p className="inline text-xl font-prompt">{spot.title}</p>
          </div>
        ))}
      </div>
      {selectedSpot && (
        <SpotDetail
          selectedSpot={selectedSpot}
          setSelectedSpot={setSelectedSpot}
        />
      )}
    </>
  );
}
