import { useEffect, useCallback, useState, act } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import centerAtom from '../../recoil/center';
import zoomAtom from '../../recoil/zoom';
import { withCenter } from '../../recoil/selectedSpot';
import MapPanel from './MapPanel';
import MapMarkerSpot from './MapMarkerSpot';
import MapMarkerCuration from './MapMarkerCuration';
import MapMarkerItinerary from './MapMarkerItinerary';
import MapMarkerScrapList from './MapMarkerScrapList';
import MapResearch from './MapResearch';
import useSearchSpots from '../../hooks/useSearchSpots';
import FilterPanel from './FilterPanel';

export default function Map({ mapRef, markerType, markers, filteredMarkers, activeCategories, setActiveCategories, showAllDays }) {
  const { naver } = window;
  const [center, setCenter] = useRecoilState(centerAtom);
  const setZoom = useSetRecoilState(zoomAtom);
  const setSelectedSpotWithCenter = useSetRecoilState(withCenter);
  const handleSearch = useSearchSpots();
  // console.log(markers);

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
    // console.log(filteredMarkers);
  }, []);

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
       if (newCenter && typeof newCenter.lat === 'function' && typeof newCenter.lng === 'function') {
        setCenter({ lat: newCenter.lat(), lng: newCenter.lng() });}
      // setCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
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
  }, [setCenter]);

  // const handleMarkerClick = (marker) => {
  //   setSelectedSpotWithCenter(marker);
  //   // navigate('/spot');
  // };

  // 이동할 때 handleSearch 불러오지 않도록 idle 사용
  useEffect(() => {
    if (!mapRef.current) return;
    if (markerType !== 'spot') return;

    const listener = window.naver.maps.Event.addListener(
      mapRef.current,
      'idle',
      handleSearch,
    );

    return () => window.naver.maps.Event.removeListener(listener);
  }, [handleSearch]);

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
    // const clickListener = naver.maps.Event.addListener(markers, 'click', handleMarkerClick);

    return () => {
      naver.maps.Event.removeListener(zoomListener);
      naver.maps.Event.removeListener(centerListener);
      // naver.maps.Evnet.removeListener(clickListener);
    };
  }, []);

  const handleFilter = (category) => {
    // console.log("Clicked category:", category);
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
          <MapMarkerSpot
            markers={filteredMarkers}
            // markers={markers}
            map={mapRef.current}
            // position={position}
          />
          <FilterPanel onFilter={handleFilter} activeCategories={activeCategories}/>
          <MapResearch />
        </div>
      );
    if (markerType === 'curation')
      return (
        <div className="w-full">
          <MapResearch onSearch={handleSearch} />
          <MapPanel
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onLocateMe={handleLocateMe}
            onSearch={handleSearch}
          />
          <MapMarkerCuration
          markers={markers}
          map={mapRef.current}
          // position={position}
          />
        </div>
      );
    if (markerType === 'scrapList')
      return (
        <MapMarkerScrapList markers={markers} map={mapRef.current}/>
      );
    if (markerType === 'itinerary') 
      return(
        <MapMarkerItinerary
          markers={markers}
          map={mapRef.current}
          showAllDays={showAllDays}
    />);
  };

  return (
    <div className="w-full">
      <div id="map" className="relative" style={{ width: '100%', height: 'calc(100vh - 80px)' }}>
        {mapRef.current && renderMarkerComponent()}
        {/* <MarkerCluster /> */}
      </div>
    </div>
  );
}
