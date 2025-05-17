import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Container as MapDiv,
    NaverMap,
    Marker,
    useNavermaps,
  } from 'react-naver-maps';
import { useRecoilState, useSetRecoilState } from 'recoil';
import centerAtom from '../../recoil/center';
import zoomAtom from '../../recoil/zoom';
import markersAtom from '../../recoil/markers';
import selectedSpotAtom, { withCenter } from '../../recoil/selectedSpot';
import { getRecoil } from 'recoil-nexus';
import authAtom from '../../recoil/auth';
import api from '../../utils/axiosInstance';
import MapPanel from './MapPanel';
import MapMarker from './MapMarker';


export default function Map() {
  const naverMaps = useNavermaps();
  const mapRef = useRef(null);

  const [markers, setMarkers] = useRecoilState(markersAtom);
  const [center, setCenter] = useRecoilState(centerAtom);
  const [zoom, setZoom] = useRecoilState(zoomAtom);
  const [selectedSpot, setSelectedSpot] = useRecoilState(selectedSpotAtom);
  const setSelectedSpotWithCenter = useSetRecoilState(withCenter);


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
    // const url = new URL('/spots/search');
    // url.searchParams.append('lat', center.lat);
    // url.searchParams.append('lng', center.lng);
    // url.searchParams.append('zoom', zoom);

    const token = getRecoil(authAtom).accessToken;
    try {
      const response = await api.get('/spots', {
        params: {
          lat: Number(center.lat),
          lng: Number(center.lng),
          zoom: Number(zoom),
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
        validateStatus: () => true,
      });

      const data = await response.data;
      console.log(data);

      setMarkers(
        data.map(place => ({
          id: place.spotId,
          position: new naverMaps.LatLng(
            place.location.lat,
            place.location.lng,
          ),
          name: place.name,
          address: place.address,
          imgUrls: place.imgUrls,
          businessHours: place.businessHours,
          isOpen: place.isOpen,
          isScraped: place.isScraped,
          category: place.categories,
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
  
  //이동할 때 handleSearch 불러오지 않도록 idle 사용
  useEffect(() => {
    if (!mapRef.current) return;

    const listener = naver.maps.Event.addListener(
      mapRef.current,
      'idle',
      handleSearch
    );

    return () => naver.maps.Event.removeListener(listener);
  }, [handleSearch]);

  return (
    <div className='w-full'>
      <MapDiv style={{ width: '100%', height: 'calc(100vh - 80px)'}}>
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
          // zoomControl={true}
          // zoomControlOptions={{
          //   position: naverMaps.Position.TOP_LEFT,
          //   style: naverMaps.ZoomControlStyle.SMALL,
          // }}
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
          <MapMarker markers={markers} handleMarkerClick={handleMarkerClick}/>
          {/* <MarkerCluster /> */}
        </NaverMap>
      </MapDiv>
    </div>
  )
}