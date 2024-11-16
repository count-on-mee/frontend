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
    <div className="bg-[#FFFCF2] w-full border-r-2 border-[#403D39]">
      { selectedSpot && (
        <div>
          <div className="block flex justify-end">
            <button onClick={handleClose}>
              <XMarkIcon className="w-7 h-7 m-3" />
            </button>
          </div>
          <Spot spot={selectedSpot} />
          <Spot spot={selectedSpot} />
        </div>
      )}  
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
  );
}
