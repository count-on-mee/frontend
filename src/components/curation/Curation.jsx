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
    <div className="container px-2" onClick={onClick}>
      <div className="relative ">
        <div className={`${isDetail ? 'aspect-4/3' : 'aspect-3/4'}`}>
          <img
          src={curation.imgUrl || defaultImage}
          className="absolute object-cover w-full h-full mx-auto rounded-2xl box-shadow inset-0"
          alt={curation.name}
          />
        </div>
        <div className="absolute text-lg text-background-light font-mixed font-extrabold bottom-5 left-5 text-shadow-header bg-charcoal/60 px-2 rounded-2xl">
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
            className={`absolute top-5 right-5 w-5 h-5  ${isScraped ? 'fill-[#EB5E28] stroke-[#EB5E28]' : 'stroke-white'}`}
          />
        </button>
      </div>
      <div className="flex mt-2 p-0">
          <img src={curation.author.imgUrl} className="border border-slate-500 size-5 rounded-full object-cover mr-2 mb-5 ml-2" alt={curation.author.nickname} />
          <div>{curation.author.nickname}</div>
        </div>
    </div>
  );
}
