import { BookmarkIcon } from '@heroicons/react/24/outline';
import Carousel from './Carousel';

export default function Spot({ spot, onClick }) {
  const handleScrapClick = event => {
    event.stopPropagation();
    // setScrappedSpots(prev => ({
    //   ...prev,
    //   [spot.id]: !prev[spot.id],
    // }));
  };

  return (
    <div className="pb-5 border-b-2 border-[#403D39] mt-5" onClick={onClick}>
      <div className="relative">
        <Carousel imgUrls={spot.imgUrl} spot={spot} />
        <BookmarkIcon
          className={`absolute top-3 right-10 w-5 h-5 ${spot.isScraped ? 'fill-[#EB5E28] stroke-[#EB5E28]' : ''}`}
          onClick={handleScrapClick}
        />
      </div>
      <p className="mx-7 mt-3 text-md font-mixed">{spot.title}</p>
      {/* TODO: isOpen */}
      <p className="mx-7 text-xs font-mixed text-[#FFFCF2] w-12 bg-[#EB5E28] rounded-full text-center">
        영업중
      </p>
      <p className="mx-7 text-sm font-mixed text-gray-400">{spot.address}</p>
    </div>
  );
}
