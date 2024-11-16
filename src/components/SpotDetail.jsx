import Spot from './Spot';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function SpotDetail({ selectedSpot, setSelectedSpot }) {
  const handleClose = () => {
    setSelectedSpot(null);
  };

  return (
    <div className="bg-[#FFFCF2] w-full border-r-2 border-[#403D39]">
      { selectedSpot && (
        <div>
          <div className="block flex justify-end">
            <button onClick={handleClose}>
              <XMarkIcon className="w-7 h-7 m-3" />
            </button>
          </div>
          <Spot spot={selectedSpot} />
        </div>
      )}  
    </div>
  );
}
