import { Marker } from 'react-naver-maps';

export default function MapMarker({ markers, handleMarkerClick }) {
  const svgIconHtml = `<svg xmlns="http://www.w3.org/2000/svg" 
  // width="200" height="200" viewBox="0 0 512 512">
  <g transform="scale(0.1)">
    <path d="M368 32H144a16 16 0 00-16 16v16a8 8 0 008 8h240a8 8 0 008-8V48a16 16 0 00-16-16zm61.59 116.79l-7.16-.79c-21.67-2.39-32.37-6.57-32.37-18.72v-20a8 8 0 00-6.59-7.84c-33.68-6-94.29-7.45-121.27-7.45h-.36c-27 0-87.62 1.43-121.3 7.45a8 8 0 00-6.59 7.84v20c0 12.15-10.7 16.33-32.36 18.72l-7.17.79A24 24 0 0032 172.39V184a8 8 0 008 8h432a8 8 0 008-8v-11.61a24 24 0 00-20.41-23.6zM464 216H48a16 16 0 00-16 16v16a8 8 0 008 8h432a8 8 0 008-8v-16a16 16 0 00-16-16zm-16 240H64c-23.2 0-32.59-5.78-36.68-10.18a8.77 8.77 0 00-6.8-2.82A8 8 0 0012 455.9c2.2 15.31 7.75 29.58 21.65 40.34C46.51 507.2 70.31 512 104 512h304c33.69 0 57.5-4.8 70.35-15.76 13.9-10.76 19.45-25 21.65-40.34a8 8 0 00-7.51-8.06 8.77 8.77 0 00-6.8 2.82c-4.09 4.4-13.48 10.18-36.69 10.18zM32 312v88a24 24 0 0024 24h400a24 24 0 0024-24v-88a24 24 0 00-24-24H56a24 24 0 00-24 24zm432-56H48a16 16 0 00-16 16v16a8 8 0 008 8h432a8 8 0 008-8v-16a16 16 0 00-16-16z" />
  </g>
</svg>
`;
    return (
    <>
      {markers.map(marker => (
        <Marker
          key={marker.id}
          position={marker.position}
          title={marker.title}
          icon={{
            content: svgIconHtml, // 아이콘 내용 (SVG 코드 등)
            size: new naver.maps.Size(22, 35),
            origin: new naver.maps.Point(0, 0),
            anchor: new naver.maps.Point(11, 35) // 아이콘 앵커 포지션 설정
          }}
          onClick={() => handleMarkerClick(marker)}
        />
      ))}
    </>
  );
}
