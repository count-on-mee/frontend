import {
  FaBed,
  FaLandmark,
  FaTree,
  FaPray,
  FaBook,
  FaPlay,
} from 'react-icons/fa';
import { IoMdCafe } from 'react-icons/io';
import { HiLocationMarker } from 'react-icons/hi';
import { MdOutlineRestaurant } from 'react-icons/md';
import { HiMiniPhoto } from 'react-icons/hi2';
import { GiScrollQuill } from 'react-icons/gi';

export default function Hashtag({ category }) {
  const categories_map = [
    { key: '숙소', label: '숙소', icon: FaBed },
    { key: '카페', label: '카페', icon: IoMdCafe },
    { key: '복합 문화 공간', label: '복합문화공간', icon: FaPlay },
    { key: '박물관', label: '박물관', icon: FaLandmark },
    { key: '미술관', label: '미술관', icon: HiMiniPhoto },
    { key: '도서관', label: '도서관', icon: FaBook },
    { key: '역사', label: '역사', icon: GiScrollQuill },
    { key: '종교', label: '종교', icon: FaPray },
    { key: '관광지', label: '관광지', icon: HiLocationMarker },
    { key: '자연', label: '자연', icon: FaTree },
    { key: '식당', label: '식당', icon: MdOutlineRestaurant },
  ];

  const categoryKey = Array.isArray(category) ? category[0] : category;
  const categoryInfo = categories_map.find((cat) => cat.key === categoryKey);

  const Icon = categoryInfo?.icon;

  return (
    <div className="gap-2 px-5 pt-3">
      <div className="inline-flex items-center mr-1 px-2 rounded-full text-sm font-medium bg-background-gray text-charcoal box-shadow">
        <Icon alt={categoryInfo.label} className="size-5 gap-1 pr-1" />
        {categoryInfo.label}
      </div>
    </div>
  );
}
