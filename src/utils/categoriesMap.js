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
import { FaPersonWalkingLuggage } from 'react-icons/fa6';

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
  { key: '여행', label: '여행', icon: FaPersonWalkingLuggage },
];

export default categories_map;
