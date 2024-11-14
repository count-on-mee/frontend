import { useRecoilValue } from 'recoil';
import Spot from './Spot';
import { spotsAtom } from '../atoms/SpotsAtom';
import SpotPhotos from './SpotPhotos';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function SpotDetail({ selectedSpot, setSelectedSpot }) {
  const handleClose = () => {
    setSelectedSpot(null);
  };
  const spots = useRecoilValue(spotsAtom);

  return (
    <div className="bg-[#FFFCF2] w-1/2 h-screen border-r-2 border-[#403D39] overflow-y-auto">
      {setSelectedSpot && (
        <>
          <button onClick={handleClose}>
            <XMarkIcon className="absolute w-7 h-7 right-5 top-1" />
          </button>
          <Spot spot={selectedSpot} selectedSpot={selectedSpot} />
          <p className="font-promt pl-5 pt-5 text-2xl font-bold">Photos</p>
          <div className="grid grid-cols-2 gap-2 px-2">
            {spots.map(spot => (
              <SpotPhotos key={spot.id} spot={spot} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
