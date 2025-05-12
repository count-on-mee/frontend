import { FaPlane, FaHotel, FaUtensils, FaEllipsisH } from 'react-icons/fa';

export const CATEGORY_ICON_COMPONENTS = {
  transportation: 'FaPlane',
  accommodation: 'FaHotel',
  food: 'FaUtensils',
  etc: 'FaEllipsisH',
};

export const CATEGORY_LABELS = {
  transportation: '교통편 추가',
  accommodation: '숙박비 추가',
  food: '식비 추가',
  etc: '기타 항목 추가',
};

export const CATEGORY_NAMES = {
  transportation: '교통편',
  accommodation: '숙박비',
  food: '식비',
  etc: '기타',
};

export const FIXED_ROW_RULES = {
  transportation: (index) => index === 0,
  accommodation: (index) => index === 0,
  food: (index) => index === 0,
  etc: (index) => index === 0,
};

export const isValidNewRow = (category, newRow) => {
  if (!newRow[category]) return false;

  return category === 'food' || category === 'etc'
    ? newRow[category].name && newRow[category].amount
    : newRow[category].type && newRow[category].amount;
};
