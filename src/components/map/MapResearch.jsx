import { useRecoilValue } from 'recoil';
import centerAtom from '../../recoil/center';
import zoomAtom from '../../recoil/zoom';

export default function MapResearch({ handleSearch, center, zoom }) {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <button
        className="bg-[#2E2F35] text-[#FFFCF2] font-semibold px-4 py-2 rounded-md text-md hover:bg-[#FFFCF2] hover:text-[#2E2F35] z-10"
        onClick={() => handleSearch(center, zoom)}
      >
        현 지도에서 검색
      </button>
    </div>
  );
}
