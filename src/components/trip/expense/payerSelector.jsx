import React from 'react';
import { neumorphStyles } from '../../../utils/style';
import { scrapListStyles } from '../../../utils/style';

const expenseModalOrangeButton = scrapListStyles.expenseModalOrangeButton;

const PayerSelector = ({
  payerId,
  participants,
  onPayerChange,
  disabled = false,
}) => {
  return (
    <div className={` rounded-xl p-4`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        결제자<span className="text-red-500">*</span>
      </label>
      <div className="space-y-2">
        <button
          onClick={() => !disabled && onPayerChange('COMMON')}
          disabled={disabled}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all text-left flex items-center justify-between ${
            payerId === 'COMMON'
              ? expenseModalOrangeButton
              : `${neumorphStyles.small} text-gray-700 ${!disabled ? neumorphStyles.hover : 'opacity-50 cursor-not-allowed'}`
          }`}
        >
          <span>공동경비로 결제</span>
          {payerId === 'COMMON' && <span className="text-lg">✓</span>}
        </button>
        {participants.map((participant) => (
          <button
            key={participant.userId}
            onClick={() => !disabled && onPayerChange(participant.userId)}
            disabled={disabled}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all text-left flex items-center justify-between ${
              payerId === participant.userId
                ? expenseModalOrangeButton
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
            {payerId === participant.userId && (
              <span className="text-lg">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PayerSelector;
