import Searchbar from './Searchbar';
import SortDropdown from './SortDropdown';
import Spot from './Spot';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import markersAtom from '../recoil/markers';
import { withCenter } from '../recoil/selectedSpot';

export default function SpotList({ searchTerm, onSearch }) {
  const spots = useRecoilValue(markersAtom);
  const setSelectedSpotWithCenter = useSetRecoilState(withCenter);

  return (
    <div className="h-lvh bg-[#FFFCF2] w-full overflow-y-auto border-r-2 border-[#403D39] pb-[88px]">
      <Searchbar searchTerm={searchTerm} onSearch={onSearch} />
      <SortDropdown />
      {spots.map(spot => (
        <Spot
          key={spot.id}
          spot={spot}
          onClick={() => setSelectedSpotWithCenter(spot)}
        />
      ))}
    </div>
  );
}
