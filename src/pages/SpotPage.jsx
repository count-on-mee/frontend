import { useState, useMemo } from 'react';
import SpotList from '../components/SpotList';
import SpotDetail from '../components/SpotDetail';

function SpotPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpot, setSelectedSpot] = useState(null);
  const spots = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Spot ${i + 1}`,
        type: `Type ${i + 1}`,
        description: `Description ${i + 1}`,
      })),
    [],
  );

  const handleSearch = e => setSearchTerm(e.target.value);
  const handleSelectSpot = spot => setSelectedSpot(spot);

  return (
    <div>
      <div className="flex fixed w-1/2 z-10">
        <SpotList
          spots={spots}
          searchTerm={searchTerm}
          onSearch={handleSearch}
          onSelectSpot={handleSelectSpot}
        />
        {selectedSpot && <SpotDetail selectedSpot={selectedSpot} />}
      </div>
    </div>
  );
}

export default SpotPage;
