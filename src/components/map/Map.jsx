import { useEffect, useCallback, useState, act } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import centerAtom from '../../recoil/center';
import zoomAtom from '../../recoil/zoom';
import userAtom from '../../recoil/user';
import { withCenter } from '../../recoil/selectedSpot';
import MapPanel from './MapPanel';
import MapMarkerSpot from './MapMarkerSpot';
import MapMarkerCuration from './MapMarkerCuration';
import MapMarkerItinerary from './MapMarkerItinerary';
import MapMarkerScrapList from './MapMarkerScrapList';
import MapResearch from './MapResearch';
import useSearchSpots from '../../hooks/useSearchSpots';
import FilterPanel from './FilterPanel';

export default function Map({
  mapRef,
  markerType,
  markers,
  filteredMarkers,
  activeCategories,
  setActiveCategories,
  showAllDays,
}) {
  const { naver } = window;
  const [center, setCenter] = useRecoilState(centerAtom);
  const [zoom, setZoom] = useRecoilState(zoomAtom);
  const setSelectedSpotWithCenter = useSetRecoilState(withCenter);
  const handleSearch = useSearchSpots();
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    const mapOptions = {
      center: new window.naver.maps.LatLng(center.lat, center.lng),
      logoControl: false,
      mapDataControl: false,
      zoomControl: false,
      draggable: true,
      pinchZoom: true,
      scrollWheel: true,
      disableDoubleClickZoom: false,
      minzoom: 7,
      maxzoom: 21,
      scaleControl: true,
    };

    mapRef.current = new naver.maps.Map('map', mapOptions);
    handleLocateMe();
    if (mapRef.current && user) {
      handleSearch(center, zoom);
    }
  }, [user]);

  const handleZoomIn = useCallback(() => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.setZoom(currentZoom + 1);
    }
  }, [mapRef]);

  const handleZoomOut = useCallback(() => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.setZoom(currentZoom - 1);
    }
  }, [mapRef]);

  const handleZoomChanged = useCallback(
    (newZoom) => {
      setZoom(newZoom);
    },
    [setZoom],
  );

  const handleCenterChanged = () => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter();
      if (newCenter) {
        setCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
      }
    }
  };

  const handleLocateMe = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error(error);
          alert('현재 위치를 가져올 수 없습니다.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    }
  }, []);

  //eventlinster-zoom_changed, center_changed
  useEffect(() => {
    if (!mapRef.current) return;

    const zoomListener = naver.maps.Event.addListener(
      mapRef.current,
      'zoom_changed',
      handleZoomChanged,
    );
    const centerListener = naver.maps.Event.addListener(
      mapRef.current,
      'center_changed',
      handleCenterChanged,
    );

    return () => {
      naver.maps.Event.removeListener(zoomListener);
      naver.maps.Event.removeListener(centerListener);
    };
  }, [center, zoom]);

  const handleFilter = (category) => {
    setActiveCategories((prev) => {
      if (prev.includes(category)) {
        // 이미 포함 → 제거
        return prev.filter((c) => c !== category);
      } else {
        // 미포함 → 추가
        return [...prev, category];
      }
    });
  };

  const renderMarkerComponent = () => {
    if (markerType === 'spot')
      return (
        <div className="w-full">
          <MapPanel
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onLocateMe={handleLocateMe}
            onSearch={handleSearch}
          />
          <MapMarkerSpot markers={filteredMarkers} map={mapRef.current} />
          <FilterPanel
            onFilter={handleFilter}
            activeCategories={activeCategories}
          />
          <FilterPanel
            onFilter={handleFilter}
            activeCategories={activeCategories}
          />
          <MapResearch
            handleSearch={handleSearch}
            center={center}
            zoom={zoom}
          />
        </div>
      );
    if (markerType === 'curation')
      return (
        <div className="w-full">
          <MapResearch handleSearch={handleSearch} />
          <MapPanel
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onLocateMe={handleLocateMe}
            onSearch={handleSearch}
          />
          <MapMarkerCuration markers={markers} map={mapRef.current} />
        </div>
      );
    if (markerType === 'scrapList')
      return <MapMarkerScrapList markers={markers} map={mapRef.current} />;
    if (markerType === 'itinerary')
      return (
        <MapMarkerItinerary
          markers={markers}
          map={mapRef.current}
          showAllDays={showAllDays}
        />
      );
  };

  return (
    <div className="w-full h-full relative">
      <div id="map" className="absolute inset-0 w-full h-full">
        {mapRef.current && renderMarkerComponent()}
        {/* <MarkerCluster /> */}
      </div>
    </div>
  );
}
