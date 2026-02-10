import React from 'react';
import { Bar } from 'react-chartjs-2';
import { neumorphStyles } from '../../../../utils/style';

const COLORS = {
  GREEN: '#4B9F4A',
  YELLOW: '#F7D117',
};

const PaymentMethodBarChart = ({ paymentMethodBarData, paymentMethodData, formatAmount }) => {
  if (paymentMethodData.shared.total === 0 && paymentMethodData.personal.total === 0) {
    return null;
  }

  return (
    <div className={`${neumorphStyles.small} rounded-xl p-6 mb-6 bg-[#f0f0f3]`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        현금/카드별 내역
      </h3>
      <div className="h-64 mb-4">
        <Bar
          data={paymentMethodBarData}
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
                    const total = paymentMethodData.shared.total + paymentMethodData.personal.total;
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    return `${formatAmount(value)}원 (${percentage}%)`;
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
      <div className="space-y-3">
        {paymentMethodData.shared.total > 0 && (
          <div>
            <div className="text-sm font-semibold text-gray-600 mb-2">공동 지출</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: COLORS.GREEN }}
                  >
                    <span className="text-white font-bold text-xs">현</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">공동 현금</div>
                    <div className="text-sm text-gray-500">
                      {paymentMethodData.shared.total > 0
                        ? ((paymentMethodData.shared.cash / paymentMethodData.shared.total) * 100).toFixed(1)
                        : 0}%
                    </div>
                  </div>
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {formatAmount(paymentMethodData.shared.cash)}원
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: COLORS.YELLOW }}
                  >
                    <span className="text-white font-bold text-xs">카</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">공동 카드</div>
                    <div className="text-sm text-gray-500">
                      {paymentMethodData.shared.total > 0
                        ? ((paymentMethodData.shared.card / paymentMethodData.shared.total) * 100).toFixed(1)
                        : 0}%
                    </div>
                  </div>
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {formatAmount(paymentMethodData.shared.card)}원
                </div>
              </div>
            </div>
          </div>
        )}
        {paymentMethodData.personal.total > 0 && (
          <div>
            <div className="text-sm font-semibold text-gray-600 mb-2">개인 지출</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: COLORS.GREEN }}
                  >
                    <span className="text-white font-bold text-xs">현</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">개인 현금</div>
                    <div className="text-sm text-gray-500">
                      {paymentMethodData.personal.total > 0
                        ? ((paymentMethodData.personal.cash / paymentMethodData.personal.total) * 100).toFixed(1)
                        : 0}%
                    </div>
                  </div>
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {formatAmount(paymentMethodData.personal.cash)}원
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: COLORS.YELLOW }}
                  >
                    <span className="text-white font-bold text-xs">카</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">개인 카드</div>
                    <div className="text-sm text-gray-500">
                      {paymentMethodData.personal.total > 0
                        ? ((paymentMethodData.personal.card / paymentMethodData.personal.total) * 100).toFixed(1)
                        : 0}%
                    </div>
                  </div>
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {formatAmount(paymentMethodData.personal.card)}원
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodBarChart;
