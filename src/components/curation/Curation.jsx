import { BookmarkIcon } from '@heroicons/react/24/outline';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../../recoil/user';
import curationsAtom from '../../recoil/curations';
import selectedCurationAtom from '../../recoil/selectedCuration';
import defaultImage from '../../assets/logo.png';

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
    <div className="w-full" onClick={onClick}>
      <div className="relative w-full">
        <div
          className={`w-full ${isDetail ? 'aspect-video' : 'aspect-[3/4]'} min-h-[80px] sm:min-h-[200px]`}
        >
          <img
            src={curation.imgUrl || defaultImage}
            className="absolute object-cover w-full h-full mx-auto rounded-lg sm:rounded-2xl box-shadow inset-0"
            alt={curation.name}
          />
        </div>
        <div className="absolute text-[9px] sm:text-xl lg:text-2xl text-white font-mixed font-semibold bottom-1.5 left-1 right-1 sm:bottom-10 sm:right-4 lg:bottom-12 lg:right-5 text-left sm:text-right px-0.5 sm:px-4 lg:px-5 leading-tight line-clamp-2">
          {curation.name}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleScrapClick(curation);
          }}
        >
          <BookmarkIcon
            className={`absolute top-1 right-1 sm:top-4 sm:right-4 lg:top-5 lg:right-5 w-3 h-3 sm:w-5 sm:h-5 ${isScraped ? 'fill-[#f5861d] stroke-[#f5861d]' : 'stroke-white'}`}
          />
        </button>
      </div>
      <div className="flex items-center mt-1 px-0.5">
        <img
          src={curation.author.imgUrl}
          className="border border-slate-500 size-3 sm:size-5 rounded-full object-cover mr-1"
          alt={curation.author.nickname}
        />
        <div className="text-[9px] sm:text-sm text-gray-700 truncate">
          {curation.author.nickname}
        </div>
      </div>
    </div>
  );
}
