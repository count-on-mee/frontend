import trainIcon from '../../../assets/train.png';
import foodIcon from '../../../assets/food.png';
import tourIcon from '../../../assets/tour.png';
import cruiseIcon from '../../../assets/cruise.png';
import shoppingIcon from '../../../assets/shopping.png';
import hotelIcon from '../../../assets/hotel.png';

export const CATEGORY_MAP = {
  TRANSPORTATION: '교통',
  MEAL: '식비',
  ACCOMMODATION: '숙박',
  TOUR: '관광',
  ACTIVITY: '액티비티',
  SHOPPING: '쇼핑',
};

export const CATEGORY_ICONS = {
  TRANSPORTATION: trainIcon,
  MEAL: foodIcon,
  ACCOMMODATION: hotelIcon,
  TOUR: tourIcon,
  ACTIVITY: cruiseIcon,
  SHOPPING: shoppingIcon,
};

export const CURRENCY_OPTIONS = [
  { code: 'KRW', name: '대한민국 원', symbol: '원' },
  { code: 'JPY', name: '일본 엔', symbol: '¥' },
  { code: 'USD', name: '미국 달러', symbol: '$' },
];
