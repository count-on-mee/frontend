import { useMemo } from "react";
import Searchbar from "./Searchbar";
import SortDropdown from "./SortDropdown";
import Spot from "./Spot";

export default function SpotList({ spots, searchTerm, onSearch, onSelectSpot }) {
    const filteredSpots = useMemo(
      () =>
        spots.filter(spot =>
          spot.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      [spots, searchTerm],
    );
  
    return (
      <div className="h-screen bg-[#FFFCF2] w-1/2 overflow-y-auto border-r-2 border-[#403D39]">
        <Searchbar searchTerm={searchTerm} onSearch={onSearch} />
        <SortDropdown />
        {filteredSpots.map(spot => (
          <Spot key={spot.id} spot={spot} onClick={() => onSelectSpot(spot)} />
        ))}
      </div>
    );
  }
  