import { useEffect, useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { withCenter } from '../../recoil/itinerarySpot';
import numbersIcon from '../../utils/numbersMap';
import { createCategorySVGMarker } from '../../utils/svgMaker';

export default function MapMarkerItinerary({ map, markers }) {
  const markersRef = useRef([]);
  const currentPolylineRef = useRef(null);
  // console.log("markers", markers);
  const setItinerarySpotWithCenter = useSetRecoilState(withCenter);

  const handleMarkerClick = (marker) => {
    setItinerarySpotWithCenter(marker);
    setTimeout(() => {
      if (map) {
        map.setCenter(marker.postion);
        // console.log(marker.position);
      }
    }, 300);
  
  };

  const isLatLngObject = (pos) =>
    typeof pos.lat === 'function' && typeof pos.lng === 'function';

  const getLat = (pos) => (isLatLngObject(pos) ? pos.lat() : pos.lat);
  const getLng = (pos) => (isLatLngObject(pos) ? pos.lng() : pos.lng);

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
      const icon = numbersIcon[index];
      const iconURL = createCategorySVGMarker(icon, '#eb5e28');
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lng),
        icon: {
          url: iconURL,
          size: new naver.maps.Size(35, 35),
          anchor: new naver.maps.Point(12, 12),
        },
        map: map,
      });
      // console.log("지도내 마커:", marker.position);

      naver.maps.Event.addListener(marker, 'click', () => {
        handleMarkerClick(markerData);
        setTimeout(() => {
          map.setCenter(marker.position);
        }, 200);
      return marker;
      });
    });
    markersRef.current = newMarkers;

    // oldMarkers.forEach(marker => {
    //   if(marker && typeof marker.setMap === 'function') {
    //     console.log("지워지냐?");
    //     marker.setMap(null);
    //   }
    // })

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
      
      const newPolyline = new naver.maps.Polyline({
        path: latLngArray,
        strokeColor: '#000',
        strokeWeight: 4,
        strokeOpacity: 0.8,
        strokeStyle: 'solid',
        map: map
      });
      currentPolylineRef.current = newPolyline;
  }, [markers]);
}
