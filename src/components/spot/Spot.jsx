import { BookmarkIcon } from '@heroicons/react/24/outline';
import Hashtag from '../ui/Hashtag';
import Carousel from '../ui/Carousel';
import { useState, useEffect } from 'react';

export default function Card({ handleScrapClick, spot, onClick, varient }) {
  const { address, category, imgUrls, isScraped, name, scrapedCount } = spot;

  const [localScraped, setLocalScraped] = useState(isScraped);
  const [localCount, setLocalCount] = useState(scrapedCount);

  const isDetail = varient === 'detail';

  const handleCount = () => {
    if (localScraped) {
      setLocalCount((prev) => prev - 1);
    } else {
      setLocalCount((prev) => prev + 1);
    }
  };

  useEffect(() => {
    setLocalScraped(isScraped);
  }, [isScraped]);

  return (
    <div
      className={`justify-center mx-auto rounded-2xl ${isDetail ? 'w-full' : 'box-shadow w-8/9 mt-5'}`}
      onClick={onClick}
    >
      <Carousel imgUrls={imgUrls} spot={spot} />
      <div className="pb-5">
        <div className="relative">
          <BookmarkIcon
            className={`absolute top-0 right-[9px] w-5 h-5 ${isScraped ? 'fill-[#EB5E28] stroke-[#EB5E28]' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleScrapClick();
              handleCount();
            }}
          />
          {/* <p className="absolute top-[15px] right-[16px] text-xs text-[#EB5E28]">{localCount}</p> */}
        </div>
        <p className="mx-5 mt-3 text-md font-bold">{name}</p>
        {isDetail && (
          <p className="mx-5 text-sm font-mixed text-charcoal pb-1">
            {address}
          </p>
        )}
        <p className="mx-5 mt-5 text-sm ">스크랩수: {localCount}</p>
        <Hashtag category={category} />
      </div>
    </div>
  );
}
