import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';

export default function Searchbar() {
  return (
    <form className="w-4/5 mx-auto py-4" method="get">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute size-4 end-1 mt-3 mr-3 stroke-charcoal" />
        <input
          className="w-full h-8 rounded-3xl inner-shadow p-5 focus:outline-none"
          type="text"
          placeholder="Search"
        />
      </div>
    </form>
  );
}
