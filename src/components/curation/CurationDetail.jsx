import { useRecoilState, useSetRecoilState } from 'recoil';
import Curation from './Curation';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import selectedCurationSpotAtom from '../../recoil/selectedCurationSpot';
import { withCenter } from '../../recoil/selectedCurationSpot';
import defaultImage from '../../assets/icon.png';
import Hashtag from '../ui/Hashtag';

export default function CurationDetail({
  selectedCuration,
  setSelectedCuration,
  handleScrapClick,
}) {
  const [selectedCurationSpot, setSelectedCurationSpot] = useRecoilState(
    selectedCurationSpotAtom,
  );
  const setSelectedCurationSpotWithCenter = useSetRecoilState(withCenter);

  const handleSelectSpot = (spot) => {
    setSelectedCurationSpot(spot);
  };

  return (
    <div className="flex w-full h-full">
      <div className="bg-background-light overflow-y-auto">
        <div className="flex-wrap">
          <button>
            <ChevronLeftIcon
              className="w-6 h-6 m-3"
              onClick={() => {
                setSelectedCuration(null);
                setSelectedCurationSpot(null);
              }}
            />
          </button>
          <Curation
            className="my-5 flex"
            curation={selectedCuration}
            handleScrapClick={handleScrapClick}
            varient="detail"
          />
          <div className="mx-5 bg-background-gray box-shadow rounded-xl px-5 py-2">
            <Hashtag
              category={selectedCuration.categories}
              varient="curation"
            />
            <div>{selectedCuration.description}</div>
          </div>
        </div>
        {selectedCuration.spots.map((spot, index) => (
          <div
            key={spot.spotId}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectSpot(spot);
              setSelectedCurationSpotWithCenter(spot);
            }}
            className="mx-auto w-5/6 box-shadow bg-background-gray rounded-xl my-3"
          >
            <p className="inline ml-2 px-2 bg-primary/90 rounded-full text-white">
              {index + 1}
            </p>
            <img
              src={spot.imgUrls.length > 0 ? spot.imgUrls[0] : defaultImage}
              className="inline border-[#403D39] my-3 w-10 h-10 mx-3 opacity-70 object-cover rounded-full box-shadow"
              alt={spot.name}
            />
            <p className="inline text-xs font-mixed font-bold">{spot.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
