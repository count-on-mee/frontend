import { BookmarkIcon } from '@heroicons/react/16/solid';
import Hashtag from '../ui/Hashtag';

export default function Card() {
  return (
    <div className="w-8/9 justify-center mx-auto rounded-2xl mt-5 box-shadow">
      <img
        alt="logo"
        src="/src/assets/icon.png"
        className="border-2 border-charcoal rounded-t-2xl opacity-20"
      />
      <div className="pb-5">
        <div className="relative">
          <BookmarkIcon className="absolute top-1 right-5 size-5" />
        </div>
        <p className="mx-5 mt-3 text-md">title</p>
        <p className="mx-5 text-sm font-mixed text-charcoal pb-1">address</p>
        <Hashtag />
      </div>
    </div>
  );
}
