import { useMemo } from 'react';
import Searchbar from './Searchbar';
import Curation from './Curation';

export default function CurationList({
  curations,
  searchTerm,
  onSearch,
  onSelectCuration,
  selectedCuration,
}) {
  const filteredCurations = useMemo(
    () =>
      curations.filter(curation =>
        curation.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [curations, searchTerm],
  );

  if (selectedCuration) return null;
  else
    return (
      <div className="h-screen w-full bg-[#FFFCF2] overflow-y-auto border-r-2 border-[#403D39]">
        <Searchbar searchTerm={searchTerm} onSearch={onSearch} />
        <div className="grid grid-cols-3 px-2">
          {filteredCurations.map(curation => (
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