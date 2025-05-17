import { FaPlus, FaMinus } from 'react-icons/fa';
import { FaLocationCrosshairs } from 'react-icons/fa6';

export default function MapPanel({ onZoomIn, onZoomOut, onLocateMe }) {
  return (
    <div className="fixed right-2 bottom-6 flex flex-col space-y-2">
      <button
        className="bg-[#2E2F35] text-[#FFFCF2] font-semibold px-1 py-1 rounded-md text-xs w-10 h-10 hover:bg-[#FFFCF2] hover:text-[#2E2F35] flex items-center justify-center"
        onClick={onZoomIn}
      >
        <FaPlus />
      </button>
      <button
        className="bg-[#2E2F35] text-[#FFFCF2] font-semibold px-1 py-1 rounded-md text-xs w-10 h-10 hover:bg-[#FFFCF2] hover:text-[#2E2F35] flex items-center justify-center"
        onClick={onZoomOut}
      >
        <FaMinus />
      </button>
      <button
        className="flex justify-center items-center w-10 h-10 bg-[#2E2F35] text-[#FFFCF2] font-semibold rounded-lg hover:bg-[#FFFCF2] hover:text-[#2E2F35] transition-colors"
        onClick={onLocateMe}
      >
        <FaLocationCrosshairs />
      </button>
    </div>
  );
}