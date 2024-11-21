import { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
import { ChevronDoubleRightIcon } from '@heroicons/react/24/outline';

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

  const handleCenterChanged = () => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter();
      setCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
    }
  };

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
            onCenterChanged={handleCenterChanged}
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
        <button
          onClick={()=> { navigate('/map/spot') }}
          className='absolute top-1/2 w-10 h-10 bg-[#403D39] rounded-r-lg'
        >
          <ChevronDoubleRightIcon 
            className='w-6 h-6 ml-3 stroke-[#FFFCF2]'
          />
        </button>
      </div>
    </div>
  );
}
