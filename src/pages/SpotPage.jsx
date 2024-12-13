import { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useOutletContext, Link } from 'react-router-dom';
import SpotList from '../components/SpotList';
import SpotDetail from '../components/SpotDetail';
import markersAtom from '../recoil/markers';
import selectedSpotAtom from '../recoil/selectedSpot';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import Searchbar from '../components/Searchbar';

function SpotPage() {
  const { handleSearch } = useOutletContext();
  const [searchTerm] = useState('');
  const markers = useRecoilValue(markersAtom);
  const [selectedSpot, setSelectedSpot] = useRecoilState(selectedSpotAtom);

  useEffect(() => {
    if (markers.length === 0) {
      handleSearch();
    }
  }, [markers, handleSearch]);

  return (
    <div>
      <div
        className={`flex fixed ${selectedSpot ? 'w-1/2' : 'w-1/4'} z-10 bg-[#FFFCF2]`}
      >
        <div className="flex flex-col w-full border-r-2 border-[#403D39]">
          <div className="flex justify-between items-center border-b border-[#403D39]">
            <Link to="/map" className="flex-shrink-0">
              <ChevronLeftIcon className="w-10 h-6" />
            </Link>
            <Searchbar searchTerm={searchTerm} onSearch={handleSearch} />
          </div>
          <SpotList />
        </div>
        {selectedSpot && (
          <SpotDetail
            selectedSpot={selectedSpot}
            setSelectedSpot={setSelectedSpot}
          />
        )}
      </div>
    </div>
  );
}

export default SpotPage;
