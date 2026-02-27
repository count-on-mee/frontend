import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import tripDatesAtom from '../../../recoil/tripDates';
import userAtom from '../../../recoil/user';
import ExpenseModal from './expenseModal.jsx';
import Settlement from './settlement.jsx';
import Statistics from './statistic/statistics.jsx';
import DeleteConfirmModal from '../../common/DeleteConfirmModal.jsx';
import {
  neumorphStyles,
  tabButtonStyles,
  scrapListStyles,
} from '../../../utils/style';
import receiptIcon from '../../../assets/receipt.png';
import paymentIcon from '../../../assets/payment.png';
import chartIcon from '../../../assets/chart.png';
import airplaneIcon from '../../../assets/airplane.png';
import trainIcon from '../../../assets/train.png';
import foodIcon from '../../../assets/food.png';
import tourIcon from '../../../assets/tour.png';
import cruiseIcon from '../../../assets/cruise.png';
import shoppingIcon from '../../../assets/shopping.png';
import hotelIcon from '../../../assets/hotel.png';
import binIcon from '../../../assets/bin.png';
import editIcon from '../../../assets/edit.png';

const CATEGORY_MAP = {
  TRANSPORTATION: '교통',
  MEAL: '식비',
  ACCOMMODATION: '숙박',
  TOUR: '관광',
  ACTIVITY: '액티비티',
  SHOPPING: '쇼핑',
  BUDGET: '공동경비',
};

const CATEGORY_ICONS = {
  TRANSPORTATION: trainIcon,
  MEAL: foodIcon,
  ACCOMMODATION: hotelIcon,
  TOUR: tourIcon,
  ACTIVITY: cruiseIcon,
  SHOPPING: shoppingIcon,
  BUDGET: receiptIcon,
};

const getAvatarColor = (index) => {
  const colors = [
    'bg-orange-400',
    'bg-green-400',
    'bg-blue-400',
    'bg-purple-400',
    'bg-pink-400',
    'bg-yellow-400',
  ];
  return colors[index % colors.length];
};

