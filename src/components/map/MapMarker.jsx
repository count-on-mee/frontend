import { Marker } from 'react-naver-maps';

export default function MapMarker({ markers, handleMarkerClick }) {
  const svgFood = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  width="20"
  height="20"
  transform="translate(-8, -11)"
>
  <circle cx="12" cy="12" r="12" fill="orange" />
  <path
    d="M9.5 4C8.67 4 8 4.67 8 5.5V9.5C8 10.33 8.67 11 9.5 11C10.33 11 11 10.33 11 9.5V5.5C11 4.67 10.33 4 9.5 4ZM9.5 12C8.67 12 8 12.67 8 13.5V16H11V13.5C11 12.67 10.33 12 9.5 12Z"
    fill="white"
  />
  <path
    d="M14 4H15V11H14V4ZM13 4H14V11H13V4ZM12 4H13V11H12V4ZM14 12H12V16H15V12H14Z"
    fill="white"
  />
</svg>`;
const svgHouse = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  width="20"
  height="20"
  transform="translate(-8, -11)"
>
  <circle cx="12" cy="12" r="12" fill="green" />
  <path
    d="M12 3L4 10H7V20H17V10H20L12 3Z"
    fill="white"
  />
</svg>`;

const getIconContent = (category) => {
  console.log("category",category);
  switch (category) {
    case "식당":
      return svgFood;
    case "숙소":
      return svgHouse;
    default:
      return svgHouse;
  }
};
    
    return (
      <>
      {markers.map(marker => (
        <Marker
          key={marker.id}
          position={marker.position}
          title={marker.title}
          category={marker.category}
          icon={{
            content: getIconContent(marker.category), 
          }}
          onClick={() => handleMarkerClick(marker)}
        />
      ))}
    </>
  );
}
