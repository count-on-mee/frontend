import React from 'react';
import { neumorphStyles } from '../../../../utils/style';

const CategoryList = ({ categoryData, formatAmount }) => {
  if (!categoryData.categories || categoryData.categories.length === 0) {
    return null;
  }

  return (
    <div className={`${neumorphStyles.small} rounded-xl p-6 mb-6 bg-[#f0f0f3]`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        카테고리별 내역
      </h3>
      <div className="space-y-3">
        {categoryData.categories.map((item) => {
          const percentage = ((item.amount / categoryData.total) * 100).toFixed(1);
          return (
            <div
              key={item.category}
              className="flex items-center justify-between p-3 rounded-lg bg-white"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: item.color }}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-800">{item.label}</div>
                  <div className="text-sm text-gray-500">{percentage}%</div>
                </div>
              </div>
              <div className="text-lg font-semibold text-gray-800">
                {formatAmount(item.amount)}원
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;
