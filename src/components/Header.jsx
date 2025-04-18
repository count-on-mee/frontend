import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import userAtom from '../recoil/user';
import useAuth from '../hooks/useAuth';
import { useRecoilValue } from 'recoil';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const links = [
    { to: '/spot', label: 'spot' },
    { to: '/curation', label: 'curation' },
    { to: '/com/calendar', label: 'count on me' },
    { to: '/support', label: 'support' },
  ];
  const mobileMenuClass =
    'flex flex-col items-center text-background-light text-shadow-header font-medium text-2xl';
  
  const user = useRecoilValue(userAtom);
  const { logout } = useAuth();
  const handleLogout = async () => {
    await logout();
  }
  return (
    <>
      <header className="h-[80px] w-full items-center grid grid-cols-[1fr_2fr_1fr] py-1 bg-primary">
        {/* 웹 메뉴 */}
        <NavLink to="/" className="flex justify-start">
          <img
            alt="logo"
            src="/src/assets/icon.png"
            className="w-24 h-15 border-2 ml-10 lg:ml-20 border-charcoal"
          />
        </NavLink>
        <nav className="hidden lg:flex justify-center text-shadow-header text-background-light font-medium text-2xl">
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
        {user? (
          <div>
            <div>
              {user.nickname}
            </div>
            <button onClick={handleLogout}>logout</button>
          </div>
        ):( <NavLink
          to="/login"
          className="hidden lg:flex text-background-light text-shadow-header font-light hover:font-normal justify-end pr-20"
        >
          Log in
        </NavLink>
        )}
       
        <div></div>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex lg:hidden pr-10 lg:pr-20 justify-end"
        >
          <Bars3Icon className="size-6 text-background-light" />
        </button>
      </header>

      {/* 모바일메뉴 */}
      {mobileMenuOpen && (
        <div className="fixed flex flex-col justify-center inset-0 bg-primary z-40 ">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-5 right-5"
          >
            <XMarkIcon className="size-6 text-background-light" />
          </button>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileMenuClass}
          >
            home
          </Link>
          <hr className="border-background-light my-6 w-2/3 mx-auto" />
          <nav className={mobileMenuClass}>
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className="my-3"
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <hr className="text-background-light my-6 w-2/3 mx-auto" />
          <Link
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileMenuClass}
          >
            log in
          </Link>
        </div>
      )}
    </>
  );
}
