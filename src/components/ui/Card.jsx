import { BookmarkIcon } from '@heroicons/react/16/solid';
import Hashtag from '../ui/Hashtag';
import Carousel from './Carousel';

export default function Card({ onScrapClick, type, spot }) {
  const {
    address, category, imgUrls, isScraped, name } = spot;
  return (
    <div className="w-8/9 justify-center mx-auto rounded-2xl mt-5 box-shadow">
      <Carousel imgUrls={imgUrls} spot={spot}/>
      <div className="pb-5">
        <div className="relative">
          <BookmarkIcon className="absolute top-1 right-5 size-5" />
        </div>
        <p className="mx-5 mt-3 text-md">{name}</p>
        <p className="mx-5 text-sm font-mixed text-charcoal pb-1">{address}</p>
        {/* <p className="mx-5 text-sm font-mixed text-charcoal pb-1">{category}</p> */}
        <Hashtag category={category}/>
      </div>
    </div>
  );
}