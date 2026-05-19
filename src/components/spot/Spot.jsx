import { BookmarkIcon } from '@heroicons/react/24/outline';
import Hashtag from '../ui/Hashtag';
import Carousel from '../ui/Carousel';
import { useRecoilValue } from 'recoil';
import scrapStateAtom from '../../recoil/scrapState';
import { neumorphStyles } from '../../utils/style';
import defaultImage from '../../assets/logo.png';

export default function Spot({ handleScrapClick, spot, onClick, varient }) {
  const { address, categories, imgUrls, name } = spot;

  const scrapState = useRecoilValue(scrapStateAtom);
  const currentScrap = scrapState[spot.spotId];

  const isScraped = currentScrap?.isScraped ?? spot.isScraped;
  const scrapCount = currentScrap?.scrapCount ?? spot.scrapCount;

  const isDetail = varient === 'detail';
  const isGrid = varient === 'grid';

  if (isGrid) {
    return (
      <div
        className="relative aspect-square cursor-pointer overflow-hidden rounded-sm group"
        onClick={onClick}
      >
        <img
          src={imgUrls?.[0] || defaultImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => { e.target.src = defaultImage; }}
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <button
          className="absolute top-1 right-1 z-10"
          onClick={(e) => { e.stopPropagation(); handleScrapClick(spot.spotId); }}
        >
          <BookmarkIcon
            className={`w-3.5 h-3.5 drop-shadow ${isScraped ? 'fill-primary stroke-primary' : 'stroke-white'}`}
          />
        </button>
        <p className="absolute bottom-1 left-1 right-1 text-[9px] text-white font-medium truncate drop-shadow">
          {name}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${isDetail ? 'w-full' : `w-full rounded-2xl overflow-hidden ${neumorphStyles.small} ${neumorphStyles.hover}`}`}
      onClick={onClick}
    >
      <div className="aspect-video w-full overflow-hidden">
        <Carousel imgUrls={imgUrls} spot={spot} />
      </div>
      <div className="p-4 relative">
        <button
          className="absolute top-4 right-4 z-10 flex flex-col items-center gap-1 transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            handleScrapClick(spot.spotId);
          }}
        >
          <div className={`p-2 rounded-full ${neumorphStyles.small} ${neumorphStyles.hover}`}>
            <BookmarkIcon
              className={`w-5 h-5 transition-colors ${isScraped ? 'fill-[#f5861d] stroke-[#f5861d]' : 'text-gray-400 hover:text-[#f5861d]'}`}
            />
          </div>
          <span className="text-xs text-gray-600 font-medium">{scrapCount}</span>
        </button>
        <h3 className="text-lg font-bold text-[#252422] mb-2 pr-12">{name}</h3>
        {isDetail && <p className="text-sm text-gray-600 mb-3">{address}</p>}
        <Hashtag category={categories} />
      </div>
    </div>
  );
}
