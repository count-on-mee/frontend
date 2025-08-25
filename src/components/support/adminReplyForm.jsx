import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from '../../recoil/user';
import useInquiries from '../../hooks/useInquiries';
import { neumorphStyles, componentStyles } from '../../utils/style';
import replyIcon from '../../assets/reply.png';

const AdminReplyForm = ({ inquiry, isOpen, onClose, onSuccess }) => {
  const user = useRecoilValue(userAtom);
  const { replyToInquiry } = useInquiries();
  const [reply, setReply] = useState(inquiry?.reply || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user?.role !== 'admin') {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reply.trim()) {
      setError('답변 내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await replyToInquiry(inquiry.inquiryId, {
        reply: reply.trim(),
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError('답변 등록에 실패했습니다. 다시 시도해주세요.');
      console.error('답변 등록 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setReply(inquiry?.reply || '');
      setError('');
      onClose();
    }
  };

  if (!isOpen || !inquiry) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`${neumorphStyles.large} rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#252422] flex items-center gap-2">
            <img src={replyIcon} alt="답변" className="w-10 h-10" />
            문의 답변
          </h2>
          <button
            onClick={handleClose}
            className={`${neumorphStyles.small} ${neumorphStyles.hover} w-10 h-10 rounded-full flex items-center justify-center text-[#252422] text-xl`}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            문의 내용
          </label>
          <div className={`${neumorphStyles.small} p-4 rounded-2xl`}>
            <p className="text-[#252422] text-sm">{inquiry.content}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="reply"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              답변 내용 *
            </label>
            <textarea
              id="reply"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={6}
              maxLength={2000}
              className={`${neumorphStyles.small} ${neumorphStyles.hover} w-full p-3 rounded-2xl text-[#252422] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] border-none`}
              placeholder="문의에 대한 답변을 입력해주세요"
              required
              disabled={loading}
            />
            <div className="text-sm text-gray-500 mt-1 text-right">
              {reply.length}/2000
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
              {loading ? '등록 중...' : '답변 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminReplyForm;
