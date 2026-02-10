import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import trainIcon from '../../../assets/train.png';
import foodIcon from '../../../assets/food.png';
import tourIcon from '../../../assets/tour.png';
import cruiseIcon from '../../../assets/cruise.png';
import shoppingIcon from '../../../assets/shopping.png';
import hotelIcon from '../../../assets/hotel.png';
import { neumorphStyles, scrapListStyles } from '../../../utils/style';

const expenseModalOrangeButton = scrapListStyles.expenseModalOrangeButton;

const CATEGORY_MAP = {
  TRANSPORTATION: '교통',
  MEAL: '식비',
  ACCOMMODATION: '숙박',
  TOUR: '관광',
  ACTIVITY: '액티비티',
  SHOPPING: '쇼핑',
};

const CATEGORY_ICONS = {
  TRANSPORTATION: trainIcon,
  MEAL: foodIcon,
  ACCOMMODATION: hotelIcon,
  TOUR: tourIcon,
  ACTIVITY: cruiseIcon,
  SHOPPING: shoppingIcon,
};

const CURRENCY_OPTIONS = [
  { code: 'KRW', name: '대한민국 원', symbol: '원' },
  { code: 'JPY', name: '일본 엔', symbol: '¥' },
  { code: 'USD', name: '미국 달러', symbol: '$' },
];

