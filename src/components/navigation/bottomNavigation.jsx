import { NavLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import {
  MapPinIcon,
  BookmarkIcon,
  CalendarDaysIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
  MapPinIcon as MapPinSolid,
  BookmarkIcon as BookmarkSolid,
  CalendarDaysIcon as CalendarSolid,
  QuestionMarkCircleIcon as QuestionSolid,
  UserCircleIcon as UserSolid,
} from '@heroicons/react/24/solid';
import userAtom from '../../recoil/user';
import clsx from 'clsx';

const baseNavItems = [
  { to: '/spot', label: 'Spot', Icon: MapPinIcon, ActiveIcon: MapPinSolid },
  {
    to: '/curation',
    label: 'Curation',
    Icon: BookmarkIcon,
    ActiveIcon: BookmarkSolid,
  },
  {
    to: '/com/calendar',
    label: 'CountonMe',
    Icon: CalendarDaysIcon,
    ActiveIcon: CalendarSolid,
  },
  {
    to: '/support/faq',
    label: 'Support',
    Icon: QuestionMarkCircleIcon,
    ActiveIcon: QuestionSolid,
  },
];

export default function BottomNavigation() {
  const user = useRecoilValue(userAtom);

  const myItem = {
    to: user ? '/me' : '/login-notice',
    label: 'My',
    Icon: UserCircleIcon,
    ActiveIcon: UserSolid,
  };

  const navItems = [...baseNavItems, myItem];

  return (
    <nav className="desktop:hidden fixed bottom-0 left-0 right-0 h-16 bg-background-gray border-t border-charcoal/10 z-50 shadow-[0_-2px_16px_rgba(0,0,0,0.08)]">
      <div className="flex items-stretch h-full">
        {navItems.map((navItem) => (
          <NavLink
            key={navItem.label}
            to={navItem.to}
            className={({ isActive }) =>
              clsx(
                'flex-1 flex flex-col items-center justify-center gap-0.5 transition-all duration-150 active:scale-95',
                isActive ? 'text-primary' : 'text-charcoal/40',
              )
            }
          >
            {({ isActive }) => {
              const NavIcon = isActive ? navItem.ActiveIcon : navItem.Icon;
              return (
                <>
                  <NavIcon className="w-6 h-6" />
                  <span
                    className={clsx(
                      'text-[10px]',
                      isActive ? 'font-semibold' : 'font-medium',
                    )}
                  >
                    {navItem.label}
                  </span>
                </>
              );
            }}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
