import React from 'react';
import { neumorphStyles } from '../../../utils/style';
import { CATEGORY_MAP, CATEGORY_ICONS } from './expenseConstants';

const CategorySelector = ({ category, onCategoryChange, disabled = false }) => {
  return (
    <div className={` rounded-xl p-4`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        카테고리<span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(CATEGORY_MAP).map(([key, label]) => (
          <button
            key={key}
            onClick={() => !disabled && onCategoryChange(key)}
            disabled={disabled}
            className={`py-3 rounded-lg font-medium transition-all ${
              category === key
                ? 'bg-[#f5861d] text-white'
                : `${neumorphStyles.small} text-gray-700 ${!disabled ? neumorphStyles.hover : 'opacity-50 cursor-not-allowed'}`
            }`}
          >
            <div className="flex items-center justify-center mb-1">
              <img
                src={CATEGORY_ICONS[key]}
                alt={label}
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="text-xs">{label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
