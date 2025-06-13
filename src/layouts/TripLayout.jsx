import React, { useRef } from 'react';
import { Outlet, useParams, Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import useSocket from '../hooks/useSocket';

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
  const { tripId } = useParams();
  const location = useLocation();
  const socketRef = useRef(null);
  const { socket, isConnected, error } = useSocket(tripId);

  // 소켓 인스턴스를 ref에 저장
  if (socket && !socketRef.current) {
    socketRef.current = socket;
  }

  const isActive = (path) => {
    return location.pathname === `/trip/${tripId}${path}`;
  };

  return (
    <div className="min-h-screen w-full bg-[#fafafa] font-prompt">
      <div className="h-16"></div>
      <nav className="w-full">
        <div className="max-w-[90%] mx-auto px-4 py-4">
          <div className="flex justify-center space-x-8">
            <Link
              to={`/trip/${tripId}/itinerary`}
              className={navLinkStyles(isActive('/itinerary'))}
            >
              일정
            </Link>
            <Link
              to={`/trip/${tripId}/details`}
              className={navLinkStyles(isActive('/details'))}
            >
              여행 관리
            </Link>
          </div>
        </div>
      </nav>
      <main className="w-full">
        <div className="max-w-[90%] mx-auto px-4 py-6">
          {error && (
            <div style={{ color: 'red' }}>소켓 에러: {error.message}</div>
          )}
          <Outlet
            context={{ socket: socketRef.current, isConnected, tripId }}
          />
        </div>
      </main>
    </div>
  );
};

export default TripLayout;
