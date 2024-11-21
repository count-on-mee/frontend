import { BookmarkIcon } from '@heroicons/react/24/outline';
import scrappedSpotsAtom from '../recoil/scrappedspot';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Carousel from './Carousel';

export default function Spot({ spot, selectedSpot, onClick }) {

  const scrappedSpots = useRecoilValue(scrappedSpotsAtom);
  const setScrappedSpots = useSetRecoilState(scrappedSpotsAtom);

  const handleScrapClick = (event) => {
    event.stopPropagation();
    setScrappedSpots(prev => ({
      ...prev,
      [spot.id]: !prev[spot.id],
    }));
  };

  const imgUrls = spot.imgUrl

  return (
    <div className="pb-5 border-b-2 border-[#403D39] mt-5" onClick={onClick}>
      <div className="relative">
        <Carousel imgUrls={imgUrls} spot={spot} />
          {/* <img
            src={spot.imgUrl || '../src/assets/img/icon.png'}
            className="mt-5 w-4/5 h-36 mx-auto opacity-70 object-cover rounded-md"
            alt={spot.title}
          /> */}
        <BookmarkIcon
          className={`absolute top-3 right-10 w-5 h-5 ${scrappedSpots[spot.id] ? 'fill-[#EB5E28] stroke-[#EB5E28]' : ''}`}
          onClick={handleScrapClick}
        />
      </div>
      <p className="mx-7 mt-3 text-md font-mixed">{spot.title}</p>
      <p className="mx-7 text-xs font-mixed text-[#FFFCF2] w-12 bg-[#EB5E28] rounded-full text-center">영업중</p>
      <p className="mx-7 text-sm font-mixed text-gray-400">{spot.address}</p>
      {/* {selectedSpot && <p className="ml-5 text-sm">{selectedSpot?.address}</p>} */}
    </div>

  );
}
