import React, { useState, useEffect } from 'react';
import useCrud from '../../hooks/useCrud';
import { neumorphStyles, componentStyles } from '../../utils/style';

const FaqModal = ({
  isOpen,
  onClose,
  faq = null,
  onSuccess,
  mode = 'create',
}) => {
  const [faqCategoryType, setFaqCategoryType] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { createFaq, updateFaq, deleteFaq, loading, error, clearError } =
    useCrud('/support/faqs', 'FAQ');

  const categories = [
    { value: '계정', label: '계정' },
    { value: '앱 이용', label: '서비스 이용' },
    { value: '스팟', label: '스팟' },
    { value: '큐레이션', label: '큐레이션' },
    { value: '기타', label: '기타' },
  ];

  useEffect(() => {
    if (faq && mode === 'edit') {
      setFaqCategoryType(faq.faqCategoryType || '');
      setQuestion(faq.question || '');
      setAnswer(faq.answer || '');
    } else {
      setFaqCategoryType('');
      setQuestion('');
      setAnswer('');
    }
    clearError();
  }, [faq, mode, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!faqCategoryType || !question.trim() || !answer.trim()) {
      alert('카테고리, 질문, 답변을 모두 입력해주세요.');
      return;
    }

    try {
      if (mode === 'create') {
        await createFaq({
          faqCategoryType,
          question: question.trim(),
          answer: answer.trim(),
        });
      } else if (mode === 'edit') {
        await updateFaq(faq.faqId, {
          faqCategoryType,
          question: question.trim(),
          answer: answer.trim(),
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('FAQ 처리 실패:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFaq(faq.faqId);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('FAQ 삭제 실패:', err);
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
            {mode === 'create' ? 'FAQ 등록' : 'FAQ 수정'}
          </h2>
          <button
            onClick={onClose}
            className={`${neumorphStyles.small} ${neumorphStyles.hover} w-10 h-10 rounded-full flex items-center justify-center text-[#252422] text-xl`}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 *
            </label>
            <select
              value={faqCategoryType}
              onChange={(e) => setFaqCategoryType(e.target.value)}
              className={`${neumorphStyles.small} ${neumorphStyles.hover} w-full p-3 rounded-2xl text-[#252422] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] border-none`}
              required
            >
              <option value="">카테고리를 선택하세요</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              질문 *
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={`${neumorphStyles.small} ${neumorphStyles.hover} w-full p-3 rounded-2xl text-[#252422] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] border-none`}
              placeholder="질문을 입력하세요"
              rows={4}
              maxLength={500}
              required
            />
            <div className="text-sm text-gray-500 mt-1 text-right">
              {question.length}/500
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              답변 *
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className={`${neumorphStyles.small} ${neumorphStyles.hover} w-full p-3 rounded-2xl text-[#252422] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] border-none`}
              placeholder="답변을 입력하세요"
              rows={6}
              maxLength={2000}
              required
            />
            <div className="text-sm text-gray-500 mt-1 text-right">
              {answer.length}/2000
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            {mode === 'edit' && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className={`${neumorphStyles.small} ${neumorphStyles.hover} px-6 py-2 rounded-xl text-red-600 font-semibold`}
                disabled={loading}
              >
                삭제
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
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
              {loading ? '처리중...' : mode === 'create' ? '등록' : '수정'}
            </button>
          </div>
        </form>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${neumorphStyles.medium} rounded-2xl p-6 max-w-md w-full`}
          >
            <h3 className="text-xl font-bold text-[#252422] mb-4">FAQ 삭제</h3>
            <p className="text-gray-600 mb-6">
              이 FAQ를 삭제하시겠습니까?
              <br />
              삭제된 FAQ는 복구할 수 없습니다.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={`${neumorphStyles.small} ${neumorphStyles.hover} px-4 py-2 rounded-xl text-[#252422] font-semibold`}
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className={`${neumorphStyles.small} ${neumorphStyles.hover} px-4 py-2 rounded-xl text-red-600 font-semibold`}
                disabled={loading}
              >
                {loading ? '삭제중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqModal;
