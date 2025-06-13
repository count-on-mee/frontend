import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { withCenter } from '../../recoil/selectedSpot';
import categories_map from '../../utils/categoriesMap';
import { createCategorySVGMarker } from '../../utils/svgMaker';

export default function MapMarkerSpot({ map, markers }) {
  const setSelectedSpotWithCenter = useSetRecoilState(withCenter);

  const handleMarkerClick = (marker) => {
    setSelectedSpotWithCenter(marker);
    setTimeout(() => {
      if (map) {
        map.setCenter(marker.postion);
      }
    }, 300);
    // navigate('/spot');
  };

  const categoryColorMap = {
    숙소: '#673AB7', //짙은보라
    카페: '#795548', //브라운
    '복합 문화 공간': '#FF9800', //주황
    박물관: '#00BCD4', //청록록
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
    });
  }, [markers]);
}
