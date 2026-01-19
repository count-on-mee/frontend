import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import logoImage from '../assets/textIcon.png';

export default function Footer() {
  const links = [
    { to: '/spot', label: 'spot' },
    { to: '/support/faq', label: 'support' },
  ];

  return (
    <>
      <div className="w-full bg-background-gray relative flex justify-center py-1">
        <div className="neumorphism-divider h-[1px] w-[95%] rounded-full bg-gradient-to-r from-transparent via-charcoal/10 to-transparent" />
      </div>

      <footer className="w-full bg-background-gray py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <div className="flex flex-col items-center md:items-start">
              <NavLink to="/" className="flex justify-center md:justify-start">
                <img alt="logo" src={logoImage} className="w-32 h-14 mb-4" />
              </NavLink>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <h3 className="text-charcoal font-semibold text-lg mb-4">
                Support
              </h3>
              <nav className="flex flex-col space-y-2 items-center md:items-end">
                <NavLink
                  to="/support/faq"
                  className={({ isActive }) =>
                    clsx(
                      'text-charcoal font-medium text-base transition-all duration-200',
                      'hover:underline hover:font-bold',
                      isActive && 'underline font-bold',
                    )
                  }
                >
                  FAQ
                </NavLink>
                <NavLink
                  to="/support/notice"
                  className={({ isActive }) =>
                    clsx(
                      'text-charcoal font-medium text-base transition-all duration-200',
                      'hover:underline hover:font-bold',
                      isActive && 'underline font-bold',
                    )
                  }
                >
                  Notice
                </NavLink>
                <NavLink
                  to="/support/inquiry"
                  className={({ isActive }) =>
                    clsx(
                      'text-charcoal font-medium text-base transition-all duration-200',
                      'hover:underline hover:font-bold',
                      isActive && 'underline font-bold',
                    )
                  }
                >
                  Inquiry
                </NavLink>
              </nav>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-charcoal/60 text-sm text-center">
              © 2024 CountOnMe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
