import { Outlet } from 'react-router-dom';
import {
  Container as MapDiv,
  NaverMap,
  Marker,
  useNavermaps,
} from 'react-naver-maps';
import Header from '../components/Header';

export default function MapLayout() {
  const navermaps = useNavermaps();
  return (
    <div>
      <Header />
      <Outlet /> {/* 자식 컴포넌트가 렌더링될 위치 */}
      {/* 변경되지 않을 컴포넌트 */}
      <div className="w-full h-svh">
        <MapDiv
          className="overflow-hidden"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <NaverMap
            defaultCenter={new navermaps.LatLng(37.3595704, 127.105399)}
            defaultZoom={15}
          >
            <Marker
              defaultPosition={new navermaps.LatLng(37.3595704, 127.105399)}
            />
          </NaverMap>{' '}
        </MapDiv>
      </div>
    </div>
  );
}