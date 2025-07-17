import { BookmarkIcon } from '@heroicons/react/24/outline';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../../recoil/user';
import curationsAtom from '../../recoil/curations';
import selectedCurationAtom from '../../recoil/selectedCuration';
import defaultImage from '../../assets/icon.png';
import authAtom from '../../recoil/auth';

export default function Curation({
  curation,
  handleScrapClick,
  onClick,
  varient,
}) {
  const user = useRecoilValue(userAtom);
  const setCurations = useSetRecoilState(curationsAtom);
  const [selectedCuration, setSelectedCuration] =
    useRecoilState(selectedCurationAtom);
  const { name, imgUrl, categories, description, isScraped, scrapedCount } =
    curation;
  const isDetail = varient === 'detail';

  // console.log('curation', curation);
  // console.log('curationId', curation?.curationId);

  return (
    <div className="container px-2" onClick={onClick}>
      <div className="relative">
        <img
          src={curation.imgUrl || defaultImage}
          // src='https://www.midascad.com/hubfs/image-png-Feb-22-2024-11-28-44-2386-PM.png'
          className={`object-cover w-full ${isDetail ? 'aspect-4/3' : 'aspect-3/4'} mx-auto rounded-2xl box-shadow`}
          alt={curation.name}
        />
        <div className="absolute text-lg text-background-light font-mixed font-extrabold bottom-10 left-5 text-shadow-header bg-charcoal/60 px-2 rounded-2xl">
          {curation.name}
          {/* curationTitle */}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleScrapClick(curation);
            // console.log('스크랩:', curation);
          }}
        >
          <BookmarkIcon
            className={`absolute top-5 right-5 w-5 h-5  ${isScraped ? 'fill-[#EB5E28] stroke-[#EB5E28]' : 'stroke-white'}`}
            // className={`absolute top-5 right-5 w-5 h-5 stroke-white`}
          />
        </button>
      </div>
    </div>
  );
}
