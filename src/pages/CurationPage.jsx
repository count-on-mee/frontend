import { useState } from 'react';
import { useRecoilState } from 'recoil';
import CurationList from '../components/CurationList';
import CurationDetail from '../components/CurationDetail';
import curationData from '../dummydata/curation.json';
import selectedCurationAtom from '../recoil/selectedCuration';

function CurationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuration, setSelectedCuration] =
    useRecoilState(selectedCurationAtom);
  const curations = curationData;
  const handleSearch = e => setSearchTerm(e.target.value);
  const handleSelectCuration = curation => setSelectedCuration(curation);

  return (
    <div>
      <div className="flex fixed w-1/2 h-svh z-10 pb-[86px] overflow-y-auto">
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
