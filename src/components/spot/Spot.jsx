import { BookmarkIcon } from '@heroicons/react/24/outline';
import Hashtag from '../ui/Hashtag';
import Carousel from '../ui/Carousel';
import { useRecoilValue } from 'recoil';
import scrapStateAtom from '../../recoil/scrapState';
import { neumorphStyles } from '../../utils/style';

export default function Spot({ handleScrapClick, spot, onClick, varient }) {
  const { address, categories, imgUrls, name } = spot;

  const scrapState = useRecoilValue(scrapStateAtom);
  const currentScrap = scrapState[spot.spotId];

  const isScraped = currentScrap?.isScraped ?? spot.isScraped;
  const scrapCount = currentScrap?.scrapCount ?? spot.scrapCount;

  const isDetail = varient === 'detail';

  return (
    <div
      className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${isDetail ? 'w-full' : `w-full rounded-2xl overflow-hidden ${neumorphStyles.small} ${neumorphStyles.hover}`}`}
      onClick={onClick}
    >
      <Carousel imgUrls={imgUrls} spot={spot} />
      <div className="p-4 relative">
        <button
          className={`absolute top-4 right-4 z-10 flex flex-col items-center gap-1 transition-all duration-200`}
          onClick={(e) => {
            e.stopPropagation();
            handleScrapClick(spot.spotId);
          }}
        >
          <div
            className={`p-2 rounded-full ${neumorphStyles.small} ${neumorphStyles.hover}`}
          >
            <BookmarkIcon
              className={`w-5 h-5 transition-colors ${isScraped ? 'fill-[#f5861d] stroke-[#f5861d]' : 'text-gray-400 hover:text-[#f5861d]'}`}
            />
          </div>
          <span className="text-xs text-gray-600 font-medium">
            {scrapCount}
          </span>
        </button>
        <h3 className="text-lg font-bold text-[#252422] mb-2 pr-12">{name}</h3>
        {isDetail && <p className="text-sm text-gray-600 mb-3">{address}</p>}
        <Hashtag category={categories} />
      </div>
    </div>
  );
}
