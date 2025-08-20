import { useEffect, useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { withCenter } from '../../recoil/itinerarySpot';
import numbersIcon from '../../utils/numbersMap';
import { createCategorySVGMarker } from '../../utils/svgMaker';

export default function MapMarkerItinerary({ map, markers, showAllDays }) {
  const markersRef = useRef([]);
  const currentPolylineRef = useRef(null);
  const setItinerarySpotWithCenter = useSetRecoilState(withCenter);

  const handleMarkerClick = (marker) => {
    setItinerarySpotWithCenter(marker);
    setTimeout(() => {
      if (map) {
        map.setCenter(marker.postion);
      }
    }, 300);
  
  };
  
  const getDayColor = (day) =>{
  const colors = [
  '#FF5C5C', '#FFA500', '#3399FF','#33CC33', '#AA00FF', '#FFC107', '#00BCD4', '#FF69B4', '#8BC34A', '#FF5722', 
];
  return colors[(day - 1) % colors.length];
  }

  const isLatLngObject = (pos) =>
    typeof pos.lat === 'function' && typeof pos.lng === 'function';

  const getLat = (pos) => (isLatLngObject(pos) ? pos.lat() : pos.lat);
  const getLng = (pos) => (isLatLngObject(pos) ? pos.lng() : pos.lng);

  useEffect(() => {
  if (!window.naver || !map || !markers) {
    console.log('초기화 조건 때문에 useEffect return됨');
    return;
  }});

  useEffect(() => {
    if (!window.naver || !map || !markers) return;

    const clearAllMarkers = () => {
      const oldMarkers = markersRef.current;
    if (oldMarkers && Array.isArray(oldMarkers)) {
      oldMarkers.forEach(marker => {
        if (marker && typeof marker.setMap === 'function') {
          marker.setMap(null);

        }
      });
    }
    
      markersRef.current = [];
    };

    clearAllMarkers();

    const newMarkers = markers.map((markerData, index) => {
      const lat = getLat(markerData.position);
      const lng = getLng(markerData.position);

      const day = markerData.day;
      const dayColor = getDayColor(day);
      const dayMarkersCount = markers.filter(m => m.day === day).findIndex(m => m === markerData);

      const iconIndex = showAllDays ? dayMarkersCount : index;
      const icon = numbersIcon[iconIndex];
      const iconURL = createCategorySVGMarker(icon, dayColor);
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lng),
        icon: {
          url: iconURL,
          size: new naver.maps.Size(35, 35),
          anchor: new naver.maps.Point(12, 12),
        },
        map: map,
      });

      naver.maps.Event.addListener(marker, 'click', () => {
        handleMarkerClick(markerData);
        setTimeout(() => {
          map.setCenter(marker.position);
        }, 200);
      });
      return marker;
    });
    markersRef.current = newMarkers;

    const latLngArray = markers.map((markerData) => {
      const lat = getLat(markerData.position);
      const lng = getLng(markerData.position);
      return new naver.maps.LatLng(lat, lng);
    });

    const bounds = new naver.maps.LatLngBounds(latLngArray[0], latLngArray[0]);
    latLngArray.forEach((latLng) => bounds.extend(latLng));

    map.fitBounds(bounds);

    if (currentPolylineRef.current) {
      currentPolylineRef.current.setMap(null);
      }

    if(!showAllDays) {
      const newPolyline = new naver.maps.Polyline({
        path: latLngArray,
        strokeColor: '#000',
        strokeWeight: 2,
        strokeOpacity: 0.8,
        strokeStyle: 'solid',
        map: map
      });
      currentPolylineRef.current = newPolyline;
      } else {
        const groupedByDay = markers.reduce((acc, marker) => {
          if(!acc[marker.day]) acc[marker.day] = [];
          acc[marker.day].push(
            new naver.maps.LatLng(
              getLat(marker.position), getLng(marker.position)
            )
          );
          return acc;
        }, {});

      Object.entries(groupedByDay).forEach(([day, dayLatLngs]) => {
        new naver.maps.Polyline({
          path: dayLatLngs,
          strokeColor: getDayColor(day),
          strokeWeight: 2,
          map,
        });
      });  
    }
  }, [markers, showAllDays]);
}
