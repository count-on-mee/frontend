/**
 * 공동경비 분배 금액 계산 및 검증
 */
export const calculateSharedAmounts = (
  totalAmount,
  consumers,
  roundingPayer,
) => {
  const sharedAmount = Math.floor(totalAmount / consumers.length);
  const roundingAmount = totalAmount % consumers.length;

  const participants = consumers.map((userId) => ({
    participantUserId: userId,
    sharedAmount:
      userId === roundingPayer ? sharedAmount + roundingAmount : sharedAmount,
  }));

  // sharedAmount들의 합 === totalAmount 검증
  const sum = participants.reduce((acc, p) => acc + p.sharedAmount, 0);
  if (sum !== totalAmount) {
    console.error('데이터 무결성 오류:', {
      totalAmount,
      sum,
      participants,
      sharedAmount,
      roundingAmount,
      roundingPayer,
    });
    return { error: true, participants: null };
  }

  return { error: false, participants };
};

/**
 * 지출 데이터 생성
 */
export const createExpenseData = ({
  expenseMode,
  expenseType,
  settlementMethod,
  totalAmount,
  consumers,
  roundingPayer,
  customAmounts,
  category,
  description,
  paymentMethod,
  expenseDate,
  payerId,
  currentUserId,
}) => {
  if (expenseType === 'PERSONAL') {
    return {
      error: false,
      data: {
        expenseCategory: expenseMode === 'collect' ? 'BUDGET' : category,
        description: description || (expenseMode === 'collect' ? '예산' : ''),
        totalAmount,
        paymentMethod,
        expenseDate,
        expenseType: 'PERSONAL',
        payUserId: currentUserId,
        participants: [],
      },
    };
  }

  if (expenseMode === 'collect') {
    if (settlementMethod === 'SHARED') {
      const result = calculateSharedAmounts(
        totalAmount,
        consumers,
        roundingPayer,
      );
      if (result.error) {
        return { error: true, data: null };
      }

      return {
        error: false,
        data: {
          expenseCategory: 'BUDGET',
          description: description || '공동경비 추가',
          totalAmount,
          paymentMethod,
          expenseDate,
          expenseType: 'SHARED',
          payUserId: null,
          participants: result.participants,
        },
      };
    } else if (settlementMethod === 'DIRECT') {
      const participants = consumers.map((userId) => {
        const customAmount = customAmounts?.[userId] || 0;
        const amount = parseInt(
          customAmount.toString().replace(/[^0-9]/g, '') || '0',
        );
        return {
          participantUserId: userId,
          sharedAmount: amount,
        };
      });

      const sum = participants.reduce((acc, p) => acc + p.sharedAmount, 0);
      if (sum !== totalAmount) {
        console.error('직접정산 금액 합계 불일치:', {
          totalAmount,
          sum,
          participants,
          customAmounts,
        });
        return { error: true, data: null };
      }

      return {
        error: false,
        data: {
          expenseCategory: 'BUDGET',
          description: description || '공동경비 추가',
          totalAmount,
          paymentMethod,
          expenseDate,
          expenseType: 'SHARED',
          payUserId: null,
          participants,
        },
      };
    }
  } else {
    if (settlementMethod === 'SHARED') {
      const result = calculateSharedAmounts(
        totalAmount,
        consumers,
        roundingPayer,
      );
      if (result.error) {
        return { error: true, data: null };
      }

      return {
        error: false,
        data: {
          expenseCategory: category,
          description,
          totalAmount,
          paymentMethod,
          expenseDate,
          expenseType: 'SHARED',
          payUserId: payerId === 'COMMON' ? null : payerId,
          participants: result.participants,
        },
      };
    } else if (settlementMethod === 'DIRECT') {
      const participants = consumers.map((userId) => {
        const customAmount = customAmounts?.[userId] || 0;
        const amount = parseInt(
          customAmount.toString().replace(/[^0-9]/g, '') || '0',
        );
        return {
          participantUserId: userId,
          sharedAmount: amount,
        };
      });

      const sum = participants.reduce((acc, p) => acc + p.sharedAmount, 0);
      if (sum !== totalAmount) {
        console.error('직접정산 금액 합계 불일치:', {
          totalAmount,
          sum,
          participants,
          customAmounts,
        });
        return { error: true, data: null };
      }

      return {
        error: false,
        data: {
          expenseCategory: category,
          description,
          totalAmount,
          paymentMethod,
          expenseDate,
          expenseType: 'SHARED',
          payUserId: payerId === 'COMMON' ? null : payerId,
          participants,
        },
      };
    }
  }
};
