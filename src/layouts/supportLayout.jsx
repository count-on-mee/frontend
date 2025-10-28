import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { neumorphStyles, layoutStyles } from '../utils/style';
import serviceIcon from '../assets/service.png';
import questionIcon from '../assets/question.png';
import boardIcon from '../assets/board.png';
import inquiryIcon from '../assets/inquiry.png';

const navItems = [
  { path: '/support/faq', label: '자주 묻는 질문', icon: questionIcon },
  { path: '/support/notice', label: '공지사항', icon: boardIcon },
  { path: '/support/inquiry', label: '1:1 문의', icon: inquiryIcon },
];

const SupportLayout = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f0f0f3] font-prompt">
      <div className="w-full bg-[#f0f0f3] pt-4 sm:pt-6 lg:pt-8">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-3">
          <div className="text-center">
            <div className={`${layoutStyles.flex.center} gap-5 mb-2`}>
              <img
                src={serviceIcon}
                alt="고객지원"
                className="w-20 h-20 sm:w-12 sm:h-12 lg:w-20 lg:h-20"
              />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-[#252422]">
                고객지원
              </h1>
            </div>
            <p className="mt-10 text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto mt-4">
              궁금한 점이 있으면 언제든 문의해 주세요. 빠르고 정확한 답변을
              드리겠습니다.
            </p>
          </div>
          <nav
            className={`${layoutStyles.flex.center} gap-10 sm:gap-5 lg:gap-10 mt-6 lg:mt-8 flex-wrap`}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 rounded-xl font-semibold text-base sm:text-lg lg:text-xl transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? neumorphStyles.smallInset
                      : `${neumorphStyles.small} ${neumorphStyles.hover} text-[#252422]`
                  }`
                }
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-10 h-10 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
                />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.label.split(' ')[0]}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div
          className={`w-full ${neumorphStyles.base} ${neumorphStyles.hover} rounded-2xl p-6`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SupportLayout;
