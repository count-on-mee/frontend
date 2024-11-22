import { useState } from 'react';
import CurationList from '../components/CurationList';
import CurationDetail from '../components/CurationDetail';
import curationData from '../dummydata/curation.json'

function CurationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuration, setSelectedCuration] = useState(null);
  const curations = curationData
  const handleSearch = e => setSearchTerm(e.target.value);
  const handleSelectCuration = curation => setSelectedCuration(curation);

  return (
    <div>
      <div className="flex fixed w-full h-svh z-10 pb-[86px] overflow-y-auto">
        <CurationList
          curations={curations}
          searchTerm={searchTerm}
          onSearch={handleSearch}
          onSelectCuration={handleSelectCuration}
          selectedCuration={selectedCuration}
          className="w-1/2"
        />
      {selectedCuration && (
        <CurationDetail
          selectedCuration={selectedCuration}
          setSelectedCuration={setSelectedCuration}
          setSearchTerm={setSearchTerm}
          className="w-1/2"
        />
      )}
    </div>
    </div>
    
  );
}

export default CurationPage;
