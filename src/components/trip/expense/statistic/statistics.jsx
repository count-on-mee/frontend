import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { neumorphStyles, scrapListStyles } from '../../../../utils/style';
import CategoryDoughnutChart from './categoryDoughnutChart';
import CategoryList from './categoryList';
import PaymentMethodBarChart from './paymentMethodBarChart';
import SharedPersonalBarChart from './sharedPersonalBarChart';
import hotelIcon from '../../../../assets/hotel.png';
import foodIcon from '../../../../assets/food.png';
import receiptIcon from '../../../../assets/receipt.png';
import trainIcon from '../../../../assets/train.png';
import cruiseIcon from '../../../../assets/cruise.png';
import tourIcon from '../../../../assets/tour.png';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);


const COLORS = {
  GREEN: '#4B9F4A',
  YELLOW: '#F7D117', 
  RED: '#DC1E1E', 
  ORANGE: '#FF6900', 
  BLUE: '#0055BF', 
};

const CATEGORY_MAP = {
  TRANSPORTATION: '교통',
  MEAL: '식비',
  ACCOMMODATION: '숙박',
  TOUR: '관광',
  ACTIVITY: '액티비티',
  SHOPPING: '쇼핑',
  BUDGET: '공동경비',
  OTHER: '기타',
};

const CATEGORY_ICONS = {
  TRANSPORTATION: trainIcon,
  MEAL: foodIcon,
  ACCOMMODATION: hotelIcon,
  TOUR: tourIcon,
  ACTIVITY: cruiseIcon,
  SHOPPING: receiptIcon,
  BUDGET: receiptIcon,
  OTHER: receiptIcon,
};

const CATEGORY_COLORS = {
  ACCOMMODATION: COLORS.GREEN,
  MEAL: COLORS.YELLOW,
  TRANSPORTATION: COLORS.BLUE,
  TOUR: COLORS.ORANGE,
  ACTIVITY: COLORS.ORANGE,
  SHOPPING: COLORS.ORANGE,
  BUDGET: COLORS.ORANGE,
  OTHER: COLORS.RED,
};

