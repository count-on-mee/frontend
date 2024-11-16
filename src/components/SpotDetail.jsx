import { useRecoilValue } from 'recoil';
import Spot from './Spot';
import spotsAtom from '../recoil/spot';
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
        <div className="flex-wrap">
          <button onClick={handleClose}>
            <XMarkIcon className="w-7 h-7 ml-48 mt-3" />
          </button>
          <Spot spot={selectedSpot} selectedSpot={selectedSpot} />
          <p className="font-promt pl-5 pt-5 text-2xl font-bold">Photos</p>
          <div className="grid grid-cols-2 gap-2 px-2">
            {selectedSpot.photo.map((photo) => (
              <SpotPhotos key={photo.id}
              photo={photo}
              selectedSpot={selectedSpot}/>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
