import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import useSocket from '../hooks/useSocket';
import { useRecoilState } from 'recoil';
//import { spotOrderState } from '../recoil/atoms';
import COMNavbar from '../components/COMNavbar';
import Footer from '../components/Footer';
import ErrorBoundary from '../components/ErrorBoundary';
import {
  Container as MapDiv,
  NaverMap,
  Marker,
  useNavermaps,
} from 'react-naver-maps';
import CalendarPage from '../pages/CalendarPage';
import DestinationListPage from '../pages/DestinationListPage';
import MyScrapListPage from '../pages/MyScrapListPage';
import MyTripListPage from '../pages/MyTripListPage';

const COMLayout = () => {
  const [scrollY, setScrollY] = useState(0);
  const location = useLocation();
  const navermaps = useNavermaps();
  const contentRef = useRef(null);
  const tripId = extractTripIdFromLocation(location.pathname);

  const [spotOrder, setSpotOrder] = useRecoilState(spotOrderState);
  const socket = useSocket(tripId);

  useEffect(() => {
    // 소켓 이벤트로 순서 데이터 업데이트
    socket.on('update-spot-order', newOrder => {
      setSpotOrder(newOrder);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, setSpotOrder]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const calculateMapPosition = () => {
    if (!contentRef.current) return 0;

    const viewportHeight = window.innerHeight;
    const mapHeight = viewportHeight * 0.7; // 지도 크기 설정 (70vh)
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
    const footerHeight = document.querySelector('footer')?.offsetHeight || 0;
    const marginTopBottom = 20; // 헤더와 푸터 간의 간격

    const maxScroll = document.documentElement.scrollHeight - viewportHeight;
    const scrollPercentage = Math.min(scrollTop / maxScroll, 1);
    const availableSpace =
      viewportHeight -
      mapHeight -
      headerHeight -
      footerHeight -
      2 * marginTopBottom;

    return Math.max(
      headerHeight + marginTopBottom,
      Math.min(
        scrollPercentage * availableSpace + headerHeight + marginTopBottom,
        viewportHeight - mapHeight - footerHeight - marginTopBottom,
      ),
    );
  };

  const isPopupRoute = [
    '/com/my-trip-list',
    '/com/calendar',
    '/com/destination-list',
    '/com/my-scrap-list',
  ].includes(location.pathname);

  const isOutletRoute = ['/com/itinerary', '/com/details'].includes(
    location.pathname,
  );

  return (
    <div className="flex flex-col min-h-screen">
      <COMNavbar />
      <div
        className="flex-grow bg-[#FFFCF2] flex overflow-hidden"
        ref={contentRef}
      >
        <ErrorBoundary>
          {isPopupRoute ? (
            <div className="fixed inset-0 z-50 overflow-hidden">
              <div className="flex items-center justify-center min-h-screen p-4">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-[#FFFCF2] opacity-10 backdrop-filter backdrop-blur-xl"></div>
                </div>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative z-10 flex flex-col">
                  <div className="flex-grow overflow-hidden">
                    <Suspense fallback={<div>Loading...</div>}>
                      {location.pathname === '/com/my-trip-list' && (
                        <MyTripListPage />
                      )}
                      {location.pathname === '/com/calendar' && (
                        <CalendarPage />
                      )}
                      {location.pathname === '/com/destination-list' && (
                        <DestinationListPage />
                      )}
                      {location.pathname === '/com/my-scrap-list' && (
                        <MyScrapListPage />
                      )}
                    </Suspense>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex">
              <div className="w-1/2 pr-2">
                <Suspense fallback={<div>Loading...</div>}>
                  {isOutletRoute && <Outlet />}
                </Suspense>
              </div>
              {isOutletRoute && (
                <div className="w-1/2 pl-2 p-1 relative">
                  <div
                    className="fixed"
                    style={{
                      top: `${calculateMapPosition()}px`,
                      right: '1rem',
                      height: '70vh',
                      width: 'calc(50% - 2rem)',
                      transition: 'top 0.3s ease-out',
                    }}
                  >
                    <ErrorBoundary>
                      <Suspense fallback={<div>Loading map...</div>}>
                        <MapDiv style={{ width: '100%', height: '100%' }}>
                          {navermaps && (
                            <NaverMap
                              defaultCenter={
                                spotOrder.length > 0
                                  ? new navermaps.LatLng(
                                      spotOrder[0].lat,
                                      spotOrder[0].lng,
                                    )
                                  : new navermaps.LatLng(37.3595704, 127.105399)
                              }
                              defaultZoom={15}
                            >
                              {spotOrder.map((spot, index) => (
                                <Marker
                                  key={spot.id}
                                  position={
                                    new navermaps.LatLng(spot.lat, spot.lng)
                                  }
                                  title={`Spot ${index + 1}: ${spot.name}`}
                                />
                              ))}
                            </NaverMap>
                          )}
                        </MapDiv>
                      </Suspense>
                    </ErrorBoundary>
                  </div>
                </div>
              )}
            </div>
          )}
        </ErrorBoundary>
      </div>
      <Footer />
    </div>
  );
};

export default COMLayout;