const Statistics = ({ expenses, statistics }) => {
  const [expenseType, setExpenseType] = React.useState('SHARED');

  // 카테고리별 지출 계산
  const categoryData = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return {
        labels: [],
        amounts: [],
        colors: [],
        total: 0,
      };
    }

    const filteredExpenses = expenses.filter(
      (expense) => expense.expenseType === expenseType && expense.expenseCategory !== 'BUDGET',
    );

    const categoryMap = {};
    filteredExpenses.forEach((expense) => {
      const category = expense.expenseCategory || 'OTHER';
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category] += expense.totalAmount;
    });

    const sortedCategories = Object.entries(categoryMap)
      .map(([category, amount]) => ({
        category,
        amount,
        color: CATEGORY_COLORS[category] || COLORS.RED,
        label: CATEGORY_MAP[category] || '기타',
        icon: CATEGORY_ICONS[category] || receiptIcon,
      }))
      .sort((a, b) => b.amount - a.amount);

    const total = sortedCategories.reduce((sum, item) => sum + item.amount, 0);

    return {
      labels: sortedCategories.map((item) => item.label),
      amounts: sortedCategories.map((item) => item.amount),
      colors: sortedCategories.map((item) => item.color),
      categories: sortedCategories,
      total,
    };
  }, [expenses, expenseType]);

  const doughnutData = useMemo(() => {
    let colors;
    
    if (expenseType === 'PERSONAL') {
      const baseColor = COLORS.BLUE;
      const generateColorPalette = (baseColorHex, count) => {
        const colorPalette = [];
        const baseR = parseInt(baseColorHex.slice(1, 3), 16);
        const baseG = parseInt(baseColorHex.slice(3, 5), 16);
        const baseB = parseInt(baseColorHex.slice(5, 7), 16);
        
        for (let i = 0; i < count; i++) {
          const ratio = i / Math.max(count - 1, 1);
          const r = Math.round(baseR + (255 - baseR) * ratio * 0.3);
          const g = Math.round(baseG + (255 - baseG) * ratio * 0.3);
          const b = Math.round(baseB + (255 - baseB) * ratio * 0.3);
          colorPalette.push(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
        }
        return colorPalette;
      };
      colors = generateColorPalette(baseColor, categoryData.labels.length);
    } else {
      // 공동 지출일 때는 원래 카테고리별 색상 사용
      colors = categoryData.colors;
    }
    
    return {
      labels: categoryData.labels,
      datasets: [
        {
          data: categoryData.amounts,
          backgroundColor: colors,
          borderWidth: 0,
        },
      ],
    };
  }, [categoryData, expenseType]);

  // 공동/개인별 현금/카드 지출 계산
  const paymentMethodData = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return {
        shared: { cash: 0, card: 0, total: 0 },
        personal: { cash: 0, card: 0, total: 0 },
      };
    }

    const sharedExpenses = expenses.filter(
      (expense) => expense.expenseType === 'SHARED' && expense.expenseCategory !== 'BUDGET',
    );
    const personalExpenses = expenses.filter(
      (expense) => expense.expenseType === 'PERSONAL' && expense.expenseCategory !== 'BUDGET',
    );

    let sharedCash = 0;
    let sharedCard = 0;
    let personalCash = 0;
    let personalCard = 0;

    sharedExpenses.forEach((expense) => {
      if (expense.paymentMethod === 'CASH') {
        sharedCash += expense.totalAmount;
      } else if (expense.paymentMethod === 'CARD') {
        sharedCard += expense.totalAmount;
      }
    });

    personalExpenses.forEach((expense) => {
      if (expense.paymentMethod === 'CASH') {
        personalCash += expense.totalAmount;
      } else if (expense.paymentMethod === 'CARD') {
        personalCard += expense.totalAmount;
      }
    });

    return {
      shared: {
        cash: sharedCash,
        card: sharedCard,
        total: sharedCash + sharedCard,
      },
      personal: {
        cash: personalCash,
        card: personalCard,
        total: personalCash + personalCard,
      },
    };
  }, [expenses]);

  // 현금/카드별 바 차트 데이터 (공동/개인 구분)
  const paymentMethodBarData = useMemo(() => {
    return {
      labels: ['공동 현금', '공동 카드', '개인 현금', '개인 카드'],
      datasets: [
        {
          label: '지출 금액',
          data: [
            paymentMethodData.shared.cash,
            paymentMethodData.shared.card,
            paymentMethodData.personal.cash,
            paymentMethodData.personal.card,
          ],
          backgroundColor: [
            COLORS.GREEN, // 공동 현금
            COLORS.YELLOW, // 공동 카드
            COLORS.GREEN, // 개인 현금
            COLORS.YELLOW, // 개인 카드
          ],
          borderRadius: 8,
        },
      ],
    };
  }, [paymentMethodData]);

  // 바 차트 데이터 (공동/개인 지출 비교)
  const barData = useMemo(() => {
    const sharedTotal = statistics?.shared?.totalSpent || 0;
    const personalTotal = statistics?.personal?.totalSpent || 0;

    return {
      labels: ['공동 지출', '개인 지출'],
      datasets: [
        {
          label: '지출 금액',
          data: [sharedTotal, personalTotal],
          backgroundColor: [COLORS.ORANGE, COLORS.BLUE],
          borderRadius: 8,
        },
      ],
    };
  }, [statistics]);

  const formatAmount = (amount) => {
    return amount.toLocaleString('ko-KR');
  };

  const currentTotal = expenseType === 'SHARED'
    ? statistics?.shared?.totalSpent || 0
    : statistics?.personal?.totalSpent || 0;

  return (
    <div className="h-full flex flex-col overflow-y-auto pr-1">
      {/* 총 지출 카드 */}
      <div className={`${neumorphStyles.small} rounded-xl p-6 mb-6 bg-[#f0f0f3]`}>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">총 지출</h3>
        <div className="text-4xl font-bold text-[#252422] mb-4">
          {formatAmount(currentTotal)}원
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={() => setExpenseType('SHARED')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              expenseType === 'SHARED'
                ? `${scrapListStyles.selectedOrangeButton} text-white`
                : `${neumorphStyles.small} text-gray-700`
            }`}
          >
            공동 지출
          </motion.button>
          <motion.button
            onClick={() => setExpenseType('PERSONAL')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              expenseType === 'PERSONAL'
                ? `${scrapListStyles.selectedOrangeButton} text-white`
                : `${neumorphStyles.small} text-gray-700`
            }`}
          >
            개인 지출
          </motion.button>
        </div>
      </div>

      <CategoryDoughnutChart
        doughnutData={doughnutData}
        categoryData={categoryData}
        formatAmount={formatAmount}
      />

      <CategoryList
        categoryData={categoryData}
        formatAmount={formatAmount}
      />

      <PaymentMethodBarChart
        paymentMethodBarData={paymentMethodBarData}
        paymentMethodData={paymentMethodData}
        formatAmount={formatAmount}
      />

      <SharedPersonalBarChart
        barData={barData}
        formatAmount={formatAmount}
      />

      {categoryData.total === 0 && (
        <div className="text-center text-gray-400 py-8">
          지출 내역이 없습니다.
        </div>
      )}
    </div>
  );
};

export default Statistics;
