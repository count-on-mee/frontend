import { XMarkIcon } from '@heroicons/react/24/outline';
import defaultImage from '../../assets/icon.png';

export default function SpotCart({ spots, onDelete }) {
  return (
    <div className="flex max-w-full overflow-x-auto">
      {spots.map((spot) => (
        <div key={spot.spotScrapId} className="mr-2">
          <div className="w-18 relative">
            <img
              src={spot.imgUrls[0] || defaultImage}
              alt={spot.name}
              className="rounded-full size-16 object-cover"
            />
            <button
              onClick={() => onDelete(spot.spotScrapId)}
              className="absolute top-1 right-1"
            >
              <XMarkIcon className="w-4 h-4 text-charcoal" />
            </button>
            <div className="text-xs truncate">{spot.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
