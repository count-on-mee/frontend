import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../../utils/axiosInstance';
import { neumorphStyles, scrapListStyles } from '../../../utils/style';
import { BANKS } from './settlement.jsx';

const AccountRegistration = ({ onBack, onComplete }) => {
  const [depositorName, setDepositorName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!depositorName.trim()) {
      alert('예금주명을 입력해주세요.');
      return;
    }
    if (!bankName) {
      alert('은행을 선택해주세요.');
      return;
    }
    if (!accountNumber.trim()) {
      alert('계좌번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await api.patch('/users/me', {
        bankName,
        accountNumber: accountNumber.replace(/-/g, ''),
        accountHolderName: depositorName,
      });
      alert('계좌정보가 등록되었습니다.');
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('계좌정보 등록 실패:', error);
      alert(
        error.response?.data?.message ||
          '계좌정보 등록에 실패했습니다. 다시 시도해주세요.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="sticky top-0 px-6 py-4 flex items-center relative rounded-t-2xl bg-[#f0f0f3]">
        <button
          onClick={onBack}
          className={`${neumorphStyles.small} w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all ${neumorphStyles.hover}`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="absolute left-1/2 -translate-x-1/2 text-xl font-base text-gray-800">
          계좌 정보 등록
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* 예금주명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            예금주명
          </label>
          <input
            type="text"
            value={depositorName}
            onChange={(e) => setDepositorName(e.target.value)}
            placeholder="이름을 입력하세요"
            className={`w-full px-4 py-3 ${neumorphStyles.smallInset} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C4B]`}
          />
        </div>

        {/* 주 사용 은행 */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            주 사용 은행
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
              className={`w-full px-4 py-3 ${neumorphStyles.smallInset} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C4B] flex items-center justify-between text-left ${
                !bankName ? 'text-gray-400' : 'text-gray-800'
              }`}
            >
              <span>{bankName || '은행을 선택하세요'}</span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isBankDropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isBankDropdownOpen && (
              <div
                className={`absolute z-10 w-full mt-2 ${neumorphStyles.medium} rounded-lg max-h-60 overflow-y-auto`}
              >
                {BANKS.map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => {
                      setBankName(bank);
                      setIsBankDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 transition-all ${
                      bankName === bank
                        ? scrapListStyles.expenseModalOrangeButton
                        : 'text-gray-700 hover:bg-gray-200/50'
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 계좌번호 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            계좌번호
          </label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9-]/g, '');
              setAccountNumber(value);
            }}
            placeholder="계좌번호를 입력하세요 (- 제외)"
            className={`w-full px-4 py-3 ${neumorphStyles.smallInset} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C4B]`}
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            className={`flex-1 py-3 ${neumorphStyles.small} rounded-lg font-medium text-gray-700 transition-all ${neumorphStyles.hover}`}
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`flex-1 py-3 ${scrapListStyles.selectedOrangeButton} rounded-lg font-medium transition-all ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? '등록 중...' : '등록하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountRegistration;
