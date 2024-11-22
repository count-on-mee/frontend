import { XMarkIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import scrappedSpotsAtom from '../recoil/scrappedspot';
import { useRecoilValue, useSetRecoilState } from 'recoil';

export default function CurationSpot({spot, setSelectedSpot, spots}) {

  const handleClose = () => {
    setSelectedSpot(null);
    };

  const scrappedSpots = useRecoilValue(scrappedSpotsAtom);
  const setScrappedSpots = useSetRecoilState(scrappedSpotsAtom);
  
  const handleScrapClick = (event) => {
    event.stopPropagation();
    setScrappedSpots(prev => ({
      ...prev,
      [spot.id]: !prev[spot.id],
    }));
  };

  return (
    <div className="bg-[#FFFCF2] w-full h-full border-r-2 border-[#403D39]">
      <div className="block flex justify-end">
        <button onClick={handleClose}>
          <XMarkIcon className="w-7 h-7 m-3" />
        </button>
      </div>
      <div className='relative pb-5 border-b-2 border-[#403D39] mt-5'>
        <img
         src={spot.imgUrl} 
         className='mt-5 w-72 h-36 mx-auto opacity-70 object-cover rounded-md'
        />
        <BookmarkIcon
          className={`absolute top-3 right-10 w-5 h-5 ${scrappedSpots[spot.id] ? 'fill-[#EB5E28] stroke-[#EB5E28]' : ''}`}
          onClick={handleScrapClick}
        />
        <p className="mx-7 mt-3 text-md font-mixed">{spot.title}</p>
        <p className="mx-7 text-xs font-mixed text-[#FFFCF2] w-12 bg-[#EB5E28] rounded-full text-center">영업중</p>
        <p className='mx-7 mt-3 text-xs font-mixed text-gray-400'>{spot.addr}</p>
      </div>
      <div className="font-prompt p-5 text-xl">Photos</div>
        <div className="grid grid-cols-2 p-2 gap-2">
        <div className="w-full h-52 border border-[#403D39] flex rounded-md bg-white justify-center items-center">
          <img
            src='../src/assets/img/logo.png'
            className= "w-full px-2"
          />
        </div>
        <div className="w-full h-52 border border-[#403D39] flex rounded-md bg-white justify-center items-center">
          <img
            src='../src/assets/img/logo.png'
            className= "w-full px-2"
          />
        </div>
      </div>
    </div>
  )
}