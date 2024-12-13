import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import CurationList from '../components/CurationList';
import CurationDetail from '../components/CurationDetail';
import selectedCurationAtom from '../recoil/selectedCuration';
import curationsAtom from '../recoil/curations';
import Cookies from 'js-cookie';

function CurationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuration, setSelectedCuration] =
    useRecoilState(selectedCurationAtom);
  const [curations, setCurations] = useRecoilState(curationsAtom);
  const handleSearch = e => setSearchTerm(e.target.value);
  const handleSelectCuration = curation => setSelectedCuration(curation);

  useEffect(() => {
    if (curations.length === 0) {
      const token = Cookies.get('accessToken');
      fetch('http://localhost:8888/curations', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setCurations(data));
    }
  }, []);

  return (
    <div>
      <div className="flex fixed w-1/2 h-svh z-10 pb-[86px]">
        <CurationList
          curations={curations}
          searchTerm={searchTerm}
          onSearch={handleSearch}
          onSelectCuration={handleSelectCuration}
          selectedCuration={selectedCuration}
        />
        {selectedCuration && (
          <CurationDetail
            selectedCuration={selectedCuration}
            setSelectedCuration={setSelectedCuration}
            setSearchTerm={setSearchTerm}
          />
        )}
      </div>
    </div>
  );
}

export default CurationPage;
