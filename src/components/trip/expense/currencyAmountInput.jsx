import React, { useState, useEffect } from 'react';
import { neumorphStyles } from '../../../utils/style';
import { CURRENCY_OPTIONS } from './expenseConstants';

const CurrencyAmountInput = ({
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
  disabled = false,
}) => {
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const currentCurrency = CURRENCY_OPTIONS.find((c) => c.code === currency);

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

  return (
    <div
      className={`${neumorphStyles.medium} rounded-xl p-4 relative currency-dropdown`}
    >
      <div className="text-sm text-gray-500 mb-2 flex items-center justify-between">
        <span>
          {currentCurrency?.code || 'KRW'} (
          {currentCurrency?.name || '대한민국 원'})
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
        <div
          className={`absolute top-12 right-4 z-10 ${neumorphStyles.medium} rounded-lg min-w-[200px] overflow-hidden`}
        >
          {CURRENCY_OPTIONS.map((curr) => (
            <button
              key={curr.code}
              onClick={() => {
                onCurrencyChange(curr.code);
                setIsCurrencyOpen(false);
              }}
              className={`w-full text-left px-4 py-2 transition-all ${
                currency === curr.code
                  ? 'bg-[#f5861d] text-white'
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
        inputMode="numeric"
        pattern="[0-9]*"
        value={amount}
        onChange={(e) => {
          if (disabled) return;
          const value = e.target.value.replace(/[^0-9]/g, '');
          onAmountChange(value);
        }}
        onKeyDown={(e) => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          const blockedKeys = ['.', ',', '-', '+', 'e', 'E'];
          if (blockedKeys.includes(e.key)) {
            e.preventDefault();
          }
        }}
        disabled={disabled}
        placeholder="0"
        className={`text-3xl font-bold bg-transparent border-none outline-none w-full ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      />
      <div className="text-sm text-gray-400 mt-2">
        = {parseInt(amount || 0).toLocaleString()}
        {currentCurrency?.symbol || '원'}
      </div>
    </div>
  );
};

export default CurrencyAmountInput;
