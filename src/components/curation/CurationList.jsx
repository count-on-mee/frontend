import { useRecoilState, useRecoilValue } from 'recoil';
import Curation from './curation';
import curationsAtom from '../../recoil/curations';
import selectedCurationAtom from '../../recoil/selectedCuration';

export default function CurationList({ handleScrapClick, onSelectedCuration, curations }) {
  // const curations = useRecoilValue(curationsAtom);
  const [selectedCuration, setSelectedCuration] =
    useRecoilState(selectedCurationAtom);
  return (
    <div>
      {curations.length === 0 ? (
        <div>등록된 curation이 없습니다.</div>
      ) : (
        <div className="grid grid-cols-5 gap-2">
          {curations.map((curation) => (
            <Curation
              key={curation.curationId}
              curation={curation}
              handleScrapClick={handleScrapClick}
              onClick={(e) => {
                e.stopPropagation();
                onSelectedCuration(curation);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
