import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import {
  MapPinIcon,
  BookmarkIcon,
  CalendarDaysIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon,
  ArrowLeftStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import {
  MapPinIcon as MapPinSolid,
  BookmarkIcon as BookmarkSolid,
  CalendarDaysIcon as CalendarSolid,
  QuestionMarkCircleIcon as QuestionSolid,
  UserCircleIcon as UserSolid,
} from '@heroicons/react/24/solid';
import userAtom from '../../recoil/user';
import useAuth from '../../hooks/useAuth';
import logoImage from '../../assets/logo.png';
import clsx from 'clsx';

const navLinks = [
  {
    to: '/spot',
    label: 'Spot',
    Icon: MapPinIcon,
    ActiveIcon: MapPinSolid,
  },
  {
    to: '/curation',
    label: 'Curation',
    Icon: BookmarkIcon,
    ActiveIcon: BookmarkSolid,
  },
  {
    to: '/com/calendar',
    label: 'Count on Me',
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

export default function SidebarNavigation() {
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="hidden desktop:flex flex-col fixed top-0 left-0 h-screen w-60 bg-background-gray z-50 border-r border-charcoal/5 shadow-[2px_0_12px_rgba(0,0,0,0.06)]">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-charcoal/5">
        <Link to="/" className="flex items-center">
          <img src={logoImage} alt="logo" className="h-10 w-auto rounded-lg" />
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navLinks.map(({ to, label, Icon, ActiveIcon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200',
                isActive
                  ? 'bg-primary text-white shadow-[inset_2px_2px_6px_rgba(0,0,0,0.2),inset_-2px_-2px_6px_rgba(255,255,255,0.1)]'
                  : 'text-charcoal hover:bg-charcoal/5 hover:text-primary',
              )
            }
          >
            {({ isActive }) =>
              isActive ? (
                <>
                  <ActiveIcon className="w-5 h-5 flex-shrink-0" />
                  <span>{label}</span>
                </>
              ) : (
                <>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{label}</span>
                </>
              )
            }
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-charcoal/5 space-y-1">
        {user ? (
          <>
            <Link
              to="/me"
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-charcoal/5 text-charcoal group"
            >
              <img
                src={user.imgUrl}
                className="w-8 h-8 rounded-full object-cover box-shadow flex-shrink-0"
                alt="profile"
              />
              <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                {user.nickname}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-charcoal/50 hover:text-charcoal hover:bg-charcoal/5 transition-all duration-200 w-full text-left text-sm"
            >
              <ArrowLeftStartOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-charcoal hover:bg-charcoal/5 hover:text-primary transition-all duration-200 text-sm font-medium"
          >
            <UserCircleIcon className="w-5 h-5 flex-shrink-0" />
            <span>Log in</span>
          </NavLink>
        )}
      </div>
    </aside>
  );
}
