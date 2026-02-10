import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../../utils/axiosInstance';
import { neumorphStyles, scrapListStyles } from '../../../utils/style';
import kakaoPay1 from '../../../assets/kakaoPay1.png';
import kakaoPay2 from '../../../assets/kakaoPay2.png';
import kakaoPay3 from '../../../assets/kakaoPay3.png';

const KakaoPayLink = ({ onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  const [remittanceCode, setRemittanceCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const handleLinkCopy = () => {
    alert('카카오톡에서 링크를 복사해주세요.');
  };

  const extractRemittanceCode = (input) => {
    if (!input) return '';
    
    const urlPattern = /https?:\/\/qr\.kakaopay\.com\/([^\/\s]+)/;
    const match = input.match(urlPattern);
    
    if (match && match[1]) {
      return match[1];
    }
    
    return input;
  };

  const handleCodeChange = (e) => {
    const input = e.target.value;
    const extractedCode = extractRemittanceCode(input);
    setRemittanceCode(extractedCode);
  };

  const handleSubmit = async () => {
    if (!remittanceCode.trim()) {
      alert('송금코드를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const codeToSubmit = extractRemittanceCode(remittanceCode);
      await api.patch('/users/me', {
        kakaoPayId: codeToSubmit.trim(),
      });

      const response = await api.get('/users/me');
      if (response.data.kakaoPayId) {
        alert('카카오페이 연동이 완료되었습니다.');
        if (onComplete) {
          onComplete();
        }
      } else {
        throw new Error('카카오페이 연동에 실패했습니다.');
      }
    } catch (error) {
      console.error('카카오페이 연동 실패:', error);
      alert(
        error.response?.data?.message ||
          '카카오페이 연동에 실패했습니다. 다시 시도해주세요.',
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="p-6">
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                카카오톡 더보기 상단의 <strong>QR코드</strong> 아이콘을
                눌러주세요
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src={kakaoPay1}
                alt="카카오페이 연동 1단계"
                className="w-full max-w-sm rounded-xl"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="p-6">
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                하단 세 개 버튼 중 <strong>송금코드</strong> 버튼을
                눌러주세요
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src={kakaoPay2}
                alt="카카오페이 연동 2단계"
                className="w-full max-w-sm rounded-xl"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="p-6">
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                QR코드 바로 아래 <strong>링크복사</strong> 버튼을
                눌러주세요!
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src={kakaoPay3}
                alt="카카오페이 연동 3단계"
                className="w-full max-w-sm rounded-xl"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                송금코드 입력
              </h3>
              <p className="text-sm text-gray-600">
                카카오페이에서 확인한 송금코드를 입력하세요
              </p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                송금코드
              </label>
              <input
                type="text"
                value={remittanceCode}
                onChange={handleCodeChange}
                onPaste={(e) => {
                  e.preventDefault();
                  const pastedText = e.clipboardData.getData('text');
                  const extractedCode = extractRemittanceCode(pastedText);
                  setRemittanceCode(extractedCode);
                }}
                placeholder="Ej81ni061 또는 https://qr.kakaopay.com/..."
                className={`w-full px-4 py-3 ${neumorphStyles.smallInset} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C4B]`}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handlePrevious}
                className={`flex-1 py-3 ${neumorphStyles.small} rounded-lg font-medium text-gray-700 transition-all ${neumorphStyles.hover}`}
              >
                이전
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`flex-1 py-3 ${neumorphStyles.small} rounded-lg font-medium text-gray-700 transition-all ${neumorphStyles.hover} ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? '연동 중...' : '연동하기'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="sticky top-0 px-6 py-4 flex items-center relative rounded-t-2xl bg-[#f0f0f3]">
        <button
          onClick={handlePrevious}
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
          카카오페이 연동
        </h2>
      </div>

      {/* 진행 단계 표시 */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((num) => (
            <React.Fragment key={num}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  num <= step
                    ? 'bg-orange-400 text-white'
                    : 'bg-gray-300 text-gray-500'
                }`}
              >
                {num}
              </div>
              {num < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    num < step ? 'bg-orange-400' : 'bg-gray-300'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 단계별 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">{renderStepContent()}</div>

      {/* 하단 버튼 */}
      {step < 4 && (
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleNext}
            className={`w-full py-3 ${scrapListStyles.selectedOrangeButton} rounded-lg font-medium transition-all`}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default KakaoPayLink;
