import { BookmarkIcon } from '@heroicons/react/24/outline';
import scrappedCurationsAtom from '../recoil/scrappedcuration';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import dCuration from '../dummydata/curation.json';


export default function Curation({ curation, onClick }) {
  const scrappedCurations = useRecoilValue(scrappedCurationsAtom);
  const setScrappedCuration = useSetRecoilState(scrappedCurationsAtom);

  const handleScrapClick = (id) => {
    setScrappedCuration((prev) => ({
      ...prev,
      [id]: !prev[dCuration.id],
    }));
  };

  return (
      <>
      {dCuration.map((dcuration) => (
        <div key={dcuration.id} className="relative">
          <img
            src={dcuration.imageUrl}
            className="object-cover w-full px-2 py-2 mx-auto h-64 opacity-70 rounded-2xl"
            alt={dcuration.title}
          /> 
          <div className="absolute text-xl text-white font-mixed bottom-3 left-7">
            {dcuration.title}
          </div>
          <BookmarkIcon
            className={`absolute top-5 right-5 w-5 h-5 stroke-white ${scrappedCurations[dcuration.id] ? 'fill-[#EB5E28] stroke-[#EB5E28]' : ''}`}
            onClick={e => handleScrapClick(e, dcuration.id)}
          />
        </div>
      ))}

      {/* <div className="relative">
        <img
          src={`https://picsum.photos/600/800/?random=${curation.id}`}
          className="object-cover w-full px-2 py-2 mx-auto h-64 opacity-70 rounded-2xl"
          alt={curation.name}
        />
        <div className="absolute text-xl text-white font-prompt bottom-3 left-7">
          {curation.title}
        </div>
        <BookmarkIcon
          className={`absolute top-5 right-5 w-5 h-5 stroke-white ${scrappedCurations[curation.id] ? 'fill-[#EB5E28] stroke-[#EB5E28]' : ''}`}
          onClick={e => handleScrapClick(e, curation.id)}
        />
     */}
    </>
  );
}
