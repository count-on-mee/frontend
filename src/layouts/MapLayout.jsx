<<<<<<< HEAD
import { Outlet } from 'react-router-dom';
=======
import { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
>>>>>>> 620a231344f9e1870ccfb18cfc902c0e1b7eb0a4
import {
  Container as MapDiv,
  NaverMap,
  Marker,
  useNavermaps,
} from 'react-naver-maps';
import Header from '../components/Header';
import MapPanel from '../components/map/MapPanel';
import MapResearch from '../components/map/MapResearch';
import { useRecoilState, useSetRecoilState } from 'recoil';
import centerAtom from '../recoil/center';
import zoomAtom from '../recoil/zoom';
import markersAtom from '../recoil/markers';
import selectedSpotAtom, { withCenter } from '../recoil/selectedSpot';

export default function MapLayout() {
  const naverMaps = useNavermaps();
  const [mapDivWidth, setMapDivWidth] = useState('100%');
  const mapRef = useRef(null);

  const [markers, setMarkers] = useRecoilState(markersAtom);
  const [center, setCenter] = useRecoilState(centerAtom);
  const [zoom, setZoom] = useRecoilState(zoomAtom);
  const [selectedSpot, setSelectedSpot] = useRecoilState(selectedSpotAtom);
  const setSelectedSpotWithCenter = useSetRecoilState(withCenter);

  const navigate = useNavigate();
  const location = useLocation();
  const isSidebar = location.pathname.includes('/map/spot');

  useEffect(() => {
    handleLocateMe();
  }, []);

  useEffect(() => {
    const width = isSidebar ? (selectedSpot ? '50%' : '75%') : '100%';
    setMapDivWidth(width);
  }, [isSidebar, selectedSpot]);

  const handleZoomIn = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.setZoom(currentZoom - 1);
    }
  };

  const handleZoomChanged = useCallback(
    newZoom => {
      setZoom(newZoom);
    },
    [setZoom],
  );

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
        },
        error => {
          console.error('Error occurred while fetching location:', error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert('User denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              alert('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              alert('The request to get user location timed out.');
              break;
            case error.UNKNOWN_ERROR:
              alert('An unknown error occurred.');
              break;
            default:
              alert('An error occurred while fetching location.');
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleSearch = async () => {
    setSelectedSpot(null);
    const url = new URL('http://localhost:8888/spots/search');
    url.searchParams.append('lat', center.lat);
    url.searchParams.append('lng', center.lng);
    url.searchParams.append('zoom', zoom);

    try {
      const response = await fetch(url, {
        method: 'GET',
      });
      const data = await response.json();
      setMarkers(
        data.map(place => ({
          id: place.spotId,
          position: new naverMaps.LatLng(
            place.location.lat,
            place.location.lng,
          ),
          title: place.title,
          address: place.address,
          imgUrl: place.imgUrl,
          businessHours: place.businessHours,
          isOpen: place.isOpen,
          isScraped: place.isScraped,
        })),
      );
    } catch (error) {
      console.error('Error occurred while searching:', error);
    }
  };

  const handleMarkerClick = marker => {
    setSelectedSpotWithCenter(marker);
    navigate('/map/spot');
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
<<<<<<< HEAD
      <Outlet /> {/* 자식 컴포넌트가 렌더링될 위치 */}
      {/* 변경되지 않을 컴포넌트 */}
      <MapDiv
        style={{
          width: '100%',
          height: '600px',
        }}
      >
        <NaverMap
          defaultCenter={new navermaps.LatLng(37.3595704, 127.105399)}
          defaultZoom={15}
        >
          <Marker
            defaultPosition={new navermaps.LatLng(37.3595704, 127.105399)}
          />
        </NaverMap>{' '}
      </MapDiv>
      <Footer />
=======
      <Outlet context={{ handleSearch }} />
      <div className="flex flex-grow">
        <div className="flex-grow" />
        <MapDiv
          style={{
            width: mapDivWidth,
            height: '100%',
          }}
        >
          <MapPanel
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onLocateMe={handleLocateMe}
            onSearch={handleSearch}
          />
          <NaverMap
            ref={mapRef}
            mapTypeId={naverMaps.MapTypeId.NORMAL}
            zoomControl={false}
            center={new naverMaps.LatLng(center.lat, center.lng)}
            defaultZoom={zoom}
            onZoomChanged={handleZoomChanged}
            draggable={true}
            pinchZoom={true}
            scrollWheel={true}
            keyboardShortcuts={true}
            disableDoubleTapZoom={false}
            disableDoubleClickZoom={false}
            disableTwoFingerTapZoom={false}
            tileTransition={true}
            minZoom={7}
            maxZoom={21}
            scaleControl={true}
          >
            {markers.map(marker => (
              <Marker
                key={marker.id}
                position={marker.position}
                title={marker.title}
                onClick={() => handleMarkerClick(marker)}
              />
            ))}
          </NaverMap>
          <MapResearch onSearch={handleSearch} />
        </MapDiv>
      </div>
>>>>>>> 620a231344f9e1870ccfb18cfc902c0e1b7eb0a4
    </div>
  );
}
