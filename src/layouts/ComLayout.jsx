import React, { useState, useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import COMNavbar from '../components/COMNavbar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ErrorBoundary from '../components/ErrorBoundary';
const Map = React.lazy(() => import('../layouts/MapLayout'));
import CalendarPage from '../pages/CalendarPage';
import DestinationListPage from '../pages/DestinationListPage';
import MyScrapListPage from '../pages/MyScrapListPage';

const COMLayout = () => {
  const [scrollY, setScrollY] = useState(0);
  const location = useLocation();

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
      <div className="flex-grow bg-[#FFFCF2] flex">
        <div className="w-1/2 pr-2">
          <div className="bg-[#FFFCF2] w-full">
            <COMNavbar />
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
                          {/* 팝업으로 띄울 내용 */}
                          {location.pathname === '/com/calendar' && (
                            <CalendarPage />
                          )}
                          {location.pathname === '/com/destinationlist' && (
                            <DestinationListPage />
                          )}
                          {location.pathname === '/com/myscraplist' && (
                            <MyScrapListPage />
                          )}
                        </Suspense>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Suspense fallback={<div>Loading...</div>}>
                  {isOutletRoute ? (
                    <>
                      <COMNavbar />
                      <Outlet />{' '}
                    </>
                  ) : (
                    ' '
                  )}
                </Suspense>
              )}
            </ErrorBoundary>
          </div>
        </div>
        <div className="w-1/2 pl-2 p-7 relative">
          <div
            className="sticky"
            style={{
              top: `${Math.max(0, scrollY)}px`,
              height: '80vh',
              transition: 'top 0.1s ease-out',
            }}
          >
            <ErrorBoundary>
              <Suspense fallback={<div>Loading map...</div>}>
                <Map />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default COMLayout;
