import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from '../../recoil/user';
import useInquiries from '../../hooks/useInquiries';
import { neumorphStyles } from '../../utils/style';

const InquiryForm = ({ isOpen, onClose, onSuccess }) => {
  const user = useRecoilValue(userAtom);
  const { createInquiry, categories } = useInquiries();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    inquiryCategoryId: 5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categoryOptions = categories.map((category) => ({
    value: category.inquiryCategoryId,
    label: category.type,
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createInquiry({
        title: formData.title,
        content: formData.content,
        inquiryCategoryId: formData.inquiryCategoryId,
      });

      setError('');

      setFormData({
        title: '',
        content: '',
        inquiryCategoryId: 5,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('문의 작성 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: '',
        content: '',
        inquiryCategoryId: 5, // '기타' 카테고리 ID로 초기화
      });
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`${neumorphStyles.large} rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#252422]">
            새로운 문의 작성
          </h2>
          <button
            onClick={handleClose}
            className={`${neumorphStyles.small} ${neumorphStyles.hover} w-10 h-10 rounded-full flex items-center justify-center text-[#252422] text-xl`}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              제목 *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`${neumorphStyles.small} ${neumorphStyles.hover} w-full p-3 rounded-2xl text-[#252422] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] border-none`}
              placeholder="문의 제목을 입력해주세요"
              maxLength={200}
              required
              disabled={loading}
            />
            <div className="text-sm text-gray-500 mt-1 text-right">
              {formData.title.length}/200
            </div>
          </div>

          <div>
            <label
              htmlFor="inquiryCategoryId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              카테고리
            </label>
            <select
              id="inquiryCategoryId"
              name="inquiryCategoryId"
              value={formData.inquiryCategoryId}
              onChange={handleInputChange}
              className={`${neumorphStyles.small} ${neumorphStyles.hover} w-full p-3 rounded-2xl text-[#252422] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] border-none`}
              disabled={loading}
            >
              {categoryOptions.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              문의 내용 *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={8}
              maxLength={5000}
              className={`${neumorphStyles.small} ${neumorphStyles.hover} w-full p-3 rounded-2xl text-[#252422] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] border-none`}
              placeholder="문의 내용을 자세히 입력해주세요"
              required
              disabled={loading}
            />
            <div className="text-sm text-gray-500 mt-1 text-right">
              {formData.content.length}/5000
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className={`${neumorphStyles.small} ${neumorphStyles.hover} px-6 py-2 rounded-xl text-[#252422] font-semibold`}
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className={`${neumorphStyles.small} ${neumorphStyles.hover} px-6 py-2 rounded-xl text-[#252422] font-semibold`}
              disabled={loading}
            >
              {loading ? '작성 중...' : '문의 작성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InquiryForm;