const AccountBook = ({
  socket,
  tripId,
  expenses,
  statistics,
  participants,
  onExpenseUpdate,
}) => {
  const [activeSubTab, setActiveSubTab] = useState('accountBook');
  const [expenseType, setExpenseType] = useState('SHARED');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const tripDates = useRecoilValue(tripDatesAtom);
  const user = useRecoilValue(userAtom);

  const dateOptions = React.useMemo(() => {
    const dates = [];
    if (tripDates.startDate && tripDates.endDate) {
      const prepDate = new Date(tripDates.startDate);
      prepDate.setDate(prepDate.getDate() - 1);
      dates.push({
        label: '준비',
        value: '1970-01-01',
        date: prepDate,
        isPrep: true,
      });

      const start = new Date(tripDates.startDate);
      const end = new Date(tripDates.endDate);
      const current = new Date(start);

      while (current <= end) {
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = dayNames[current.getDay()];
        dates.push({
          label: `${dayName} ${current.getDate()}`,
          value: current.toISOString().slice(0, 10),
          date: new Date(current),
          isPrep: false,
        });
        current.setDate(current.getDate() + 1);
      }
    }
    return dates;
  }, [tripDates]);

  const filteredExpenses = React.useMemo(() => {
    let filtered = expenses || [];

    if (selectedDate) {
      filtered = filtered.filter((expense) => {
        const normalizedExpenseDate =
          !expense.expenseDate ||
          expense.expenseDate === '' ||
          expense.expenseDate === null ||
          expense.expenseDate === undefined
            ? '1970-01-01'
            : expense.expenseDate;

        const normalizedSelectedDate =
          !selectedDate || selectedDate === '' ? '1970-01-01' : selectedDate;

        return normalizedExpenseDate === normalizedSelectedDate;
      });
    }

    const typeFiltered = filtered.filter(
      (expense) => expense.expenseType === expenseType,
    );

    return typeFiltered;
  }, [expenses, selectedDate, expenseType]);

  // 공동경비에서 결제한 금액 계산 (payUserId가 null인 경우만)
  const totalSpentFromBudget = React.useMemo(() => {
    if (!expenses || expenses.length === 0) return 0;

    return expenses
      .filter(
        (expense) =>
          expense.expenseType === 'SHARED' &&
          expense.expenseCategory !== 'BUDGET' &&
          expense.payUserId === null,
      )
      .reduce((sum, expense) => sum + (expense.totalAmount || 0), 0);
  }, [expenses]);

  // 공동경비 잔액 계산
  const sharedBudgetInfo = React.useMemo(() => {
    if (!statistics?.shared) return null;

    const totalBudget = statistics.shared.totalBudget || 0;
    const remainingBudget = totalBudget - totalSpentFromBudget;

    return {
      totalBudget,
      totalSpentFromBudget,
      remainingBudget,
    };
  }, [statistics?.shared, totalSpentFromBudget]);

  // 개인경비 정보 계산
  const personalBudgetInfo = React.useMemo(() => {
    if (!statistics?.personal) return null;

    const totalBudget = statistics.personal.totalBudget || 0;
    const totalSpent = statistics.personal.totalSpent || 0;
    const remainingBudget = totalBudget - totalSpent;

    return {
      totalBudget,
      totalSpent,
      remainingBudget,
    };
  }, [statistics?.personal]);

  useEffect(() => {
    if (dateOptions.length > 0 && !selectedDate) {
      setSelectedDate(dateOptions[0].value);
    }
  }, [dateOptions, selectedDate]);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsReadOnlyMode(false);
    setShowModal(true);
  };

  const handleViewExpense = (expense) => {
    setEditingExpense(expense);
    setIsReadOnlyMode(true);
    setShowModal(true);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsReadOnlyMode(false);
    setShowModal(true);
  };

  const handleDeleteClick = (expense) => {
    setDeletingExpense(expense);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingExpense) {
      return;
    }

    if (!socket || !socket.connected) {
      alert('서버에 연결되지 않았습니다. 네트워크 연결을 확인해주세요.');
      setShowDeleteModal(false);
      setDeletingExpense(null);
      return;
    }

    setIsDeleting(true);

    socket.emit('deleteExpense', {
      tripDocumentExpenseId: deletingExpense.tripDocumentExpenseId,
    });

    if (onExpenseUpdate) {
      setTimeout(() => {
        onExpenseUpdate();
        setIsDeleting(false);
        setShowDeleteModal(false);
        setDeletingExpense(null);
      }, 500);
    } else {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeletingExpense(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeletingExpense(null);
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString('ko-KR');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveSubTab('accountBook')}
          {...tabButtonStyles.getStyles(activeSubTab === 'accountBook')}
        >
          <div className="flex items-center justify-center">
            <img src={receiptIcon} alt="가계부" className="w-8 h-8 mr-3" />
            <span className="text-lg font-medium text-gray-700">가계부</span>
          </div>
        </button>
        <button
          onClick={() => setActiveSubTab('settlement')}
          {...tabButtonStyles.getStyles(activeSubTab === 'settlement')}
        >
          <div className="flex items-center justify-center">
            <img src={paymentIcon} alt="정산" className="w-8 h-8 mr-3" />
            <span className="text-lg font-medium text-gray-700">정산</span>
          </div>
        </button>
        <button
          onClick={() => setActiveSubTab('statistics')}
          {...tabButtonStyles.getStyles(activeSubTab === 'statistics')}
        >
          <div className="flex items-center justify-center">
            <img src={chartIcon} alt="통계" className="w-8 h-8 mr-3" />
            <span className="text-lg font-medium text-gray-700">통계</span>
          </div>
        </button>
      </div>

      {activeSubTab === 'accountBook' && (
        <>
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setExpenseType('SHARED')}
              {...tabButtonStyles.getStyles(expenseType === 'SHARED', true)}
            >
              <div className="flex items-center justify-center">
                <span className="text-lg font-medium text-gray-700">공동</span>
              </div>
            </button>
            <button
              onClick={() => setExpenseType('PERSONAL')}
              {...tabButtonStyles.getStyles(expenseType === 'PERSONAL', true)}
            >
              <div className="flex items-center justify-center">
                <span className="text-lg font-medium text-gray-700">개인</span>
              </div>
            </button>
          </div>

          {expenseType === 'SHARED' && sharedBudgetInfo && (
            <div
              className={`${neumorphStyles.small} rounded-xl p-6 mb-6 bg-[#f0f0f3]`}
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                공동경비 잔액
              </h3>
              <div className="text-3xl font-bold text-[#252422] mb-4">
                {formatAmount(sharedBudgetInfo.remainingBudget)}원
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">모인돈</span>
                  <span className="font-medium text-gray-700">
                    {formatAmount(sharedBudgetInfo.totalBudget)}원
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">총쓴돈</span>
                  <span className="font-medium text-gray-700">
                    {formatAmount(sharedBudgetInfo.totalSpentFromBudget)}원
                  </span>
                </div>
              </div>
            </div>
          )}

          {expenseType === 'PERSONAL' && personalBudgetInfo && (
            <div
              className={`${neumorphStyles.small} rounded-xl p-6 mb-6 bg-[#f0f0f3]`}
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                개인경비 잔액
              </h3>
              <div className="text-3xl font-bold text-[#252422] mb-4">
                {formatAmount(personalBudgetInfo.remainingBudget)}원
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">모인돈</span>
                  <span className="font-medium text-gray-700">
                    {formatAmount(personalBudgetInfo.totalBudget)}원
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">총쓴돈</span>
                  <span className="font-medium text-gray-700">
                    {formatAmount(personalBudgetInfo.totalSpent)}원
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {dateOptions.map((dateOption) => {
              const isSelected = selectedDate === dateOption.value;
              return (
                <motion.button
                  key={dateOption.value}
                  onClick={() => setSelectedDate(dateOption.value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-full font-medium whitespace-nowrap min-w-fit ${
                    isSelected
                      ? dateOption.isPrep
                        ? 'bg-[#6EAB5B] text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.3)]'
                        : `${scrapListStyles.selectedOrangeButton} shadow-[inset_2px_2px_4px_#b85a0f,inset_-2px_-2px_4px_#ffa82b]`
                      : `${neumorphStyles.smallInset} text-gray-700`
                  }`}
                >
                  {dateOption.isPrep && (
                    <img
                      src={airplaneIcon}
                      alt="준비"
                      className="w-5 h-5 inline-block mr-1"
                    />
                  )}
                  {dateOption.label}
                </motion.button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {filteredExpenses.map((expense) => {
              const expenseParticipants = expense.participants || [];
              const participantProfiles = expenseParticipants
                .map((ep) => {
                  const participant = participants?.find(
                    (p) => p.userId === ep.participantUserId,
                  );
                  return participant;
                })
                .filter(Boolean);

              return (
                <motion.div
                  key={expense.tripDocumentExpenseId}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`${neumorphStyles.smallInset} rounded-xl p-4 mb-3 flex items-center justify-between cursor-pointer overflow-hidden`}
                  onClick={() => handleViewExpense(expense)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${neumorphStyles.small} rounded-full`}
                    >
                      <img
                        src={
                          CATEGORY_ICONS[expense.expenseCategory] || receiptIcon
                        }
                        alt={CATEGORY_MAP[expense.expenseCategory] || '기타'}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 truncate">
                        {expense.description}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {CATEGORY_MAP[expense.expenseCategory] || '기타'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {participantProfiles.length > 0 && (
                      <div className="flex items-center gap-1">
                        {participantProfiles.map((profile, idx) => (
                          <div key={profile.userId} className="flex-shrink-0">
                            {profile.imgUrl ? (
                              <img
                                src={profile.imgUrl}
                                alt={profile.name || profile.nickname}
                                className="w-8  h-8 rounded-full object-cover border border-gray-300"
                              />
                            ) : (
                              <div
                                className={`w-6 h-6 rounded-full ${getAvatarColor(
                                  idx,
                                )} flex items-center justify-center text-white text-xs font-semibold`}
                              >
                                {(profile.name || profile.nickname)?.[0] || '?'}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="text-lg font-semibold text-gray-800 whitespace-nowrap">
                      {expense.expenseCategory === 'BUDGET' ? '+' : '-'}{' '}
                      {formatAmount(expense.totalAmount)}원
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditExpense(expense);
                      }}
                      className={`${neumorphStyles.small} w-8 h-8 rounded-full flex items-center justify-center transition-all ${neumorphStyles.hover} flex-shrink-0`}
                    >
                      <img
                        src={editIcon}
                        alt="수정"
                        className="w-5 h-5 object-contain"
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(expense);
                      }}
                      className={`${neumorphStyles.small} w-8 h-8 rounded-full flex items-center justify-center transition-all ${neumorphStyles.hover} flex-shrink-0`}
                    >
                      <img
                        src={binIcon}
                        alt="삭제"
                        className="w-5 h-5 object-contain"
                      />
                    </button>
                  </div>
                </motion.div>
              );
            })}
            {filteredExpenses.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                지출 내역이 없습니다.
              </div>
            )}
          </div>

          <button
            onClick={handleAddExpense}
            className={`fixed bottom-8 right-8 w-14 h-14 rounded-full transition-all duration-200 flex items-center justify-center text-white text-2xl font-semibold z-10 ${scrapListStyles.selectedOrangeButton}`}
          >
            +
          </button>
        </>
      )}

      {activeSubTab === 'settlement' && (
        <Settlement
          tripId={tripId}
          expenses={expenses}
          statistics={statistics}
          participants={participants}
          currentUserId={user?.userId}
        />
      )}

      {activeSubTab === 'statistics' && (
        <Statistics expenses={expenses} statistics={statistics} />
      )}

      {showModal && (
        <ExpenseModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingExpense(null);
            setIsReadOnlyMode(false);
          }}
          socket={socket}
          tripId={tripId}
          expense={editingExpense}
          participants={participants}
          currentUserId={user?.userId}
          tripDates={tripDates}
          dateOptions={dateOptions}
          onExpenseUpdate={onExpenseUpdate}
          expenseType={expenseType}
          isReadOnly={isReadOnlyMode}
          onEditModeChange={(readOnly) => {
            setIsReadOnlyMode(readOnly);
          }}
        />
      )}

      {showDeleteModal && deletingExpense && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="지출 내역 삭제"
          message={`"${deletingExpense.description || CATEGORY_MAP[deletingExpense.expenseCategory] || '지출 내역'}"을(를) 삭제하시겠습니까?`}
          confirmText="삭제"
          cancelText="취소"
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default AccountBook;
