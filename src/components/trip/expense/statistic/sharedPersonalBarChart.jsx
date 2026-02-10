import React from 'react';
import { Bar } from 'react-chartjs-2';
import { neumorphStyles } from '../../../../utils/style';

const SharedPersonalBarChart = ({ barData, formatAmount }) => {
  return (
    <div className={`${neumorphStyles.small} rounded-xl p-6 mb-6 bg-[#f0f0f3]`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        공동/개인 지출 비교
      </h3>
      <div className="h-64">
        <Bar
          data={barData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const value = context.parsed.y || 0;
                    return `${formatAmount(value)}원`;
                  },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => {
                    return formatAmount(value);
                  },
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)',
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default SharedPersonalBarChart;
