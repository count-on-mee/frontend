import { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useOutletContext, useNavigate } from 'react-router-dom';
import SpotList from '../components/SpotList';
import SpotDetail from '../components/SpotDetail';
import markersAtom from '../recoil/markers';
import selectedSpotAtom from '../recoil/selectedSpot';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

function SpotPage() {
  const { handleSearch } = useOutletContext();
  const [searchTerm] = useState('');
  const markers = useRecoilValue(markersAtom);
  const [selectedSpot, setSelectedSpot] = useRecoilState(selectedSpotAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (markers.length === 0) {
      handleSearch();
    }
  }, [markers, handleSearch]);
  }, [markers, handleSearch]);

  return (
    <div>
      <div className={`flex fixed ${selectedSpot ? 'w-1/2' : 'w-1/4'} z-10`}>
        <button
          onClick={() => { navigate('/map'); }}
          className='fixed'
        >
          <ChevronLeftIcon 
            className='absolute w-6 h-6 top-6 left-2'
          />
        </button>
        <SpotList
          spots={markers}
          searchTerm={searchTerm}
          onSearch={handleSearch}
        />
        {selectedSpot && (
        <SpotDetail selectedSpot={selectedSpot} setSelectedSpot={setSelectedSpot}/>
        )}
      </div>
        <SpotDetail selectedSpot={selectedSpot} setSelectedSpot={setSelectedSpot}/>
      )}
      </div>
    </div>
  );
}

export default SpotPage;