import { Outlet } from 'react-router-dom';
import {
  Container as MapDiv,
  NaverMap,
  Marker,
  useNavermaps,
} from 'react-naver-maps';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import COMNavbar from '../components/COMNavbar';

const COM = () => {
  const navermaps = useNavermaps();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow bg-[#FFFCF2] flex">
        <div className="w-1/2 pr-2">
          <div className="bg-[#FFFCF2] w-full">
            <COMNavbar />
            <Outlet />
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
            <MapDiv style={{ width: '100%', height: '100%' }}>
              <NaverMap
                defaultCenter={new navermaps.LatLng(37.3595704, 127.105399)}
                defaultZoom={15}
              >
                <Marker
                  defaultPosition={new navermaps.LatLng(37.3595704, 127.105399)}
                />
              </NaverMap>
            </MapDiv>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default COM;
