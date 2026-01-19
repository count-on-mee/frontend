import { NavLink, Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import userAtom from '../recoil/user';
import useAuth from '../hooks/useAuth';
import { useRecoilValue } from 'recoil';
import clsx from 'clsx';
import logoImage from '../assets/logo.png';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const links = [
    { to: '/spot', label: 'spot' },
    { to: '/curation', label: 'curation' },
    { to: '/com/calendar', label: 'count on me' },
    { to: '/support/faq', label: 'support' },
  ];
  const mobileMenuClass = 'flex flex-col items-center font-medium text-2xl';

  const menuTextClass = 'hidden justify-center lg:flex font-medium';

  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  return (
    <>
      <header className="h-[80px] w-full items-center grid grid-cols-[1fr_2fr_1fr] py-1 px-4 bg-background-gray z-50 relative header-border">
        <NavLink to="/" className="flex justify-start">
          <img
            alt="logo"
            src={logoImage}
            className="w-24 h-15 ml-10 lg:ml-20 rounded-lg"
          />
        </NavLink>
        <nav className={clsx(menuTextClass, 'text-2xl')}>
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `xl:px-5 navlink ${isActive ? 'navlink-active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        {user ? (
          <div className="flex items-center">
            <Link to="/me">
              <div className="flex items-center">
                <img
                  className="size-10 rounded-full object-cover mr-2 box-shadow hover-inner-shadow transition-all"
                  src={user.imgUrl}
                />
                <div
                  className={clsx(menuTextClass, 'text-lg pr-5 text-charcoal')}
                >
                  {user.nickname}
                </div>
              </div>
            </Link>
            <button
              className={clsx(
                menuTextClass,
                'text-lg text-charcoal px-4 py-2 rounded-lg transition-all',
              )}
              onClick={handleLogout}
            >
              logout
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            className="hidden lg:flex text-charcoal font-light hover:font-normal justify-end pr-20"
          >
            Log in
          </NavLink>
        )}

        <div></div>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex lg:hidden pr-10 lg:pr-20 justify-end p-2 rounded-lg box-shadow hover-inner-shadow transition-all"
        >
          <Bars3Icon className="size-6 text-charcoal" />
        </button>
      </header>

      {/* 모바일메뉴 */}
      {mobileMenuOpen && (
        <div className="fixed flex flex-col justify-center inset-0 bg-background-gray z-60">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-lg box-shadow hover-inner-shadow transition-all"
          >
            <XMarkIcon className="size-6 text-charcoal" />
          </button>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={clsx(mobileMenuClass, 'text-charcoal')}
          >
            home
          </Link>
          <hr className="border-charcoal/30 my-6 w-2/3 mx-auto" />
          <nav className={mobileMenuClass}>
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className="my-3 text-charcoal"
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <hr className="border-charcoal/30 my-6 w-2/3 mx-auto" />
          <Link
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            className={clsx(mobileMenuClass, 'text-charcoal')}
          >
            log in
          </Link>
        </div>
      )}
    </>
  );
}
