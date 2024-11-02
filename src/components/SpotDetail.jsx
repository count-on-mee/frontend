import Spot from "./Spot";
import { XMarkIcon } from "@heroicons/react/24/outline";


export default function SpotDetail({ selectedSpot }) {
    

    if (!selectedSpot) {
      return (
        <div className="relative overflow-hidden bg-[#FFFCF2] w-1/2 border-r-2 border-[#403D39]">
          Select a spot to view details
        </div>
      );
    }
  
    return (
      <div className="bg-[#FFFCF2] w-1/2 border-r-2 border-[#403D39]">
        <Spot spot={selectedSpot} />
      </div>
    );
  }