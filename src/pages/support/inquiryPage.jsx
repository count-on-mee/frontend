import React from 'react';
import { neumorphStyles } from '../../utils/style';
import inquiryIcon from '../../assets/inquiry.png';

const InquiryPage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2
            className={`text-xl sm:text-2xl lg:text-3xl font-semibold text-[#252422] px-6 py-3 flex items-center gap-3`}
          >
            <img
              src={inquiryIcon}
              alt="1:1 문의"
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
            />
            1:1 문의
          </h2>
        </div>
        <div
          className={`${neumorphStyles.small} ${neumorphStyles.hover} rounded-2xl p-8 text-center`}
        >
          <div className="text-2xl sm:text-3xl font-semibold text-[#252422] mb-4">
            아직 준비중입니다
          </div>
          <div className="text-gray-600 text-base sm:text-lg">
            더 나은 서비스를 위해 준비하고 있습니다.
            <br />
            조금만 기다려주세요!
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryPage;
