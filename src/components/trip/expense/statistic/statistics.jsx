import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { neumorphStyles } from '../../../../utils/style';
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
  const sharedCategoryData = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return {
        labels: [],
        amounts: [],
        colors: [],
        total: 0,
        categories: [],
      };
    }

    const filteredExpenses = expenses.filter(
      (expense) =>
        expense.expenseType === 'SHARED' &&
        expense.expenseCategory !== 'BUDGET',
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
  }, [expenses]);

  const personalCategoryData = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return {
        labels: [],
        amounts: [],
        colors: [],
        total: 0,
        categories: [],
      };
    }

    const filteredExpenses = expenses.filter(
      (expense) =>
        expense.expenseType === 'PERSONAL' &&
        expense.expenseCategory !== 'BUDGET',
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
  }, [expenses]);

  const sharedDoughnutData = useMemo(() => {
    return {
      labels: sharedCategoryData.labels,
      datasets: [
        {
          data: sharedCategoryData.amounts,
          backgroundColor: sharedCategoryData.colors,
          borderWidth: 0,
        },
      ],
    };
  }, [sharedCategoryData]);

  const personalDoughnutData = useMemo(() => {
    const baseColor = COLORS.BLUE;
    const generateColorPalette = (baseColorHex, count) => {
      if (count === 0) return [];
      const colorPalette = [];
      const baseR = parseInt(baseColorHex.slice(1, 3), 16);
      const baseG = parseInt(baseColorHex.slice(3, 5), 16);
      const baseB = parseInt(baseColorHex.slice(5, 7), 16);

      for (let i = 0; i < count; i++) {
        const ratio = i / Math.max(count - 1, 1);
        const r = Math.round(baseR + (255 - baseR) * ratio * 0.3);
        const g = Math.round(baseG + (255 - baseG) * ratio * 0.3);
        const b = Math.round(baseB + (255 - baseB) * ratio * 0.3);
        colorPalette.push(
          `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
        );
      }
      return colorPalette;
    };
    const colors = generateColorPalette(
      baseColor,
      personalCategoryData.labels.length,
    );

    return {
      labels: personalCategoryData.labels,
      datasets: [
        {
          data: personalCategoryData.amounts,
          backgroundColor: colors,
          borderWidth: 0,
        },
      ],
    };
  }, [personalCategoryData]);

  const paymentMethodData = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return {
        shared: { cash: 0, card: 0, total: 0 },
        personal: { cash: 0, card: 0, total: 0 },
      };
    }

    const sharedExpenses = expenses.filter(
      (expense) =>
        expense.expenseType === 'SHARED' &&
        expense.expenseCategory !== 'BUDGET',
    );
    const personalExpenses = expenses.filter(
      (expense) =>
        expense.expenseType === 'PERSONAL' &&
        expense.expenseCategory !== 'BUDGET',
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

  const sharedPaymentMethodBarData = useMemo(() => {
    return {
      labels: ['현금', '카드'],
      datasets: [
        {
          label: '지출 금액',
          data: [paymentMethodData.shared.cash, paymentMethodData.shared.card],
          backgroundColor: [COLORS.GREEN, COLORS.YELLOW],
          borderRadius: 8,
        },
      ],
    };
  }, [paymentMethodData]);

  const personalPaymentMethodBarData = useMemo(() => {
    return {
      labels: ['현금', '카드'],
      datasets: [
        {
          label: '지출 금액',
          data: [
            paymentMethodData.personal.cash,
            paymentMethodData.personal.card,
          ],
          backgroundColor: [COLORS.GREEN, COLORS.YELLOW],
          borderRadius: 8,
        },
      ],
    };
  }, [paymentMethodData]);
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

  const sharedTotal = statistics?.shared?.totalSpent || 0;
  const personalTotal = statistics?.personal?.totalSpent || 0;
  const totalSpent = sharedTotal + personalTotal;

  return (
    <div className="h-full flex flex-col overflow-y-auto pr-1">
      <div
        className={`${neumorphStyles.small} rounded-xl p-6 mb-6 bg-[#f0f0f3]`}
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-4">총 지출</h3>
        <div className="text-4xl font-bold text-[#252422] mb-4">
          {formatAmount(totalSpent)}원
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">공동 지출</div>
            <div className="text-2xl font-semibold text-[#252422]">
              {formatAmount(sharedTotal)}원
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">개인 지출</div>
            <div className="text-2xl font-semibold text-[#252422]">
              {formatAmount(personalTotal)}원
            </div>
          </div>
        </div>
      </div>

      {/* 카테고리  */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-6">
          <CategoryDoughnutChart
            doughnutData={sharedDoughnutData}
            categoryData={sharedCategoryData}
            formatAmount={formatAmount}
            title="공동"
          />
          <CategoryList
            categoryData={sharedCategoryData}
            formatAmount={formatAmount}
            title="공동"
          />
        </div>

        <div className="flex flex-col gap-6">
          <CategoryDoughnutChart
            doughnutData={personalDoughnutData}
            categoryData={personalCategoryData}
            formatAmount={formatAmount}
            title="개인"
          />
          <CategoryList
            categoryData={personalCategoryData}
            formatAmount={formatAmount}
            title="개인"
          />
        </div>
      </div>

      {/* 현금/카드*/}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <PaymentMethodBarChart
            paymentMethodBarData={sharedPaymentMethodBarData}
            paymentMethodData={paymentMethodData.shared}
            formatAmount={formatAmount}
            title="공동"
          />
        </div>
        <div>
          <PaymentMethodBarChart
            paymentMethodBarData={personalPaymentMethodBarData}
            paymentMethodData={paymentMethodData.personal}
            formatAmount={formatAmount}
            title="개인"
          />
        </div>
      </div>

      <SharedPersonalBarChart barData={barData} formatAmount={formatAmount} />

      {sharedCategoryData.total === 0 && personalCategoryData.total === 0 && (
        <div className="text-center text-gray-400 py-8">
          지출 내역이 없습니다.
        </div>
      )}
    </div>
  );
};

export default Statistics;