const ExpenseModal = ({
  isOpen,
  onClose,
  socket,
  tripId,
  expense,
  participants,
  currentUserId,
  tripDates,
  dateOptions,
  onExpenseUpdate,
}) => {
  const isEditMode = !!expense;

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
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('KRW');
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

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
      setSettlementMethod(expense.expenseType || 'SHARED');
      setPayerId(expense.payUserId || null);
      setAmount(expense.totalAmount?.toString() || '');
      if (expense.participants && expense.participants.length > 0) {
        setConsumers(expense.participants.map((p) => p.participantUserId));
      } else {
        setConsumers([]);
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
      setAmount('');
      setCurrency('KRW');
    }
  }, [isEditMode, expense, dateOptions]);

  useEffect(() => {
    if (
      settlementMethod === 'PERSONAL' &&
      consumers.length === participants?.length &&
      participants?.length > 0
    ) {
      setSettlementMethod('SHARED');
    }
  }, [consumers, participants, settlementMethod]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCurrencyOpen && !event.target.closest('.currency-dropdown')) {
        setIsCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCurrencyOpen]);

  const handleConsumerToggle = (userId) => {
    setConsumers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
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

    if (settlementMethod === 'SHARED') {
      if (!payerId && expenseMode === 'spend') {
        alert('결제자를 선택해주세요.');
        return;
      }
      if (consumers.length === 0) {
        alert(expenseMode === 'collect' ? '돈 낼 사람을 선택해주세요.' : '소비자를 선택해주세요.');
        return;
      }
    } else {
      if (!currentUserId) {
        alert('로그인이 필요합니다.');
        return;
      }
      setPayerId(currentUserId);
      setConsumers([]);
    }

    const totalAmount = parseInt(amount.replace(/[^0-9]/g, ''));

    const serverExpenseDate = expenseDate;

    let expenseData;

    if (expenseMode === 'collect') {
      if (settlementMethod === 'SHARED') {
        const sharedAmount = Math.floor(totalAmount / consumers.length);
        const remainder = totalAmount % consumers.length;
        const participants = consumers.map((userId, index) => ({
          participantUserId: userId,
          sharedAmount:
            index === 0 ? sharedAmount + remainder : sharedAmount,
        }));

        expenseData = {
          expenseCategory: 'BUDGET',
          description: description || '공동경비 추가',
          totalAmount,
          paymentMethod: paymentMethod,
          expenseDate: serverExpenseDate,
          expenseType: 'SHARED',
          payUserId: null,
          participants,
        };
      } else {
        expenseData = {
          expenseCategory: 'BUDGET',
          description: description || '예산',
          totalAmount,
          paymentMethod: paymentMethod,
          expenseDate: serverExpenseDate,
          expenseType: 'PERSONAL',
          payUserId: currentUserId,
          participants: [],
        };
      }
    } else {
      if (settlementMethod === 'SHARED') {
        const sharedAmount = Math.floor(totalAmount / consumers.length);
        const remainder = totalAmount % consumers.length;
        const participants = consumers.map((userId, index) => ({
          participantUserId: userId,
          sharedAmount:
            index === 0 ? sharedAmount + remainder : sharedAmount,
        }));

        expenseData = {
          expenseCategory: category,
          description,
          totalAmount,
          paymentMethod: paymentMethod,
          expenseDate: serverExpenseDate,
          expenseType: 'SHARED',
          payUserId: payerId === 'COMMON' ? null : payerId,
          participants,
        };
      } else {
        expenseData = {
          expenseCategory: category,
          description,
          totalAmount,
          paymentMethod: paymentMethod,
          expenseDate: serverExpenseDate,
          expenseType: 'PERSONAL',
          payUserId: currentUserId,
          participants: [],
        };
      }
    }

    if (!socket || !socket.connected) {
      alert('서버에 연결되지 않았습니다. 네트워크 연결을 확인해주세요.');
      return;
    }


    let hasError = false;
    const errorHandler = (error) => {
      if (hasError) return; 
      hasError = true;
      console.error('지출 저장 중 오류 발생:', error);
      const errorMessage = error?.message || error?.toString() || '알 수 없는 오류';
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
          expenseFields: expenseData,
        });
      } else {
        socket.emit('addExpense', { expenseData });
      }
      if (onExpenseUpdate) {
        const isBudget = expenseData.expenseCategory === 'BUDGET';
        const delay = isBudget ? 1500 : 800;
        
        setTimeout(() => {
          if (!hasError) {
            onExpenseUpdate();
          }
        }, delay);
        
        if (isBudget) {
          setTimeout(() => {
            if (!hasError) {
              onExpenseUpdate();
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
            내역 추가
          </h2>
        </div>


        <div className="p-6 space-y-6">
          {/* 지출 추가 / 공동경비 추가 선택 */}
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

          {/* 금액 입력 */}
          <div className={`${neumorphStyles.medium} rounded-xl p-4 relative currency-dropdown`}>
            <div className="text-sm text-gray-500 mb-2 flex items-center justify-between">
              <span>
                {CURRENCY_OPTIONS.find((c) => c.code === currency)?.code || 'KRW'}{' '}
                ({CURRENCY_OPTIONS.find((c) => c.code === currency)?.name || '대한민국 원'})
              </span>
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className={`text-gray-400 hover:text-gray-600 transition-all ${
                  isCurrencyOpen ? 'rotate-180' : ''
                }`}
              >
                ▼
              </button>
            </div>
            {isCurrencyOpen && (
              <div className={`absolute top-12 right-4 z-10 ${neumorphStyles.medium} rounded-lg min-w-[200px] overflow-hidden`}>
                {CURRENCY_OPTIONS.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setCurrency(curr.code);
                      setIsCurrencyOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 transition-all ${
                      currency === curr.code
                        ? expenseModalOrangeButton
                        : 'text-gray-700 hover:bg-gray-200/50'
                    }`}
                  >
                    {curr.code} ({curr.name})
                  </button>
                ))}
              </div>
            )}
            <input
              type="text"
              value={amount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setAmount(value);
              }}
              placeholder="0"
              className="text-3xl font-bold bg-transparent border-none outline-none w-full"
            />
            <div className="text-sm text-gray-400 mt-2">
              = {parseInt(amount || 0).toLocaleString()}
              {CURRENCY_OPTIONS.find((c) => c.code === currency)?.symbol || '원'}
            </div>
          </div>

          {/* 지출 형태 */}
          <div className={` rounded-xl p-4`}>
            <div className="flex items-center gap-10">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                지출형태<span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 flex-1">
                <button
                  onClick={() => setPaymentMethod('CASH')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    paymentMethod === 'CASH'
                      ? expenseModalOrangeButton
                      : `${neumorphStyles.small} text-gray-700 ${neumorphStyles.hover}`
                  }`}
                >
                  현금
                </button>
                <button
                  onClick={() => setPaymentMethod('CARD')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    paymentMethod === 'CARD'
                      ? expenseModalOrangeButton
                      : `${neumorphStyles.small} text-gray-700 ${neumorphStyles.hover}`
                  }`}
                >
                  카드
                </button>
              </div>
            </div>
          </div>

          {/* 카테고리 (돈 쓰기일 때만) */}
          {expenseMode === 'spend' && (
            <div className={` rounded-xl p-4`}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리<span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(CATEGORY_MAP).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setCategory(key)}
                    className={`py-3 rounded-lg font-medium transition-all ${
                      category === key
                        ? expenseModalOrangeButton
                        : `${neumorphStyles.small} text-gray-700 ${neumorphStyles.hover}`
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
          )}

          {/* 지출 내용 */}
          <div className={`rounded-xl p-4`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              지출내용<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="내용을 입력해주세요"
              className={`w-full px-4 py-2 ${neumorphStyles.smallInset} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C4B]`}
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
                  onClick={() => setExpenseDate(dateOption.value)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all text-left flex items-center justify-between ${
                    expenseDate === dateOption.value
                      ? dateOption.isPrep
                        ? 'bg-[#6EAB5B] text-white'
                        : scrapListStyles.selectedOrangeButton
                      : `${neumorphStyles.small} text-gray-700 ${neumorphStyles.hover}`
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

          {/* 정산 방법 */}
          <div className={`rounded-xl p-4`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              정산방법<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setSettlementMethod('SHARED')}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  settlementMethod === 'SHARED'
                    ? expenseModalOrangeButton
                    : `${neumorphStyles.small} text-gray-700 ${neumorphStyles.hover}`
                }`}
              >
                공동경비로 1/N
              </button>
              <button
                onClick={() => setSettlementMethod('PERSONAL')}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  settlementMethod === 'PERSONAL'
                    ? expenseModalOrangeButton
                    : `${neumorphStyles.small} text-gray-700 ${neumorphStyles.hover}`
                }`}
              >
                개인지출
              </button>
            </div>
          </div>

          {/* 결제자 (공동경비이고 돈 쓰기일 때만) */}
          {settlementMethod === 'SHARED' &&
            expenseMode === 'spend' &&
            participants &&
            participants.length > 0 && (
              <div className={` rounded-xl p-4`}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  결제자<span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setPayerId('COMMON')}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all text-left flex items-center justify-between ${
                      payerId === 'COMMON'
                        ? expenseModalOrangeButton
                        : `${neumorphStyles.small} text-gray-700 ${neumorphStyles.hover}`
                    }`}
                  >
                    <span>공동경비로 결제</span>
                    {payerId === 'COMMON' && (
                      <span className="text-lg">✓</span>
                    )}
                  </button>
                  {participants.map((participant) => (
                    <button
                      key={participant.userId}
                      onClick={() => setPayerId(participant.userId)}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-all text-left flex items-center justify-between ${
                        payerId === participant.userId
                          ? expenseModalOrangeButton
                          : `${neumorphStyles.small} text-gray-700 ${neumorphStyles.hover}`
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {participant.imgUrl ? (
                          <img
                            src={participant.imgUrl}
                            alt={participant.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm text-gray-600">
                              {participant.name?.[0] || '?'}
                            </span>
                          </div>
                        )}
                        <span>{participant.name || participant.nickname}</span>
                      </div>
                      {payerId === participant.userId && (
                        <span className="text-lg">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

          {/* 소비자 (1/N 분할) - 공동경비일 때만 */}
          {settlementMethod === 'SHARED' && participants && (
            <div className={`rounded-xl p-4`}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {expenseMode === 'collect' ? '돈 낼 사람' : '소비자'} (1/N 분할)<span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {participants.map((participant) => (
                  <button
                    key={participant.userId}
                    onClick={() => handleConsumerToggle(participant.userId)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all text-left flex items-center justify-between ${
                      consumers.includes(participant.userId)
                        ? 'bg-[#6EAB5B] text-white'
                        : `${neumorphStyles.small} text-gray-700 ${neumorphStyles.hover}`
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {participant.imgUrl ? (
                        <img
                          src={participant.imgUrl}
                          alt={participant.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm text-gray-600">
                            {participant.name?.[0] || '?'}
                          </span>
                        </div>
                      )}
                      <span>{participant.name || participant.nickname}</span>
                    </div>
                    {consumers.includes(participant.userId) && (
                      <span className="text-lg">✓</span>
                    )}
                  </button>
                ))}
              </div>
              {consumers.length > 0 && (
                <div className="text-sm text-gray-500 mt-2">
                  선택된 {consumers.length}명에게 1/N 분할됩니다
                </div>
              )}
            </div>
          )}

          {/* 추가하기 버튼 */}
          <button
            onClick={handleSubmit}
            className={`w-full py-4 rounded-lg font-medium transition-all ${
              neumorphStyles.medium
            } text-gray-700 hover:bg-[#f5861d] hover:text-white hover:shadow-[inset_2px_2px_4px_#b85a0f,inset_-2px_-2px_4px_#ffa82b]`}
          >
            {isEditMode ? '수정하기' : '추가하기'}
          </button>
        </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExpenseModal;
