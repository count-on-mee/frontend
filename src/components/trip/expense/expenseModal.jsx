import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { neumorphStyles, scrapListStyles } from '../../../utils/style';
import CurrencyAmountInput from './currencyAmountInput';
import CategorySelector from './categorySelector';
import PayerSelector from './payerSelector';
import ConsumerSelector from './consumerSelector';
import { createExpenseData } from './expenseUtils';

const expenseModalOrangeButton = scrapListStyles.expenseModalOrangeButton;

const ExpenseModal = ({
  isOpen,
  onClose,
  socket,
  expense,
  participants,
  currentUserId,
  dateOptions,
  onExpenseUpdate,
  tripDocumentVersionId,
  expenseType: expenseTypeProp,
  isReadOnly = false,
  onEditModeChange,
}) => {
  const isEditMode = !!expense;

  const expenseType = isEditMode
    ? expense?.expenseType || 'SHARED'
    : expenseTypeProp || 'SHARED';

  const [expenseMode, setExpenseMode] = useState('spend');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState(
    dateOptions?.[0]?.value || '1970-01-01',
  );
  const [settlementMethod, setSettlementMethod] = useState('SHARED');
  const [payerId, setPayerId] = useState(null);
  const [consumers, setConsumers] = useState([]);
  const [roundingPayer, setRoundingPayer] = useState(null);
  const [customAmounts, setCustomAmounts] = useState({});
  const [showAutoCalculateMessage, setShowAutoCalculateMessage] =
    useState(false);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('KRW');

  useEffect(() => {
    if (isEditMode && expense) {
      if (expense.expenseCategory === 'BUDGET') {
        setExpenseMode('collect');
      } else {
        setExpenseMode('spend');
      }
      setPaymentMethod(expense.paymentMethod || 'CASH');
      setCategory(expense.expenseCategory);
      setDescription(expense.description || '');
      setExpenseDate(expense.expenseDate || '1970-01-01');
      if (expenseType === 'SHARED') {
        if (expense.participants && expense.participants.length > 0) {
          const sharedAmounts = expense.participants.map((p) => p.sharedAmount);
          const isDirect = new Set(sharedAmounts).size > 1;
          setSettlementMethod(isDirect ? 'DIRECT' : 'SHARED');

          if (isDirect) {
            const customAmountsMap = {};
            expense.participants.forEach((p) => {
              customAmountsMap[p.participantUserId] =
                p.sharedAmount?.toString() || '';
            });
            setCustomAmounts(customAmountsMap);
          } else {
            setCustomAmounts({});
          }
        } else {
          setSettlementMethod('SHARED');
          setCustomAmounts({});
        }
      }
      setPayerId(expense.payUserId || null);
      setAmount(expense.totalAmount?.toString() || '');
      if (expense.participants && expense.participants.length > 0) {
        const participantUserIds = expense.participants.map(
          (p) => p.participantUserId,
        );
        setConsumers(participantUserIds);
        const sharedAmounts = expense.participants.map((p) => p.sharedAmount);
        const baseAmount = Math.min(...sharedAmounts);
        const remainderPayer = expense.participants.find(
          (p) => p.sharedAmount > baseAmount,
        );
        if (remainderPayer) {
          setRoundingPayer(remainderPayer.participantUserId);
        } else if (participantUserIds.length > 0) {
          setRoundingPayer(participantUserIds[0]);
        }
      } else {
        setConsumers([]);
        setRoundingPayer(null);
        setCustomAmounts({});
      }
    } else {
      setExpenseMode('spend');
      setPaymentMethod('CASH');
      setCategory(null);
      setDescription('');
      setExpenseDate(dateOptions?.[0]?.value || '1970-01-01');
      setSettlementMethod('SHARED');
      setPayerId(null);
      setConsumers([]);
      setRoundingPayer(null);
      setCustomAmounts({});
      setShowAutoCalculateMessage(false);
      setAmount('');
      setCurrency('KRW');
    }
  }, [isEditMode, expense, dateOptions, expenseTypeProp, expenseType]);

  useEffect(() => {
    if (expenseType === 'PERSONAL') {
      setSettlementMethod('SHARED');
      setPayerId(null);
      setConsumers([]);
      setRoundingPayer(null);
      setCustomAmounts({});
    }
  }, [expenseType]);

  useEffect(() => {
    if (
      expenseType === 'SHARED' &&
      settlementMethod === 'DIRECT' &&
      consumers.length > 0
    ) {
      const total = consumers.reduce((sum, userId) => {
        const customAmount = customAmounts[userId] || 0;
        return (
          sum + parseInt(customAmount.toString().replace(/[^0-9]/g, '') || '0')
        );
      }, 0);

      const currentAmount = parseInt(amount.replace(/[^0-9]/g, '') || '0');

      if (total > 0 && total !== currentAmount) {
        setAmount(total.toString());
        setShowAutoCalculateMessage(true);

        const timer = setTimeout(() => {
          setShowAutoCalculateMessage(false);
        }, 5000);
        return () => clearTimeout(timer);
      } else if (total === 0) {
        setShowAutoCalculateMessage(false);
      }
    } else {
      setShowAutoCalculateMessage(false);
    }
  }, [customAmounts, consumers, settlementMethod, expenseType, amount]);

  const handleConsumerToggle = (userId) => {
    setConsumers((prev) => {
      if (prev.includes(userId)) {
        const newConsumers = prev.filter((id) => id !== userId);
        if (roundingPayer === userId && newConsumers.length > 0) {
          setRoundingPayer(newConsumers[0]);
        } else if (newConsumers.length === 0) {
          setRoundingPayer(null);
        }
        return newConsumers;
      } else {
        const newConsumers = [...prev, userId];
        if (prev.length === 0) {
          setRoundingPayer(userId);
        }
        return newConsumers;
      }
    });
  };

  const handlePayerChange = (newPayerId) => {
    // 결제자 변경 시 정산 방법을 자동으로 변경하지 않음
    // 기존에 선택한 정산 방법이 우선
    setPayerId(newPayerId);
  };

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('금액을 입력해주세요.');
      return;
    }

    if (!category && expenseMode === 'spend') {
      alert('카테고리를 선택해주세요.');
      return;
    }

    if (!description.trim()) {
      alert('지출 내용을 입력해주세요.');
      return;
    }

    if (!expenseDate) {
      alert('지출 날짜를 선택해주세요.');
      return;
    }

    if (expenseType === 'SHARED') {
      if (settlementMethod === 'SHARED') {
        if (!payerId && expenseMode === 'spend') {
          alert('결제자를 선택해주세요.');
          return;
        }
        if (consumers.length === 0) {
          alert(
            expenseMode === 'collect'
              ? '돈 낼 사람을 선택해주세요.'
              : '소비자를 선택해주세요.',
          );
          return;
        }
        const totalAmount = parseInt(amount.replace(/[^0-9]/g, ''));
        const roundingAmount = totalAmount % consumers.length;
        if (roundingAmount > 0 && !roundingPayer) {
          alert('나머지 금액을 부담할 사람을 선택해주세요.');
          return;
        }
      } else if (settlementMethod === 'DIRECT') {
        if (!payerId && expenseMode === 'spend') {
          alert('결제자를 선택해주세요.');
          return;
        }
        if (consumers.length === 0) {
          alert(
            expenseMode === 'collect'
              ? '돈 낼 사람을 선택해주세요.'
              : '소비자를 선택해주세요.',
          );
          return;
        }
      }
    } else if (expenseType === 'PERSONAL') {
      if (!currentUserId) {
        alert('로그인이 필요합니다.');
        return;
      }
    }

    const totalAmount = parseInt(amount.replace(/[^0-9]/g, ''));

    const expenseDataResult = createExpenseData({
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
    });

    if (expenseDataResult.error) {
      alert('금액 계산 오류가 발생했습니다. 다시 시도해주세요.');
      return;
    }

    const expenseData = expenseDataResult.data;

    if (!socket || !socket.connected) {
      alert('서버에 연결되지 않았습니다. 네트워크 연결을 확인해주세요.');
      return;
    }

    let hasError = false;
    const errorHandler = (error) => {
      if (hasError) return;
      hasError = true;
      console.error('지출 저장 중 오류 발생:', error);
      const errorMessage =
        error?.message || error?.toString() || '알 수 없는 오류';
      alert(`지출 저장 중 오류가 발생했습니다: ${errorMessage}`);
    };

    const errorListener = (error) => {
      errorHandler(error);
    };
    socket.once('error', errorListener);

    try {
      if (isEditMode) {
        socket.emit('updateExpense', {
          tripDocumentExpenseId: expense.tripDocumentExpenseId,
          tripDocumentVersionId,
          expenseFields: expenseData,
        });
      } else {
        socket.emit('addExpense', { tripDocumentVersionId, expenseData });
      }
      if (onExpenseUpdate) {
        const isBudget = expenseData.expenseCategory === 'BUDGET';
        const delay = isBudget ? 1500 : 800;
        const targetVersionId = tripDocumentVersionId || null;

        setTimeout(() => {
          if (!hasError) {
            onExpenseUpdate(targetVersionId);
          }
        }, delay);

        if (isBudget) {
          setTimeout(() => {
            if (!hasError) {
              onExpenseUpdate(targetVersionId);
            }
          }, delay + 1000);
        }
      }

      setTimeout(() => {
        socket.off('error', errorListener);
        if (!hasError) {
          onClose();
        }
      }, 100);
    } catch (error) {
      socket.off('error', errorListener);
      errorHandler(error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/35 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-[#f0f0f3] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto m-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="sticky top-0 px-6 py-4 flex items-center relative rounded-t-2xl">
              <button
                onClick={onClose}
                className={`${neumorphStyles.small} w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 text-2xl transition-all ${neumorphStyles.hover}`}
              >
                ×
              </button>

              <h2 className="absolute left-1/2 -translate-x-1/2 text-xl font-base text-gray-800">
                {isReadOnly
                  ? '지출 내역'
                  : isEditMode
                    ? '내역 수정'
                    : '내역 추가'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* 돈 쓰기/돈 모으기 선택 */}
              {!isReadOnly && (
                <div className={` rounded-xl p-2 flex gap-2`}>
                  <button
                    onClick={() => setExpenseMode('spend')}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                      expenseMode === 'spend'
                        ? `${neumorphStyles.smallInset} text-black`
                        : `${neumorphStyles.small} text-gray-700 ${neumorphStyles.hover}`
                    }`}
                  >
                    돈 쓰기
                  </button>
                  <button
                    onClick={() => setExpenseMode('collect')}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                      expenseMode === 'collect'
                        ? `${neumorphStyles.smallInset} text-black`
                        : `${neumorphStyles.small} text-gray-700 ${neumorphStyles.hover}`
                    }`}
                  >
                    돈 모으기
                  </button>
                </div>
              )}

              <CurrencyAmountInput
                amount={amount}
                currency={currency}
                onAmountChange={setAmount}
                onCurrencyChange={setCurrency}
                disabled={isReadOnly}
              />

              {/* 지출 형태 */}
              <div className={` rounded-xl p-4`}>
                <div className="flex items-center gap-10">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    지출형태<span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2 flex-1">
                    <button
                      onClick={() => !isReadOnly && setPaymentMethod('CASH')}
                      disabled={isReadOnly}
                      className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                        paymentMethod === 'CASH'
                          ? expenseModalOrangeButton
                          : `${neumorphStyles.small} text-gray-700 ${!isReadOnly ? neumorphStyles.hover : 'opacity-50 cursor-not-allowed'}`
                      }`}
                    >
                      현금
                    </button>
                    <button
                      onClick={() => !isReadOnly && setPaymentMethod('CARD')}
                      disabled={isReadOnly}
                      className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                        paymentMethod === 'CARD'
                          ? expenseModalOrangeButton
                          : `${neumorphStyles.small} text-gray-700 ${!isReadOnly ? neumorphStyles.hover : 'opacity-50 cursor-not-allowed'}`
                      }`}
                    >
                      카드
                    </button>
                  </div>
                </div>
              </div>

              {/* 카테고리 */}
              {expenseMode === 'spend' && (
                <CategorySelector
                  category={category}
                  onCategoryChange={setCategory}
                  disabled={isReadOnly}
                />
              )}

              {/* 지출 내용 */}
              <div className={`rounded-xl p-4`}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  지출내용<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) =>
                    !isReadOnly && setDescription(e.target.value)
                  }
                  placeholder="내용을 입력해주세요"
                  disabled={isReadOnly}
                  className={`w-full px-4 py-2 ${neumorphStyles.smallInset} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C4B] ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>

              {/* 지출 날짜 */}
              <div className={`rounded-xl p-4`}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  지출날짜<span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {dateOptions.map((dateOption) => (
                    <button
                      key={dateOption.value}
                      onClick={() =>
                        !isReadOnly && setExpenseDate(dateOption.value)
                      }
                      disabled={isReadOnly}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-all text-left flex items-center justify-between ${
                        expenseDate === dateOption.value
                          ? dateOption.isPrep
                            ? 'bg-[#6EAB5B] text-white'
                            : scrapListStyles.selectedOrangeButton
                          : `${neumorphStyles.small} text-gray-700 ${!isReadOnly ? neumorphStyles.hover : 'opacity-50 cursor-not-allowed'}`
                      }`}
                    >
                      <span>
                        {dateOption.isPrep && '✈️ '}
                        {dateOption.label}
                      </span>
                      {expenseDate === dateOption.value && (
                        <span className="text-lg">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 정산 방법 (공동 모드일 때만) */}
              {expenseType === 'SHARED' && (
                <div className={`rounded-xl p-4`}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    정산방법<span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        !isReadOnly && setSettlementMethod('SHARED')
                      }
                      disabled={isReadOnly}
                      className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                        settlementMethod === 'SHARED'
                          ? expenseModalOrangeButton
                          : `${neumorphStyles.small} text-gray-700 ${!isReadOnly ? neumorphStyles.hover : 'opacity-50 cursor-not-allowed'}`
                      }`}
                    >
                      공동경비로 1/N
                    </button>
                    <button
                      onClick={() =>
                        !isReadOnly && setSettlementMethod('DIRECT')
                      }
                      disabled={isReadOnly}
                      className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                        settlementMethod === 'DIRECT'
                          ? expenseModalOrangeButton
                          : `${neumorphStyles.small} text-gray-700 ${!isReadOnly ? neumorphStyles.hover : 'opacity-50 cursor-not-allowed'}`
                      }`}
                    >
                      직접정산
                    </button>
                  </div>
                </div>
              )}

              {/* 결제자 (공동 모드이고 돈 쓰기일 때만) */}
              {expenseType === 'SHARED' &&
                (settlementMethod === 'SHARED' ||
                  settlementMethod === 'DIRECT') &&
                expenseMode === 'spend' &&
                participants &&
                participants.length > 0 && (
                  <PayerSelector
                    payerId={payerId}
                    participants={participants}
                    onPayerChange={handlePayerChange}
                    disabled={isReadOnly}
                  />
                )}

              {/* 소비자 (1/N 분할) - 공동 모드일 때만 */}
              {expenseType === 'SHARED' &&
                settlementMethod === 'SHARED' &&
                participants &&
                participants.length > 0 && (
                  <ConsumerSelector
                    consumers={consumers}
                    participants={participants}
                    amount={amount}
                    roundingPayer={roundingPayer}
                    expenseMode={expenseMode}
                    settlementMethod={settlementMethod}
                    onConsumerToggle={handleConsumerToggle}
                    onRoundingPayerChange={setRoundingPayer}
                    disabled={isReadOnly}
                  />
                )}

              {/* 소비자 (직접정산) - 공동 모드일 때만 */}
              {expenseType === 'SHARED' &&
                settlementMethod === 'DIRECT' &&
                participants &&
                participants.length > 0 && (
                  <>
                    {showAutoCalculateMessage && (
                      <div className="text-xs text-gray-500 mb-2 px-2 animate-fade-in bg-blue-50 border border-blue-200 rounded-lg p-2">
                        💡 입력하신 금액의 합계로 총 금액이 변경됩니다.
                      </div>
                    )}
                    <ConsumerSelector
                      consumers={consumers}
                      participants={participants}
                      amount={amount}
                      roundingPayer={roundingPayer}
                      expenseMode={expenseMode}
                      settlementMethod={settlementMethod}
                      customAmounts={customAmounts}
                      onConsumerToggle={handleConsumerToggle}
                      onRoundingPayerChange={setRoundingPayer}
                      onCustomAmountChange={setCustomAmounts}
                      disabled={isReadOnly}
                    />
                  </>
                )}

              {/* 수정하기/추가하기 버튼 */}
              {isReadOnly ? (
                <button
                  onClick={() => {
                    if (onEditModeChange) {
                      onEditModeChange(false);
                    }
                  }}
                  className={`w-full py-4 rounded-lg font-medium transition-all ${scrapListStyles.selectedOrangeButton} text-white`}
                >
                  수정하기
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className={`w-full py-4 rounded-lg font-medium transition-all ${
                    neumorphStyles.medium
                  } text-gray-700 hover:bg-[#f5861d] hover:text-white hover:shadow-[inset_2px_2px_4px_#b85a0f,inset_-2px_-2px_4px_#ffa82b]`}
                >
                  {isEditMode ? '수정하기' : '추가하기'}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExpenseModal;
