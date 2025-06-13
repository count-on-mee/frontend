import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { withCenter } from '../../recoil/selectedCurationSpot';
import numbersIcon from '../../utils/numbersMap';
import { createCategorySVGMarker } from '../../utils/svgMaker';

export default function MapMarkerCuration({ map, markers }) {
  const setSelectedCurationSpotWithCenter = useSetRecoilState(withCenter);

  const handleMarkerClick = (marker) => {
    setSelectedCurationSpotWithCenter(marker);
    setTimeout(() => {
      if (map) {
        map.setCenter(marker.postion);
      }
    }, 300);
    // navigate('/spot');
  };

  const isLatLngObject = (pos) =>
    typeof pos.lat === 'function' && typeof pos.lng === 'function';

  const getLat = (pos) => (isLatLngObject(pos) ? pos.lat() : pos.lat);
  const getLng = (pos) => (isLatLngObject(pos) ? pos.lng() : pos.lng);

  useEffect(() => {
    if (!window.naver || !map || !markers) return;

    markers.forEach((markerData, index) => {
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

      naver.maps.Event.addListener(marker, 'click', () => {
        handleMarkerClick(markerData);
        setTimeout(() => {
          map.setCenter(marker.position);
        }, 200);
      });
    });

    const latLngArray = markers.map((markerData) => {
      const lat = getLat(markerData.position);
      const lng = getLng(markerData.position);
      return new naver.maps.LatLng(lat, lng);
    });

    const bounds = new naver.maps.LatLngBounds(latLngArray[0], latLngArray[0]);
    latLngArray.forEach((latLng) => bounds.extend(latLng));

    map.fitBounds(bounds);
  }, [markers]);
}
