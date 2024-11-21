import { useState } from 'react';
import CurationList from '../components/CurationList';
import CurationDetail from '../components/CurationDetail';
import { useRecoilValue } from 'recoil';
import curationsAtom from '../recoil/curation';

function CurationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuration, setSelectedCuration] = useState(null);
  const curations = useRecoilValue(curationsAtom);

  const handleSearch = e => setSearchTerm(e.target.value);
  const handleSelectCuration = curation => setSelectedCuration(curation);

  return (
    <div className="flex fixed w-1/2 h-full z-10 overflow-y-auto">
      {!selectedCuration && (
        <CurationList
          curations={curations}
          searchTerm={searchTerm}
          onSearch={handleSearch}
          onSelectCuration={handleSelectCuration}
          selectedCuration={selectedCuration}
        />
      )}
      {selectedCuration && (
        <CurationDetail
          className="w-1/2"
          selectedCuration={selectedCuration}
          setSelectedCuration={setSelectedCuration}
          setSearchTerm={setSearchTerm}
        />
      )}
    </div>
  );
}

export default CurationPage;
