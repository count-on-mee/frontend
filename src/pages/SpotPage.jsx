import { useState, useMemo } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Searchbar() {
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

function SortDropdown() {
  const sortOptions = [
    { name: '추천순', href: '#', current: true },
    { name: '거리순', href: '#', current: false },
    { name: '뭐할지', href: '#', current: false },
    { name: '고민중', href: '#', current: false },
    { name: '하하하', href: '#', current: false },
  ];
  return (
    <div className="flex items-baseline ml-5">
      <Menu as="div" className="relative">
        <div>
          <MenuButton className="inline-flex justify-center text-prompt bg-[#403D39] w-20 rounded-3xl text-sm font-medium text-white hover:text-gray-900 mb-1 pb-1">
            sort
            <ChevronDownIcon
              aria-hidden="true"
              className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
            />
          </MenuButton>
        </div>

        <MenuItems
          transition
          className="absolute z-10 w-30 origin-top rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <div className="py-1">
            {sortOptions.map(option => (
              <MenuItem key={option.name}>
                <a
                  href={option.href}
                  className={classNames(
                    option.current
                      ? 'font-medium text-gray-900'
                      : 'text-gray-500',
                    'block px-4 py-2 text-sm data-[focus]:bg-gray-100',
                  )}
                >
                  {option.name}
                </a>
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
    </div>
  );
}

function Spot({ spot, onClick }) {
  return (
    <div className="pb-5 border-b-2 border-[#403D39] mt-5" onClick={onClick}>
      <div className="relative">
        <img
          src={spot.image || './src/assets/img/icon.png'}
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

function SpotList({ spots, searchTerm, onSearch, onSelectSpot }) {
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

function SpotDetail({ selectedSpot }) {
  if (!selectedSpot) {
    return (
      <div className="bg-[#FFFCF2] w-1/2 border-r-2 border-[#403D39]">
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

function SpotPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpot, setSelectedSpot] = useState(null);
  const spots = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Spot ${i + 1}`,
        type: `Type ${i + 1}`,
        description: `Description ${i + 1}`,
      })),
    [],
  );

  const handleSearch = e => setSearchTerm(e.target.value);
  const handleSelectSpot = spot => setSelectedSpot(spot);

  return (
    <div>
      <div className="flex fixed z-10">
        <SpotList
          spots={spots}
          searchTerm={searchTerm}
          onSearch={handleSearch}
          onSelectSpot={handleSelectSpot}
        />
        <SpotDetail selectedSpot={selectedSpot} />
      </div>
    </div>
  );
}

export default SpotPage;
