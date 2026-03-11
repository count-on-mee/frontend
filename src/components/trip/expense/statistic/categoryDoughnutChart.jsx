import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { neumorphStyles } from '../../../../utils/style';

const CategoryDoughnutChart = ({ doughnutData, categoryData, formatAmount, title }) => {
  if (categoryData.total === 0) return null;

  return (
    <div className={`${neumorphStyles.small} rounded-xl p-6 bg-[#f0f0f3]`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        카테고리별 지출 ({title})
      </h3>
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-64 h-64">
          <Doughnut
            data={doughnutData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const label = context.label || '';
                      const value = context.parsed || 0;
                      const total = context.dataset.data.reduce(
                        (a, b) => a + b,
                        0,
                      );
                      const percentage = ((value / total) * 100).toFixed(1);
                      return `${label}: ${formatAmount(value)}원 (${percentage}%)`;
                    },
                  },
                },
              },
              cutout: '70%',
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-gray-700">
              {formatAmount(categoryData.total)}
            </div>
            <div className="text-sm text-gray-500">총 지출</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDoughnutChart;
