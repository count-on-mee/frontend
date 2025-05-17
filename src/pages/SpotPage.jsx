import SpotDetail from "../components/spot/SpotDetail";
import SpotList from "../components/spot/SpotList";
import Map from '../components/map/Map';

export default function SpotPage() {
  return (
    <div className="w-full flex h-[calc(100vh-80px)]">
      {/* SpotList */}
      <div className="w-1/4 overflow-y-auto h-full">
        <SpotList />
      </div>
      {/* SpotDetail */}
      <div className="w-1/4 overflow-y-auto h-full">
        <SpotDetail />
      </div>
      {/* MapLayout */}
      <div className="w-1/2">
        <Map />
      </div>
    </div>
  );
}
