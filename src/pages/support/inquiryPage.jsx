import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import { neumorphStyles, componentStyles } from '../../utils/style';
import inquiryIcon from '../../assets/inquiry.png';
import InquiryForm from '../../components/InquiryForm';

const InquiryPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    inquiryCategoryType: 'GENERAL',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/support/inquiries');
      setInquiries(response.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('로그인이 필요합니다.');
      } else {
        setError('문의 내역을 불러오는데 실패했습니다.');
      }
      console.error('문의 조회 오류:', err);
    } finally {
      setLoading(false);
    }
  };

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
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/support/inquiries', formData);

      // 폼 초기화
      setFormData({
        title: '',
        content: '',
        inquiryCategoryType: 'GENERAL',
      });
      setShowForm(false);

      // 문의 목록 새로고침
      await fetchInquiries();

      alert('문의가 성공적으로 등록되었습니다.');
    } catch (err) {
      if (err.response?.status === 401) {
        alert('로그인이 필요합니다.');
      } else {
        alert('문의 등록에 실패했습니다. 다시 시도해주세요.');
      }
      console.error('문의 등록 오류:', err);
    } finally {
      setSubmitting(false);
    }
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { label: '대기중', color: 'bg-yellow-100 text-yellow-800' },
      IN_PROGRESS: { label: '처리중', color: 'bg-blue-100 text-blue-800' },
      COMPLETED: { label: '완료', color: 'bg-green-100 text-green-800' },
      REJECTED: { label: '거절', color: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status] || {
      label: status,
      color: 'bg-gray-100 text-gray-800',
    };

    return (
      <span
        className={`px-2 py-1 text-sm font-medium rounded-full ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getCategoryLabel = (categoryType) => {
    const categoryMap = {
      ACCOUNT: '계정',
      PAYMENT: '결제',
      TECHNICAL: '기술지원',
      GENERAL: '일반',
      BUG_REPORT: '버그신고',
      FEATURE_REQUEST: '기능요청',
    };
    return categoryMap[categoryType] || categoryType;
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
          className={`text-red-600 mb-4 ${neumorphStyles.small} ${neumorphStyles.hover} px-6 py-3 rounded-2xl`}
        >
          {error}
        </div>
        {error === '로그인이 필요합니다.' ? (
          <button
            onClick={() => (window.location.href = '/login')}
            className={`${componentStyles.button.primary} ${neumorphStyles.small} ${neumorphStyles.hover}`}
          >
            로그인하기
          </button>
        ) : (
          <button
            onClick={fetchInquiries}
            className={`${componentStyles.button.primary} ${neumorphStyles.small} ${neumorphStyles.hover}`}
          >
            다시 시도
          </button>
        )}
      </div>
    );
  }

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

          {!showForm && !selectedInquiry && (
            <button
              onClick={() => setShowForm(true)}
              className={`${componentStyles.button.primary} ${neumorphStyles.small} ${neumorphStyles.hover} px-6 py-3 rounded-xl text-sm sm:text-base !text-[#252422]`}
            >
              새 문의 작성
            </button>
          )}
        </div>

        {showForm && (
          <InquiryForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            submitting={submitting}
          />
        )}

        {selectedInquiry ? (
          <div
            className={`${neumorphStyles.small} ${neumorphStyles.hover} rounded-2xl p-6`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-medium text-[#252422] flex-1 mr-4">
                문의 상세보기
              </h3>
              <button
                onClick={() => setSelectedInquiry(null)}
                className={`text-[#FF8C4B] hover:text-[#D54E23] text-base sm:text-lg flex-shrink-0 ${neumorphStyles.small} ${neumorphStyles.hover} px-4 py-2 rounded-xl`}
              >
                ← 목록으로
              </button>
            </div>

            <div className="space-y-4">
              <div className={`${neumorphStyles.smallInset} p-4 rounded-2xl`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-[#252422] text-base sm:text-lg flex-1 mr-4">
                    {selectedInquiry.title}
                  </h4>
                  <div className="flex-shrink-0">
                    {getStatusBadge(selectedInquiry.status)}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 text-sm sm:text-base text-gray-500 flex-wrap">
                  <span>
                    {getCategoryLabel(selectedInquiry.inquiryCategoryType)}
                  </span>
                  <span>{formatDate(selectedInquiry.createdAt)}</span>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-[#252422] mb-2 text-base sm:text-lg">
                  문의 내용
                </h5>
                <div className={`${neumorphStyles.smallInset} p-4 rounded-2xl`}>
                  <div className="whitespace-pre-wrap text-[#252422] text-base sm:text-lg">
                    {selectedInquiry.content}
                  </div>
                </div>
              </div>

              {selectedInquiry.reply && (
                <div>
                  <h5 className="font-medium text-[#252422] mb-2 text-base sm:text-lg">
                    답변
                  </h5>
                  <div
                    className={`${neumorphStyles.smallInset} p-4 rounded-2xl bg-[#FF8C4B]/10`}
                  >
                    <div className="whitespace-pre-wrap text-[#252422] text-base sm:text-lg">
                      {selectedInquiry.reply}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {inquiries.length === 0 ? (
              <div
                className={`text-center py-8 text-gray-500 ${neumorphStyles.small} ${neumorphStyles.hover} rounded-2xl`}
              >
                등록된 문의가 없습니다.
              </div>
            ) : (
              inquiries.map((inquiry) => (
                <div
                  key={inquiry.inquiryId}
                  className={`${neumorphStyles.small} ${neumorphStyles.hover} rounded-2xl p-4 transition-all duration-200`}
                >
                  <button
                    onClick={() => setSelectedInquiry(inquiry)}
                    className="w-full text-left transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[#252422] mb-1 text-base sm:text-lg truncate">
                          {inquiry.title}
                        </h3>
                        <div className="flex items-center gap-2 sm:gap-4 text-sm sm:text-base text-gray-500 flex-wrap">
                          <span>
                            {getCategoryLabel(inquiry.inquiryCategoryType)}
                          </span>
                          <span>{formatDate(inquiry.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2 sm:ml-4 flex-shrink-0">
                        {getStatusBadge(inquiry.status)}
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF8C4B]"
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
                      </div>
                    </div>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryPage;
