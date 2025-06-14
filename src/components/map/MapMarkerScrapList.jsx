import { useEffect, useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { withCenter } from '../../recoil/selectedSpots';
import categories_map from '../../utils/categoriesMap';
import { createCategorySVGMarker } from '../../utils/svgMaker';

export default function MapMarkerScrapList({ map, markers }) {
  const setSelectedSpotsWithCenter = useSetRecoilState(withCenter);
  // const markerRef = useRef([]);

  const handleMarkerClick = (marker) => {
    setSelectedSpotsWithCenter(marker);
    setTimeout(() => {
      if (map) {
        map.setCenter(marker.postion);
      }
    }, 300);
  };

  const categoryColorMap = {
    숙소: '#673AB7', //짙은보라
    카페: '#795548', //브라운
    '복합 문화 공간': '#FF9800', //주황
    박물관: '#00BCD4', //청록
    미술관: '#E91E63', //핫핑크
    도서관: '#8BC34A', //연두
    역사: '#9C27B0', //남색
    종교: '#607D8B', //회청색
    관광지: '#3F51B5', //남색
    자연: '#4CAF50', //초록
    식당: '#FF6B6B', //다홍색
  };

  const iconMap = {};
  Object.values(categories_map).forEach(({ key, icon }) => {
    iconMap[key] = icon;
  });

  const isLatLngObject = (pos) =>
    typeof pos.lat === 'function' && typeof pos.lng === 'function';

  const getLat = (pos) => (isLatLngObject(pos) ? pos.lat() : pos.lat);
  const getLng = (pos) => (isLatLngObject(pos) ? pos.lng() : pos.lng);

  useEffect(() => {
    if (!window.naver || !map || !markers) return;

    // markerRef.current.forEach((m) => m.setMap(null));
    // markerRef.current = [];

    // const newMarkerList = [];

    markers.forEach((markerData) => {
      const lat = getLat(markerData.position);
      const lng = getLng(markerData.position);
      const categoryKey = markerData.categories[0];
      const icon = iconMap[categoryKey];
      const iconURL = createCategorySVGMarker(
        icon,
        categoryColorMap[categoryKey] || '#999',
      );
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lng),
        map: map,
        icon: {
          url: iconURL,
          size: new naver.maps.Size(35, 35),
          anchor: new naver.maps.Point(12, 12),
        },
      });

      naver.maps.Event.addListener(marker, 'click', () => {
        handleMarkerClick(markerData);
        setTimeout(() => {
          map.setCenter(marker.position);
        }, 200);
      });
      // newMarkerList.push(marker);
    });
    // markerRef.current = newMarkerList;

    const bounds = new naver.maps.LatLngBounds();
      markers.forEach(marker => {
        bounds.extend(new naver.maps.LatLng(marker.position.lat, marker.position.lng));
      });
    map.fitBounds(bounds);

    // const latLngArray = markers.map((markerData) => {
    //   const lat = getLat(markerData.position);
    //   const lng = getLng(markerData.position);
    //   return new naver.maps.LatLng(lat, lng);
    // });

    // const bounds = new naver.maps.LatLngBounds(latLngArray[0], latLngArray[0]);
    // latLngArray.forEach((latLng) => bounds.extend(latLng));

    // map.fitBounds(bounds);
  }, [markers]);
}
