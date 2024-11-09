import { useRef, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Container as MapDiv,
  NaverMap,
  Marker,
  useNavermaps,
} from 'react-naver-maps';
import Header from '../components/Header';
import MapPanel from '../components/map/MapPanel';
import MapResearch from '../components/map/MapResearch';
import { useDispatch, useSelector } from 'react-redux';

export default function MapLayout() {
  const naverMaps = useNavermaps();
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const markers = useSelector(state => state.markers);
  const center = useSelector(state => state.center);
  const zoom = useSelector(state => state.zoom);

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
      dispatch({ type: 'SET_ZOOM', payload: newZoom });
    },
    [dispatch],
  );

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          dispatch({
            type: 'SET_CENTER',
            payload: { lat: latitude, lng: longitude },
          });
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
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleSearch = async () => {
    if (mapRef.current) {
      const currentCenter = mapRef.current.getCenter();
      const currentZoom = mapRef.current.getZoom();
      const url = new URL('http://localhost:8888/spots/search');
      url.searchParams.append('lat', currentCenter.lat());
      url.searchParams.append('lng', currentCenter.lng());
      url.searchParams.append('zoom', currentZoom);

      try {
        const response = await fetch(url, {
          method: 'GET',
        });
        const data = await response.json();
        dispatch({
          type: 'SET_MARKERS',
          payload: data.map(place => ({
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
        });
      } catch (error) {
        console.error('Error occurred while searching:', error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <Outlet /> {/* 자식 컴포넌트가 렌더링될 위치 */}
      <div className="flex-grow flex">
        <MapDiv
          className="overflow-hidden flex-grow"
          style={{
            width: '100%',
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
              />
            ))}
          </NaverMap>
          <MapResearch onSearch={handleSearch} />
        </MapDiv>
      </div>
    </div>
  );
}
