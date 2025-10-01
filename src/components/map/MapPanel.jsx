import { FaPlus, FaMinus } from 'react-icons/fa';
import { FaLocationCrosshairs } from 'react-icons/fa6';

export default function MapPanel({ onZoomIn, onZoomOut, onLocateMe }) {
  return (
    <div className="absolute right-4 bottom-8 flex flex-col space-y-2 z-50">
      <button
        className="bg-[#2E2F35] text-[#FFFCF2] font-semibold px-1 py-1 rounded-md text-xs w-10 h-10 hover:bg-[#EB5E28] hover:text-white flex items-center justify-center shadow-lg transition-all duration-200"
        onClick={onZoomIn}
        aria-label="확대"
      >
        <FaPlus />
      </button>
      <button
        className="bg-[#2E2F35] text-[#FFFCF2] font-semibold px-1 py-1 rounded-md text-xs w-10 h-10 hover:bg-[#EB5E28] hover:text-white flex items-center justify-center shadow-lg transition-all duration-200"
        onClick={onZoomOut}
        aria-label="축소"
      >
        <FaMinus />
      </button>
      <button
        className="flex justify-center items-center w-10 h-10 bg-[#2E2F35] text-[#FFFCF2] font-semibold rounded-lg hover:bg-[#EB5E28] hover:text-white transition-all duration-200 shadow-lg"
        onClick={onLocateMe}
        aria-label="현재 위치"
      >
        <FaLocationCrosshairs />
      </button>
    </div>
  );
}
