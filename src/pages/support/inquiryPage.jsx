import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from '../../recoil/user';
import { neumorphStyles, componentStyles } from '../../utils/style';
import inquiryIcon from '../../assets/inquiry.png';
import InquiryList from '../../components/support/inquiryList';
import InquiryForm from '../../components/support/inquiryForm';
import { PlusIcon } from '@heroicons/react/24/outline';
import useAdmin from '../../hooks/useAdmin';

const InquiryPage = () => {
  const user = useRecoilValue(userAtom);
  const { isAdmin } = useAdmin();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleFormSuccess = () => {
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="w-full">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#252422] px-6 py-3 flex items-center gap-3 mb-6">
            <img
              src={inquiryIcon}
              alt="1:1 문의"
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
            />
            1:1 문의
          </h2>
          <div
            className={`${neumorphStyles.small} ${neumorphStyles.hover} rounded-2xl p-8 text-center`}
          >
            <div className="text-lg text-gray-600">
              문의를 작성하려면 로그인이 필요합니다.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#252422] px-6 py-3 flex items-center gap-3">
            <img
              src={inquiryIcon}
              alt="1:1 문의"
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
            />
            1:1 문의
          </h2>
          {!isAdmin && (
            <button
              onClick={() => setIsFormOpen(true)}
              className={`${componentStyles.button.primary} ${neumorphStyles.small} ${neumorphStyles.hover} px-4 py-2 flex items-center gap-2`}
              style={{ color: 'black' }}
            >
              <PlusIcon className="w-5 h-5" />새 문의
            </button>
          )}
        </div>

        <InquiryList />

        <InquiryForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleFormSuccess}
        />
      </div>
    </div>
  );
};

export default InquiryPage;
