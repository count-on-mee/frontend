import React from 'react';
import { Link } from 'react-router-dom';

const SupportNavbar = () => {
  return (
    <nav className="flex justify-center items-center pt-28  bg-[#FFFCF2]">
      <div className="bg-[#CCC5B9] rounded-full px-10 py-5">
        <ul className="flex justify-center space-x-20">
          <li>
            <Link
              to="notice"
              className="text-[#252422] text-lg font-medium hover:text-[#FFFCF2] transition-colors duration-200"
            >
              공지사항
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
              1:1 문의
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SupportNavbar;
