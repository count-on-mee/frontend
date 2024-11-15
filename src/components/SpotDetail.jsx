import Spot from './Spot';

export default function SpotDetail({ selectedSpot }) {
  return (
    <div className="bg-[#FFFCF2] w-full border-r-2 border-[#403D39]">
      <Spot spot={selectedSpot} />
    </div>
  );
}
