import { Marker } from 'react-naver-maps';

export default function MapMarker({ markers, handleMarkerClick }) {
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
// };
    
    return (
      <>
      {markers.map(marker => (
        <Marker
          key={marker.id}
          position={marker.position}
          title={marker.title}
          category={marker.category}
        //   icon={{
        //     content: getIconContent(marker.category), 
        //   }}
          onClick={() => handleMarkerClick(marker)}
        />
      ))}
    </>
  );
}