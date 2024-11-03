import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Searchbar() {
  return (
    <form className="w-4/5 mx-auto py-4" method="get">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute h-4 w-4 end-1 mt-3 mr-3 stroke-[#403D39]" />
        <input
          className="w-full h-8 rounded-3xl border border-[#403D39] font-prompt p-5 "
          type="text"
          placeholder="   Search"
        />
      </div>
    </form>
  );
}
