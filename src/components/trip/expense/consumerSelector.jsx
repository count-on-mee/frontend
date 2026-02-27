import React from 'react';
import { neumorphStyles } from '../../../utils/style';

const ConsumerSelector = ({
  consumers,
  participants,
  amount,
  roundingPayer,
  expenseMode,
  settlementMethod,
  customAmounts,
  onConsumerToggle,
  onRoundingPayerChange,
  onCustomAmountChange,
  disabled = false,
}) => {
  const totalAmount = parseInt(amount.replace(/[^0-9]/g, '') || '0');
  const isDirectSettlement = settlementMethod === 'DIRECT';
  const sharedAmount =
    !isDirectSettlement && consumers.length > 0
      ? Math.floor(totalAmount / consumers.length)
      : 0;
  const roundingAmount =
    !isDirectSettlement && consumers.length > 0
      ? totalAmount % consumers.length
      : 0;

  const handleCustomAmountChange = (userId, value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    onCustomAmountChange((prev) => ({
      ...prev,
      [userId]: numericValue,
    }));
  };

  return (
    <div className={`rounded-xl p-4`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {expenseMode === 'collect' ? '돈 낼 사람' : '소비자'}{' '}
        {isDirectSettlement ? '(직접정산)' : '(1/N 분할)'}
        <span className="text-red-500">*</span>
      </label>
      <div className="space-y-2">
        {participants.map((participant) => {
          const isSelected = consumers.includes(participant.userId);
          const customAmount = customAmounts?.[participant.userId] || '';

          return (
            <div key={participant.userId} className="flex items-center gap-2">
              <button
                onClick={() =>
                  !disabled && onConsumerToggle(participant.userId)
                }
                disabled={disabled}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all text-left flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#6EAB5B] text-white'
                    : `${neumorphStyles.small} text-gray-700 ${!disabled ? neumorphStyles.hover : 'opacity-50 cursor-not-allowed'}`
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
                {isSelected && !isDirectSettlement && (
                  <span className="text-lg">✓</span>
                )}
              </button>
              {isDirectSettlement && isSelected && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={customAmount || ''}
                    onChange={(e) => {
                      if (disabled) return;
                      e.stopPropagation();
                      handleCustomAmountChange(
                        participant.userId,
                        e.target.value,
                      );
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (['.', ',', '-', '+', 'e', 'E'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    disabled={disabled}
                    placeholder="금액"
                    className={`w-24 px-3 py-2 ${neumorphStyles.smallInset} rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#FF8C4B] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  <span className="text-sm text-gray-600">원</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {settlementMethod !== 'DIRECT' &&
        !isDirectSettlement &&
        consumers.length > 0 &&
        amount && (
          <div className="mt-3 space-y-2">
            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span>1/N 분할 금액:</span>
                <span className="font-semibold text-gray-800">
                  {sharedAmount.toLocaleString()}원
                </span>
              </div>
              {roundingAmount > 0 && (
                <div className="flex justify-between items-center text-xs text-orange-600 mt-1 pt-1 border-t border-gray-200">
                  <span>나머지 금액:</span>
                  <span className="font-semibold">{roundingAmount}원</span>
                </div>
              )}
            </div>
            {roundingAmount > 0 && (
              <div className="mt-2">
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  나머지 {roundingAmount}원은 누가 부담할까요?
                </label>
                <div className="space-y-1">
                  {consumers.map((userId) => {
                    const participant = participants.find(
                      (p) => p.userId === userId,
                    );
                    if (!participant) return null;
                    return (
                      <button
                        key={userId}
                        onClick={() =>
                          !disabled && onRoundingPayerChange(userId)
                        }
                        disabled={disabled}
                        className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all text-left flex items-center justify-between ${
                          roundingPayer === userId
                            ? 'bg-orange-100 text-orange-700 border-2 border-orange-400'
                            : `${neumorphStyles.small} text-gray-700 ${!disabled ? neumorphStyles.hover : 'opacity-50 cursor-not-allowed'}`
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {participant.imgUrl ? (
                            <img
                              src={participant.imgUrl}
                              alt={participant.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-xs text-gray-600">
                                {participant.name?.[0] || '?'}
                              </span>
                            </div>
                          )}
                          <span>
                            {participant.name || participant.nickname}
                          </span>
                        </div>
                        {roundingPayer === userId && (
                          <span className="text-sm">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default ConsumerSelector;
