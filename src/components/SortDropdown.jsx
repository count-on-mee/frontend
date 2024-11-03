import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
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

export default SortDropdown;
