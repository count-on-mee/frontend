import React from 'react';
import { neumorphStyles, componentStyles } from '../utils/style';

const InquiryForm = ({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
  submitting,
}) => {
  return (
    <div
      className={`${neumorphStyles.small} ${neumorphStyles.hover} rounded-2xl p-6 mb-6`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg sm:text-xl font-medium text-[#252422]">
          새 문의 작성
        </h3>
        <button
          onClick={onCancel}
          className={`text-[#FF8C4B] hover:text-[#D54E23] text-base sm:text-lg ${neumorphStyles.small} ${neumorphStyles.hover} px-4 py-2 rounded-xl`}
        >
          취소
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#252422] mb-2">
            문의 유형
          </label>
          <select
            name="inquiryCategoryType"
            value={formData.inquiryCategoryType}
            onChange={onInputChange}
            className={`w-full p-3 rounded-xl border-0 ${neumorphStyles.smallInset} focus:outline-none focus:ring-2 focus:ring-[#D54E23] text-[#252422] appearance-none bg-no-repeat bg-right pr-10`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1.5em 1.5em',
            }}
          >
            <option value="GENERAL">일반</option>
            <option value="ACCOUNT">계정</option>
            <option value="PAYMENT">결제</option>
            <option value="TECHNICAL">기술지원</option>
            <option value="BUG_REPORT">버그신고</option>
            <option value="FEATURE_REQUEST">기능요청</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#252422] mb-2">
            제목
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            placeholder="문의 제목을 입력해주세요"
            className={`w-full p-3 rounded-xl border-0 ${neumorphStyles.smallInset} focus:outline-none focus:ring-2 focus:ring-[#FF8C4B] text-[#252422]`}
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#252422] mb-2">
            문의 내용
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={onInputChange}
            placeholder="문의 내용을 자세히 입력해주세요"
            rows={6}
            className={`w-full p-3 rounded-xl border-0 ${neumorphStyles.smallInset} focus:outline-none focus:ring-2 focus:ring-[#FF8C4B] text-[#252422] resize-none`}
            maxLength={1000}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className={`px-6 py-2 rounded-xl text-[#252422] ${neumorphStyles.small} ${neumorphStyles.hover}`}
            disabled={submitting}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`${componentStyles.button.primary} ${neumorphStyles.small} ${neumorphStyles.hover} px-6 py-2 rounded-xl`}
          >
            {submitting ? '등록 중...' : '문의 등록'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;
