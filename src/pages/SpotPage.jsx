import { useState } from 'react';
import SpotList from '../components/SpotList';
import SpotDetail from '../components/SpotDetail';
import { useRecoilValue } from 'recoil';
import { spotsAtom } from '../atoms/SpotsAtom';

function SpotPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpot, setSelectedSpot] = useState(null);
  const spots = useRecoilValue(spotsAtom);

  const handleSearch = e => setSearchTerm(e.target.value);
  const handleSelectSpot = spot => setSelectedSpot(spot);

  return (
    <div className="flex fixed w-1/2 z-10">
      <SpotList
        spots={spots}
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onSelectSpot={handleSelectSpot}
      />
      {selectedSpot && (
        <SpotDetail
          selectedSpot={selectedSpot}
          setSelectedSpot={setSelectedSpot}
        />
      )}
    </div>
  );
}

export default SpotPage;
