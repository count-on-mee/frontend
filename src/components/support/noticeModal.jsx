import React, { useState, useEffect } from 'react';
import useCrud from '../../hooks/useCrud';
import { neumorphStyles } from '../../utils/style';

const NoticeModal = ({
  isOpen,
  onClose,
  notice = null,
  onSuccess,
  mode = 'create',
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    createNotice,
    updateNotice,
    deleteNotice,
    loading,
    error,
    clearError,
  } = useCrud('/support/notices', '공지사항');

  useEffect(() => {
    if (notice && mode === 'edit') {
      setTitle(notice.title || '');
      setContent(notice.content || '');
    } else {
      setTitle('');
      setContent('');
    }
    clearError();
  }, [notice, mode, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      if (mode === 'create') {
        await createNotice({ title: title.trim(), content: content.trim() });
      } else if (mode === 'edit') {
        await updateNotice(notice.noticeId, {
          title: title.trim(),
          content: content.trim(),
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Notice 처리 실패:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNotice(notice.noticeId);
      onSuccess('delete');
      onClose();
    } catch (err) {
      console.error('Notice 삭제 실패:', err);
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
            {mode === 'create' ? '공지사항 등록' : '공지사항 수정'}
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
              제목 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`${neumorphStyles.small} ${neumorphStyles.hover} w-full p-3 rounded-2xl text-[#252422] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] border-none`}
              placeholder="공지사항 제목을 입력하세요"
              maxLength={200}
              required
            />
            <div className="text-sm text-gray-500 mt-1 text-right">
              {title.length}/200
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용 *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`${neumorphStyles.small} ${neumorphStyles.hover} w-full p-3 rounded-2xl text-[#252422] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] border-none`}
              placeholder="공지사항 내용을 입력하세요"
              rows={8}
              maxLength={5000}
              required
            />
            <div className="text-sm text-gray-500 mt-1 text-right">
              {content.length}/5000
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
              {loading ? '처리 중...' : mode === 'create' ? '등록' : '수정'}
            </button>
          </div>
        </form>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${neumorphStyles.medium} rounded-2xl p-6 max-w-md w-full`}
          >
            <h3 className="text-xl font-bold text-[#252422] mb-4">
              공지사항 삭제
            </h3>
            <p className="text-gray-600 mb-6">
              정말로 이 공지사항을 삭제하시겠습니까?
              <br />
              삭제된 공지사항은 복구할 수 없습니다.
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
                {loading ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeModal;
