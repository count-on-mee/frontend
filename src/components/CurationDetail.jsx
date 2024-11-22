import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import Curation from './Curation';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import curationData from '../dummydata/curation.json';
import CurationSpot from './CurationSpot';
import selectedCurationSpotAtom from '../recoil/selectedCurationSpot';

export default function CurationDetail({
  selectedCuration,
  setSelectedCuration,
}) {
  const [curations, setCurations] = useState([]);
  const [selectedCurationSpot, setSelectedCurationSpot] = useRecoilState(
    selectedCurationSpotAtom,
  );

  useEffect(() => {
    setCurations(curationData);
  }, []);

  const spots = curationData[0].spot;

  const handleSelectSpot = spot => {
    setSelectedCurationSpot(spot);
  };

  return (
    <div className="flex w-full">
      <div className="bg-[#FFFCF2] w-1/2 border-r-2 border-[#403D39] overflow-y-auto">
        <div className="flex-wrap">
          <button>
            <ChevronLeftIcon
              className="w-6 h-6 m-3"
              onClick={() => setSelectedCuration(null)}
            />
          </button>
          <Curation className="my-5 flex" curation={selectedCuration} />
        </div>
        {spots.map(spot => (
          <div
            key={spot.id}
            onClick={() => handleSelectSpot(spot)}
            className="mx-auto w-5/6 bg-white border border-[#403D39] rounded-xl my-3"
          >
            <img
              src={spot.imgUrl || '../src/assets/img/icon.png'}
              className="inline border border-[#403D39] my-3 w-10 h-10 mx-3 opacity-70 object-cover rounded-full"
              alt={spot.title}
            />
            <p className="inline text-xs font-mixed font-bold">{spot.title}</p>
          </div>
        ))}
      </div>
      {selectedCurationSpot && (
        <div className="w-1/2">
          <CurationSpot
            spot={selectedCurationSpot}
            setSelectedCurationSpot={setSelectedCurationSpot}
            spots={spots}
          />
        </div>
      )}
    </div>
  );
}
