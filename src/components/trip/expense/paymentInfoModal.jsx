import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { neumorphStyles, scrapListStyles } from '../../../utils/style';
import AccountRegistration from './accountRegistration.jsx';
import KakaoPayLink from './kakaoPayLink.jsx';

const PaymentInfoModal = ({ isOpen, onClose, onComplete }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  if (!isOpen) return null;

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleBack = () => {
    setSelectedMethod(null);
  };

  const handleComplete = () => {
    setSelectedMethod(null);
    if (onComplete) {
      onComplete();
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
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
            {!selectedMethod ? (
              // 결제정보 등록 방법 선택
              <>
                <div className="sticky top-0 px-6 py-4 flex items-center relative rounded-t-2xl bg-[#f0f0f3]">
                  <button
                    onClick={onClose}
                    className={`${neumorphStyles.small} w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 text-2xl transition-all ${neumorphStyles.hover}`}
                  >
                    ×
                  </button>
                  <h2 className="absolute left-1/2 -translate-x-1/2 text-xl font-base text-gray-800">
                    결제정보 등록
                  </h2>
                </div>

                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-6 text-center">
                    정산을 위해 결제정보를 등록해주세요
                  </p>

                  {/* 계좌 정보 등록 */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMethodSelect('account')}
                    className={`${neumorphStyles.medium} rounded-xl p-4 mb-4 w-full flex items-center gap-4 cursor-pointer transition-all ${neumorphStyles.hover}`}
                  >
                    <div className="w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-[#1e1e1e]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        계좌 정보 등록
                      </h3>
                      <p className="text-sm text-gray-500">
                        이름, 은행, 계좌번호를 입력하세요
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.button>

                  {/* 카카오페이 연동 */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMethodSelect('kakao')}
                    className={`${neumorphStyles.medium} rounded-xl p-4 w-full flex items-center gap-4 cursor-pointer transition-all ${neumorphStyles.hover}`}
                  >
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-gray-200" style={{ backgroundColor: '#ffe300' }}>
                      <span className="text-2xl font-bold text-[#1e1e1e]">K</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        카카오페이 연동
                      </h3>
                      <p className="text-sm text-gray-500">
                        송금코드를 연동하여 간편하게 정산하세요
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.button>
                </div>
              </>
            ) : selectedMethod === 'account' ? (
              <AccountRegistration
                onBack={handleBack}
                onComplete={handleComplete}
              />
            ) : (
              <KakaoPayLink onBack={handleBack} onComplete={handleComplete} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentInfoModal;
