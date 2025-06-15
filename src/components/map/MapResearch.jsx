export default function MapResearch({ onSearch }) {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
      <button
        className="bg-[#2E2F35] text-[#FFFCF2] font-semibold px-4 py-2 rounded-md text-md hover:bg-[#FFFCF2] hover:text-[#2E2F35] z-10"
        onClick={onSearch}
      >
        현 지도에서 검색
      </button>
    </div>
    
  );
}
