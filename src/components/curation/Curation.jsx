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

  return (
    <div className="w-full px-1" onClick={onClick}>
      <div className="relative w-full">
        <div
          className={`w-full ${isDetail ? 'aspect-4/3' : 'aspect-3/4'} min-h-[200px] sm:min-h-[220px]`}
        >
          <img
            src={curation.imgUrl || defaultImage}
            className="absolute object-cover w-full h-full mx-auto box-shadow inset-0"
            alt={curation.name}
          />
        </div>
        <div className="absolute text-sm sm:text-base lg:text-lg text-background-light font-mixed font-extrabold bottom-3 left-3 sm:bottom-4 sm:left-4 lg:bottom-5 lg:left-5 text-shadow-header bg-charcoal/60 px-2">
          {curation.name}
          {/* curationTitle */}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleScrapClick(curation);
          }}
        >
          <BookmarkIcon
            className={`absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-5 lg:right-5 w-4 h-4 sm:w-5 sm:h-5 ${isScraped ? 'fill-[#EB5E28] stroke-[#EB5E28]' : 'stroke-white'}`}
          />
        </button>
      </div>
      <div className="flex items-center mt-2 px-1">
        <img
          src={curation.author.imgUrl}
          className="border border-slate-500 size-4 sm:size-5 rounded-full object-cover mr-2"
          alt={curation.author.nickname}
        />
        <div className="text-xs sm:text-sm text-gray-700 truncate">
          {curation.author.nickname}
        </div>
      </div>
    </div>
  );
}
