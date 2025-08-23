import { BookmarkIcon } from '@heroicons/react/24/outline';
import Hashtag from '../ui/Hashtag';
import Carousel from '../ui/Carousel';
import { useRecoilValue } from 'recoil';
import scrapStateAtom from '../../recoil/scrapState';

export default function Spot({ handleScrapClick, spot, onClick, varient }) {
  const { address, categories, imgUrls, name } = spot;

  const scrapState = useRecoilValue(scrapStateAtom);
  const currentScrap = scrapState[spot.spotId];

  const isScraped = currentScrap?.isScraped ?? spot.isScraped;
  const scrapCount = currentScrap?.scrapCount ?? spot.scrapCount;

  const isDetail = varient === 'detail';

  return (
    <div
      className={`justify-center mx-auto rounded-2xl ${isDetail ? 'w-full' : 'box-shadow w-8/9 mt-5'}`}
      onClick={onClick}
    >
      <Carousel imgUrls={imgUrls} spot={spot} />
      <div className="pb-5 relative">
        <button
          className="absolute top-0 right-[9px]"
          onClick={(e) => {
            e.stopPropagation();
            handleScrapClick(spot.spotId);
          }}
        >
          <BookmarkIcon
            className={`w-5 h-5 ${isScraped ? 'fill-[#EB5E28] stroke-[#EB5E28]' : ''}`}
          />
        </button>
        <p className="mx-5 mt-3 text-md font-bold">{name}</p>
        {isDetail && (
          <p className="mx-5 text-sm font-mixed text-charcoal pb-1">
            {address}
          </p>
        )}
        <p className="mx-5 mt-5 text-sm ">{scrapCount}명이 스크랩했어요.</p>
        <Hashtag category={categories} />
      </div>
    </div>
  );
}
