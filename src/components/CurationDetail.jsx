import { useState, useEffect } from 'react';
import Curation from './Curation';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import curationData from '../dummydata/curation.json';
import CurationSpot from './CurationSpot';

export default function CurationDetail({
  selectedCuration,
  setSelectedCuration,
}) {
  const [curations, setCurations] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);

  useEffect(() => {
    setCurations(curationData);
  }, [])

  const spots = curationData[0].spot;
  
  const handleSelectSpot = (spot) => {
    console.log('Spot clicked:', spot);
    setSelectedSpot(spot);
  };

  return (
    <div className='flex'>
      <div className="w-full bg-[#FFFCF2] border-r-2 border-[#403D39] overflow-y-auto">
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
      {selectedSpot && (
        <div className='w-full'>
          <CurationSpot 
            spot={selectedSpot}
            setSelectedSpot={setSelectedSpot}
            spots={spots}/>
        </div>
      )}
    </div>
  );
}
