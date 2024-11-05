import { BookmarkIcon } from '@heroicons/react/24/outline';

export default function Spot({ spot, onClick }) {
  return (
    <div className="pb-5 border-b-2 border-[#403D39] mt-5" onClick={onClick}>
      <div className="relative">
        <img
          src={spot.image || '../src/assets/img/icon.png'}
          className="border border-[#403D39] mt-5 w-4/5 mx-auto opacity-70 object-cover rounded-md"
          alt={spot.name}
        />
        <BookmarkIcon className="absolute top-3 right-10 w-5 h-5" />
      </div>
      <p className="ml-5 mt-3 text-xl font-prompt">{spot.name}</p>
      <p className="ml-5 text-sm">{spot.type}</p>
      <p className="ml-5 text-sm">{spot.description}</p>
    </div>
  );
}
