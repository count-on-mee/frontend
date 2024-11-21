import { useMemo } from 'react';
import Searchbar from './Searchbar';
import Curation from './Curation';
import dCuration from '../dummydata/curation.json';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import scrappedCurationsAtom from '../recoil/scrappedcuration';
import { useRecoilValue, useSetRecoilState } from 'recoil';

export default function CurationList({
  curations,
  searchTerm,
  onSearch,
  onSelectCuration,
  selectedCuration,
}) {
  const scrappedCurations = useRecoilValue(scrappedCurationsAtom);
  const setScrappedCuration = useSetRecoilState(scrappedCurationsAtom);

  const handleScrapClick = () => {
    setScrappedCuration(prev => ({
      ...prev,
      [curation.id]: !prev[curation.id],
    }));
  };

  const filteredCurations = useMemo(
    () =>
      curations.filter(curation =>
        curation.title.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [curations, searchTerm],
  );
  
  
  if (selectedCuration) return null;
  else
    return (
      <div className="h-screen w-full bg-[#FFFCF2] overflow-y-auto border-r-2 border-[#403D39] pb-[86px]">
        <Searchbar searchTerm={searchTerm} onSearch={onSearch} />
        <div className="grid grid-cols-3 px-2">
        {filteredCurations.map((curation)=> (
          <Curation
            key={curation.id}
            curation={curation}
            onClick={() => onSelectCuration(curation)}
          />
        ))}
      </div>
    </div> 
    );
}
