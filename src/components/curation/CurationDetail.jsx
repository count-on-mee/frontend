import { useRecoilState } from 'recoil';
import Curation from './Curation';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import SpotDetail from '../spot/SpotDetail';
import selectedCurationSpotAtom from '../../recoil/selectedCurationSpot';
import defaultImage from '../../assets/icon.png';

export default function CurationDetail({
  selectedCuration,
  setSelectedCuration,
}) {
  const [selectedCurationSpot, setSelectedCurationSpot] = useRecoilState(
    selectedCurationSpotAtom,
  );

  const handleSelectSpot = (spot) => {
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
        {selectedCuration.spots.map((spotInfo) => {
          const { spot } = spotInfo;
          return (
            <div
              key={spot.spotId}
              onClick={() => handleSelectSpot(spot)}
              className="mx-auto w-5/6 bg-white border border-[#403D39] rounded-xl my-3"
            >
              <img
                src={spot.imgUrl.length > 0 ? spot.imgUrl[0] : defaultImage}
                className="inline border border-[#403D39] my-3 w-10 h-10 mx-3 opacity-70 object-cover rounded-full"
                alt={spot.title}
              />
              <p className="inline text-xs font-mixed font-bold">
                {spot.title}
              </p>
            </div>
          );
        })}
      </div>
      {selectedCurationSpot && (
        <div className="w-1/2">
          <SpotDetail
            spot={selectedCurationSpot}
            setSelectedSpot={setSelectedCurationSpot}
          />
        </div>
      )}
    </div>
  );
}
