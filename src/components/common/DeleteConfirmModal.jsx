import React, { useEffect } from 'react';
import {
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { neumorphStyles } from '../../utils/style';

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = '삭제 확인',
  message = '정말로 삭제하시겠습니까?',
  confirmText = '삭제',
  cancelText = '취소',
  isLoading = false,
  variant = 'default',
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  const modalShadow = variant === 'trip' ? neumorphStyles.small : neumorphStyles.large;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`${modalShadow} rounded-3xl p-8 w-full max-w-md`}
      >
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={`${neumorphStyles.small} rounded-full p-2`}>
              <ExclamationTriangleIcon className="w-6 h-6 text-[#FF8C4B]" />
            </div>
            <h2 className="text-2xl font-bold text-[#252422]">{title}</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`${neumorphStyles.small} ${neumorphStyles.hover} w-10 h-10 rounded-full flex items-center justify-center text-[#252422] text-xl disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-8">
          <p className="text-lg text-[#252422] leading-relaxed">{message}</p>
          <p className="text-sm text-gray-600 mt-2">
            이 작업은 되돌릴 수 없습니다.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`${neumorphStyles.small} ${neumorphStyles.hover} flex-1 py-3 px-6 rounded-2xl font-semibold text-[#252422] disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`${neumorphStyles.small} ${neumorphStyles.hover} flex-1 py-3 px-6 rounded-2xl font-semibold text-[#FF8C4B] bg-[#f0f0f3] hover:bg-[#FF8C4B] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#FF8C4B] border-t-transparent"></div>
                삭제 중...
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
