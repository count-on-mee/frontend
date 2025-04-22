import React from 'react';
import { Outlet, useParams, Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

// 기본 스타일
const baseShadowStyles =
  'shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.8)]';
const hoverShadowStyles =
  'hover:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]';
const activeShadowStyles =
  'shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]';

// 네비게이션 링크 스타일
const navLinkStyles = (isActive) =>
  clsx(
    'px-6 py-3 rounded-full transition-all duration-300',
    'text-[#2c3e50] font-medium',
    isActive
      ? 'bg-[#EB5E28] text-white shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2)]'
      : 'bg-white',
    !isActive && baseShadowStyles,
    !isActive && hoverShadowStyles,
  );

const TripLayout = () => {
  const { tripId = 'temp-123' } = useParams();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === `/com/${tripId}${path}`;
  };

  return (
    <div className="min-h-screen w-full bg-[#fafafa] font-prompt">
      <div className="h-16"></div>
      <nav className="w-full">
        <div className="max-w-[90%] mx-auto px-4 py-4">
          <div className="flex justify-center space-x-8">
            <Link
              to={`/com/${tripId}/itinerary`}
              className={navLinkStyles(isActive('/itinerary'))}
            >
              일정
            </Link>
            <Link
              to={`/com/${tripId}/details`}
              className={navLinkStyles(isActive('/details'))}
            >
              여행 관리
            </Link>
          </div>
        </div>
      </nav>
      <main className="w-full">
        <div className="max-w-[90%] mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default TripLayout;
