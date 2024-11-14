import { BookmarkIcon } from '@heroicons/react/24/outline';
import { scrappedCurationsState } from '../atoms/ScrapAtom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

export default function Curation({ curation, onClick }) {
  const scrappedCurations = useRecoilValue(scrappedCurationsState);
  const setScrappedCuration = useSetRecoilState(scrappedCurationsState);

  const handleScrapClick = () => {
    setScrappedCuration(prev => ({
      ...prev,
      [curation.id]: !prev[curation.id],
    }));
  };

  return (
    <div className="container" onClick={onClick}>
      <div className="relative">
        <img
          src={curation.image || '../src/assets/img/sample.jpg'}
          className="object-cover w-full px-2 py-2 mx-auto h-64 opacity-70 rounded-2xl"
          alt={curation.name}
        />
        <div className="absolute text-xl text-white font-prompt bottom-3 left-7">
          {curation.name}
        </div>
        <BookmarkIcon
          className={`absolute top-5 right-5 w-5 h-5 stroke-white ${scrappedCurations[curation.id] ? 'fill-[#EB5E28] stroke-[#EB5E28]' : ''}`}
          onClick={e => handleScrapClick(e, curation.id)}
        />
      </div>
    </div>
  );
}
