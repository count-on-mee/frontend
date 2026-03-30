import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { neumorphStyles } from '../../utils/style';
import trainIcon from '../../assets/train.png';
import foodIcon from '../../assets/food.png';
import hotelIcon from '../../assets/hotel.png';
import tourIcon from '../../assets/tour.png';
import cruiseIcon from '../../assets/cruise.png';
import shoppingIcon from '../../assets/shopping.png';
import receiptIcon from '../../assets/receipt.png';

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
  SHOPPING: shoppingIcon,
  BUDGET: receiptIcon,
  OTHER: receiptIcon,
};

const formatAmount = (amount) => {
  return Math.round(amount).toLocaleString('ko-KR');
};

const SettlementSummary = ({ expenses, statistics, participants }) => {
  const MotionDiv = motion.div;
  const categoryExpenses = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return [];
    }
    const sharedExpenses = expenses.filter(
      (expense) => expense.expenseType === 'SHARED',
    );

    const categoryMap = {};
    sharedExpenses.forEach((expense) => {
      const category = expense.expenseCategory || 'OTHER';
      if (!categoryMap[category]) {
        categoryMap[category] = {
          category,
          label: CATEGORY_MAP[category] || '기타',
          icon: CATEGORY_ICONS[category] || receiptIcon,
          totalAmount: 0,
          items: [],
        };
      }
      categoryMap[category].totalAmount += expense.totalAmount || 0;
      categoryMap[category].items.push({
        description: expense.description || '내역 없음',
        amount: expense.totalAmount || 0,
        expenseDate: expense.expenseDate,
        isBudget: category === 'BUDGET', // 공동경비로 모은 항목인지 표시
      });
    });

    const budgetCategory = categoryMap['BUDGET'];
    const otherCategories = Object.values(categoryMap)
      .filter((cat) => cat.category !== 'BUDGET')
      .sort((a, b) => b.totalAmount - a.totalAmount);

    return budgetCategory
      ? [budgetCategory, ...otherCategories]
      : otherCategories;
  }, [expenses]);

  const sharedBudgetInfo = useMemo(() => {
    if (!statistics?.shared) return null;

    const totalBudget = statistics.shared.totalBudget || 0;
    const totalSpent = statistics.shared.totalSpent || 0;
    const remainingBudget = statistics.shared.remainingBudget || 0;
    const extraDistribution = statistics.shared.extraDistribution;

    return {
      totalBudget,
      totalSpentFromBudget: totalSpent,
      remainingBudget,
      extraDistribution,
    };
  }, [statistics?.shared]);

  const participantsMap = useMemo(() => {
    return new Map(participants?.map((p) => [p.userId, p]) || []);
  }, [participants]);

  const totalSharedExpenses = useMemo(() => {
    return categoryExpenses
      .filter((category) => category.category !== 'BUDGET')
      .reduce((sum, category) => sum + category.totalAmount, 0);
  }, [categoryExpenses]);

  return (
    <div className="h-full flex flex-col overflow-y-auto pr-1">
      <div className="space-y-4 mb-6">
        {categoryExpenses.length > 0 ? (
          categoryExpenses.map((categoryData, index) => (
            <MotionDiv
              key={categoryData.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${neumorphStyles.small} rounded-xl p-6`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 flex items-center justify-center ${neumorphStyles.small} rounded-full`}
                >
                  <img
                    src={categoryData.icon}
                    alt={categoryData.label}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {categoryData.label}
                  </h3>
                  <div className="text-sm text-gray-500">
                    총 {formatAmount(categoryData.totalAmount)}원
                  </div>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                {categoryData.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.isBudget ? '💰 ' : ''}
                      {item.description}
                    </span>
                    <span className="font-medium text-gray-700">
                      {item.isBudget ? '+' : '-'} {formatAmount(item.amount)}원
                    </span>
                  </div>
                ))}
              </div>
            </MotionDiv>
          ))
        ) : (
          <div className="text-center text-gray-400 py-8">
            공동 경비 내역이 없습니다.
          </div>
        )}
      </div>

      {sharedBudgetInfo && (
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: categoryExpenses.length * 0.1 + 0.1 }}
          className={`${neumorphStyles.small} rounded-xl p-6 mb-6`}
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            공동경비 요약
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">모은 금액</span>
              <span className="font-semibold text-gray-800">
                {formatAmount(sharedBudgetInfo.totalBudget)}원
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">결제한 금액</span>
              <span className="font-semibold text-gray-800">
                {formatAmount(sharedBudgetInfo.totalSpentFromBudget)}원
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">남은 금액</span>
              <span className="font-semibold text-gray-800">
                {formatAmount(sharedBudgetInfo.remainingBudget)}원
              </span>
            </div>
            {categoryExpenses.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">카테고리별 총 사용액</span>
                  <span className="font-semibold text-gray-800">
                    {formatAmount(totalSharedExpenses)}원
                  </span>
                </div>
              </div>
            )}
          </div>
          {sharedBudgetInfo.remainingBudget > 0 &&
            participants &&
            participants.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 bg-blue-50 rounded-lg p-3">
                  <div className="font-medium text-gray-700 mb-1">
                    💡 공동경비 잔액 분배 안내
                  </div>
                  <div className="text-gray-600">
                    남은 공동경비는 참가자 {participants.length}명에게 1/N로
                    분배됩니다.
                    {(() => {
                      const extraDistribution =
                        sharedBudgetInfo.extraDistribution;
                      const roundingAmount =
                        (sharedBudgetInfo.remainingBudget || 0) %
                        participants.length;
                      if (roundingAmount > 0) {
                        const baseAmount = Math.floor(
                          (sharedBudgetInfo.remainingBudget || 0) /
                            participants.length,
                        );
                        const extraRecipient = extraDistribution?.userId
                          ? participantsMap.get(extraDistribution.userId)
                          : null;
                        const extraRecipientName = extraRecipient
                          ? extraRecipient.name || extraRecipient.nickname
                          : '여행을 만든 사람';
                        return (
                          <>
                            <br />
                            <span className="text-orange-600 font-medium">
                              분배 금액: {baseAmount.toLocaleString()}원 ×{' '}
                              {participants.length}명 + 나머지 {roundingAmount}
                              원
                            </span>
                            <br />
                            <span className="text-gray-500">
                              나머지 {roundingAmount}원은 {extraRecipientName}
                              이(가) 받습니다.
                            </span>
                          </>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
              </div>
            )}
        </MotionDiv>
      )}

      {categoryExpenses.length === 0 && !sharedBudgetInfo && (
        <div className="text-center text-gray-400 py-8">
          정산 요약 데이터가 없습니다.
        </div>
      )}
    </div>
  );
};

export default SettlementSummary;
