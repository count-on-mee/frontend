import { BookmarkIcon } from '@heroicons/react/24/outline';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../../recoil/user';
import curationsAtom from '../../recoil/curations';
import selectedCurationAtom from '../../recoil/selectedCuration';
import defaultImage from '../../assets/icon.png';
import authAtom from '../../recoil/auth';

export default function Curation({ curation, handleScrapClick }) {
  const user = useRecoilValue(userAtom);
  const setCurations = useSetRecoilState(curationsAtom);
  const [selectedCuration, setSelectedCuration] =
    useRecoilState(selectedCurationAtom);
  const { name, imgUrl, categories, description, isScraped, scrapedCount } =
    curation;

  return (
    <div className="container">
      <div className="relative">
        <img
          src={curation.imgUrl || defaultImage}
          // src='https://www.midascad.com/hubfs/image-png-Feb-22-2024-11-28-44-2386-PM.png'
          className="object-cover w-full px-2 py-2 mx-auto h-64 opacity-70 rounded-2xl"
          alt={curation.name}
        />
        <div className="absolute text-lg text-background-light font-mixed font-extrabold bottom-3 left-7">
          {curation.name}
          {/* curationTitle */}
        </div>
        <BookmarkIcon
          className={`absolute top-5 right-5 w-5 h-5  ${isScraped ? 'fill-[#EB5E28] stroke-[#EB5E28]' : 'stroke-white'}`}
          // className={`absolute top-5 right-5 w-5 h-5 stroke-white`}
          onClick={(e) => {
            e.stopPropagation();
            handleScrapClick(e, curation);
          }}
        />
      </div>
    </div>
  );
}
