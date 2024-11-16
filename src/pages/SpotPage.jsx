import { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useOutletContext } from 'react-router-dom';
import SpotList from '../components/SpotList';
import SpotDetail from '../components/SpotDetail';
import markersAtom from '../recoil/markers';
import selectedSpotAtom from '../recoil/selectedSpot';

function SpotPage() {
  const { handleSearch } = useOutletContext();
  const [searchTerm] = useState('');
  const markers = useRecoilValue(markersAtom);
  const [ selectedSpot, setSelectedSpot ]= useRecoilState(selectedSpotAtom);

  useEffect(() => {
    if (markers.length === 0) {
      handleSearch();
    }
  }, [markers, handleSearch]);

  return (
    <div>
      <div className={`flex fixed ${selectedSpot ? 'w-1/2' : 'w-1/4'} z-10`}>
        <SpotList
          spots={markers}
          searchTerm={searchTerm}
          onSearch={handleSearch}
        />
        {selectedSpot && (
        <SpotDetail selectedSpot={selectedSpot} setSelectedSpot={setSelectedSpot}/>
      )}
      </div>
    </div>
  );
}

export default SpotPage;
