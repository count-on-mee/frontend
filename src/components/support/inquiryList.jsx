import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from '../../recoil/user';
import useInquiries from '../../hooks/useInquiries';
import { neumorphStyles, componentStyles } from '../../utils/style';
import { ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import AdminReplyForm from './adminReplyForm';
import replyIcon from '../../assets/reply.png';

const InquiryList = () => {
  const { inquiries, loading, error, deleteInquiry, isAdmin } = useInquiries();
  const user = useRecoilValue(userAtom);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyInquiry, setReplyInquiry] = useState(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const getSimplifiedStatus = (inquiry) => {
    if (inquiry.reply) return 'resolved';
    if (inquiry.status === 'COMPLETED') return 'resolved';
    return 'pending';
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    if (statusFilter === 'all') return true;
    const simplifiedStatus = getSimplifiedStatus(inquiry);
    return simplifiedStatus === statusFilter;
  });

  const handleDelete = async (inquiryId) => {
    if (window.confirm('정말로 이 문의를 삭제하시겠습니까?')) {
      try {
        await deleteInquiry(inquiryId);
      } catch (err) {
        console.error('문의 삭제 중 오류 발생:', err);
        alert('문의 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const openReplyModal = (inquiry) => {
    setReplyInquiry(inquiry);
    setIsReplyModalOpen(true);
  };

  const closeReplyModal = () => {
    setIsReplyModalOpen(false);
    setReplyInquiry(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (inquiry) => {
    const simplifiedStatus = getSimplifiedStatus(inquiry);
    const statusConfig = {
      resolved: { text: '해결됨', color: 'bg-[#a3c468] text-green-800' },
      pending: { text: '대기중', color: 'bg-[#fad05c] text-yellow-800' },
    };

    const config = statusConfig[simplifiedStatus] || {
      text: '대기중',
      color: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div
          className={`text-lg text-gray-600 ${neumorphStyles.small} ${neumorphStyles.hover} px-6 py-3 rounded-2xl`}
        >
          로딩 중...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 w-full">
        <div
          className={`${componentStyles.text.error} mb-4 ${neumorphStyles.small} ${neumorphStyles.hover} px-6 py-3 rounded-2xl`}
        >
          {error}
        </div>
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div
        className={`text-center py-8 ${componentStyles.text.loading} ${neumorphStyles.small} ${neumorphStyles.hover} rounded-2xl`}
      >
        {isAdmin ? '등록된 문의가 없습니다.' : '작성한 문의가 없습니다.'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-[#252422]">
          {isAdmin ? '전체 문의 목록' : '내 문의 목록'}
        </h3>
        <div className="flex items-center gap-4">
          {/* 상태 필터 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                statusFilter === 'all'
                  ? `${neumorphStyles.small} bg-[#FF8C4B] text-[#252422]`
                  : `${neumorphStyles.small} ${neumorphStyles.hover} text-[#252422]`
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                statusFilter === 'pending'
                  ? `${neumorphStyles.small} bg-[#fad05c]  text-yellow-800`
                  : `${neumorphStyles.small} ${neumorphStyles.hover} text-[#252422]`
              }`}
            >
              대기중
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                statusFilter === 'resolved'
                  ? `${neumorphStyles.small} !bg-[#a3c468] !text-green-800`
                  : `${neumorphStyles.small} ${neumorphStyles.hover} text-[#252422]`
              }`}
            >
              해결됨
            </button>
          </div>
          <div className="text-sm text-gray-600">
            총 {filteredInquiries.length}건
          </div>
        </div>
      </div>

      {selectedInquiry ? (
        <div
          className={`${neumorphStyles.small} ${neumorphStyles.hover} rounded-2xl p-6`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg sm:text-xl font-medium text-[#252422] flex-1 mr-4">
              {selectedInquiry.title}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedInquiry(null)}
                className={`text-[#FF8C4B] hover:text-[#D54E23] text-base sm:text-lg flex-shrink-0 ${neumorphStyles.small} ${neumorphStyles.hover} px-4 py-2 rounded-xl`}
              >
                ← 목록으로
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                작성자
              </label>
              <p className="text-[#252422]">
                {selectedInquiry.author?.nickname ||
                  selectedInquiry.author?.name ||
                  selectedInquiry.author?.userId ||
                  '알 수 없음'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상태
              </label>
              <div>{getStatusBadge(selectedInquiry)}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카테고리
              </label>
              <p className="text-[#252422]">
                {selectedInquiry.inquiryCategoryType || '미분류'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                작성일
              </label>
              <p className="text-[#252422]">
                {formatDate(selectedInquiry.createdAt)}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              문의 내용
            </label>
            <div className={`${neumorphStyles.smallInset} p-4 rounded-lg`}>
              <p className="text-[#252422] whitespace-pre-wrap">
                {selectedInquiry.content}
              </p>
            </div>
          </div>

          {selectedInquiry.reply && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                답변
              </label>
              <div
                className={`${neumorphStyles.smallInset} p-4 rounded-lg bg-blue-50`}
              >
                <p className="text-[#252422] whitespace-pre-wrap">
                  {selectedInquiry.reply}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.inquiryId}
              className={`${neumorphStyles.small} ${neumorphStyles.hover} rounded-xl p-4 transition-all duration-200`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => setSelectedInquiry(inquiry)}
                    className="w-full text-left transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-[#252422] text-lg truncate">
                        {inquiry.title}
                      </h4>
                      {getStatusBadge(inquiry)}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <UserIcon className="w-4 h-4" />
                        <span>
                          {inquiry.author?.nickname ||
                            inquiry.author?.name ||
                            inquiry.author?.userId ||
                            '알 수 없음'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{formatDate(inquiry.createdAt)}</span>
                      </div>
                      {inquiry.inquiryCategoryType && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {inquiry.inquiryCategoryType}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 line-clamp-2">
                      {inquiry.content}
                    </p>

                    {inquiry.reply && (
                      <div
                        className={`mt-3 p-3 ${neumorphStyles.smallInset} rounded-lg`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <img src={replyIcon} alt="답변" className="w-8 h-8" />
                          <span className="text-sm font-medium text-[#252422]">
                            답변
                          </span>
                        </div>
                        <p className="text-sm text-[#252422]">
                          {inquiry.reply}
                        </p>
                      </div>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {isAdmin && (
                    <button
                      onClick={() => openReplyModal(inquiry)}
                      className={`p-2 ${neumorphStyles.smallInset} rounded-lg hover:bg-blue-100 transition-colors`}
                      title="답변"
                    >
                      <img src={replyIcon} alt="답변" className="w-8 h-8" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminReplyForm
        inquiry={replyInquiry}
        isOpen={isReplyModalOpen}
        onClose={closeReplyModal}
        onSuccess={() => {
          closeReplyModal();
          window.location.reload();
        }}
      />
    </div>
  );
};

export default InquiryList;
