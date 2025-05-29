import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { withCenter } from '../../recoil/selectedSpot';

export default function MapMarker({ map, markers }) {
  const setSelectedSpotWithCenter = useSetRecoilState(withCenter);

  const handleMarkerClick = (marker) => {
    setSelectedSpotWithCenter(marker);
    // setTimeout(() => {
    //   if (map) {
    //     map.setCenter(marker.postion);
    //   }
    // }, 300);
    // navigate('/spot');
  };
  //   const svgFood = `
  // <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   viewBox="0 0 24 24"
  //   width="20"
  //   height="20"
  //   transform="translate(-8, -11)"
  // >
  //   <circle cx="12" cy="12" r="12" fill="orange" />
  //   <rect x="12" y="2" width="2" height="10" fill="white" transform="rotate(30, 9, 10)"/>
  //   <rect x="6" y="12" width="8" height="8" rx="5" fill="white"/>
  //   </svg>`;
  // const svgHouse = `
  // <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   viewBox="0 0 24 24"
  //   width="20"
  //   height="20"
  //   transform="translate(-8, -11)"
  // >
  //   <circle cx="12" cy="12" r="12" fill="green" />
  //   <path
  //     d="M12 3L4 10H7V20H17V10H20L12 3Z"
  //     fill="white"
  //   />
  // </svg>`;

  // const getIconContent = (category) => {
  //   const categoryString = category[0];
  //   switch (categoryString) {
  //     case "식당":
  //       return svgFood;
  //     case "숙소":
  //       return svgHouse;
  //     default:
  //       return svgHouse;
  //   }
  // }

  useEffect(() => {
    if (!window.naver || !map || !markers) return;

    markers.forEach((markerData) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(
          markerData.position.lat(),
          markerData.position.lng(),
        ),
        map: map,
        // icon: { ... },
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
