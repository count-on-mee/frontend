import React from 'react';
import { Link } from 'react-router-dom';

const SupportNavbar = () => {
  return (
    <nav className="flex justify-center items-center h-60 bg-[#FFFCF2]">
      <div className="bg-[#CCC5B9] rounded-full px-10 py-5">
        <ul className="flex justify-center space-x-20">
          <li>
            <Link
              to="notice"
              className="text-[#252422] text-lg font-medium hover:text-[#FFFCF2] transition-colors duration-200"
            >
              Notice
            </Link>
          </li>
          <li>
            <Link
              to="faq"
              className="text-[#252422] text-lg font-medium hover:text-[#FFFCF2] transition-colors duration-200"
            >
              FAQ
            </Link>
          </li>
          <li>
            <Link
              to="inquiry"
              className="text-[#252422] text-lg font-medium hover:text-[#FFFCF2] transition-colors duration-200"
            >
              Inquiry
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SupportNavbar;
