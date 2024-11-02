import {
  Container as MapDiv,
  NaverMap,
  Marker,
  useNavermaps,
} from 'react-naver-maps';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MainPage() {
  const navermaps = useNavermaps();

  return (
    <>
      <Header />
      <MapDiv
        style={{
          width: '100%',
          height: '600px',
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
      <Footer />
    </>
  );
}
