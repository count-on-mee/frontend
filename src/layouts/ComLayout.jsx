import React, { useState, useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import COMNavbar from '../components/COMNavbar';
import Header from '../components/Header';
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

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
      <Header />
      <COMNavbar />
      <div className="flex-grow bg-[#FFFCF2] flex">
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
                    className="sticky"
                    style={{
                      top: `${Math.max(0, scrollY)}px`,
                      height: '70vh',
                      transition: 'top 0.1s ease-out',
                    }}
                  >
                    <ErrorBoundary>
                      <Suspense fallback={<div>Loading map...</div>}>
                        <MapDiv style={{ width: '100%', height: '100%' }}>
                          {navermaps && (
                            <NaverMap
                              defaultCenter={
                                new navermaps.LatLng(37.3595704, 127.105399)
                              }
                              defaultZoom={15}
                            >
                              <Marker
                                position={
                                  new navermaps.LatLng(37.3595704, 127.105399)
                                }
                              />
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
