import { useState, useEffect } from 'react';
import Curation from './Curation';
import SpotDetail from './SpotDetail';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import curationData from '../dummydata/curation.json'

export default function CurationDetail({
  selectedCuration,
  setSelectedCuration,
}) {
  const [curations, setCurations] = useState([]);

  useEffect(() => {
    setCurations(curationData);
  }, [])
  const spots = curationData[0].spot;
  
  // const [selectedSpot, setSelectedSpot] = useState(null);
  // const handleSelectSpot = (spot) => {
  //   setSelectedSpot(spot);
  // };
  return (
    <div>
      <div className="w-full bg-[#FFFCF2] border-r-2 border-[#403D39] overflow-y-auto">
        <div className="flex-wrap">
          <button>
            <ChevronLeftIcon
              className="w-6 h-6 m-3"
              onClick={() => setSelectedCuration()}
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
            <p className="inline text-xs font-prompt">{spot.title}</p>
          </div>
          ))}
          
      </div>
      {/* {selectedSpot && (
        <SpotDetail
          selectedSpot={selectedSpot}
          setSelectedSpot={setSelectedSpot}
        />
      )} */}
    </div>
  );
}
