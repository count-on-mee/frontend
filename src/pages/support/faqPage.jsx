import React, { useState, useEffect, useMemo } from 'react';
import api from '../../utils/axiosInstance';
import {
  neumorphStyles,
  componentStyles,
  layoutStyles,
} from '../../utils/style';
import questionIcon from '../../assets/question.png';
import useAdmin from '../../hooks/useAdmin';
import FaqModal from '../../components/support/faqModal';

const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedFaqs, setExpandedFaqs] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingFaq, setEditingFaq] = useState(null);

  const { isAdmin } = useAdmin();

  const categories = [
    { value: 'ALL', label: '전체' },
    { value: '계정', label: '계정' },
    { value: '앱 이용', label: '서비스 이용' },
    { value: '스팟', label: '스팟' },
    { value: '큐레이션', label: '큐레이션' },
    { value: '기타', label: '기타' },
  ];

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);

      const response = await api.get('/support/faqs');

      if (response?.data !== undefined) {
        const faqData = Array.isArray(response.data) ? response.data : [];
        setFaqs(faqData);
        setError(null);
      } else {
        setFaqs([]);
        setError(null);
      }
    } catch (err) {
      handleFetchError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchError = (err) => {
    if (err.message?.includes('CORS')) {
      setError('서버 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.');
    } else if (err.response?.status >= 500) {
      setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } else {
      setError('FAQ를 불러오는데 실패했습니다.');
    }
  };

  const toggleFaq = (faqId) => {
    setExpandedFaqs((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(faqId)) {
        newExpanded.delete(faqId);
      } else {
        newExpanded.add(faqId);
      }
      return newExpanded;
    });
  };

  const handleCreateFaq = () => {
    setModalMode('create');
    setEditingFaq(null);
    setShowModal(true);
  };

  const handleEditFaq = (faq) => {
    setModalMode('edit');
    setEditingFaq(faq);
    setShowModal(true);
  };

  const handleModalSuccess = () => {
    fetchFaqs();
  };

  const filteredFaqs = useMemo(() => {
    if (!Array.isArray(faqs)) return [];

    if (selectedCategory === 'ALL') {
      return faqs;
    }

    return faqs.filter((faq) => faq.faqCategoryType === selectedCategory);
  }, [faqs, selectedCategory]);

  const renderCategoryFilter = () => (
    <div className={layoutStyles.spacing.section}>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-3 sm:px-4 py-2 rounded-full text-lg font-medium transition-all duration-200 ${
              selectedCategory === category.value
                ? 'bg-[#FF8C4B] text-white shadow-[inset_3px_3px_6px_#c44e1f,inset_-3px_-3px_6px_#ff6c31]'
                : `${neumorphStyles.small} ${neumorphStyles.hover} text-[#252422]`
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderFaqItem = (faq, index) => {
    const isExpanded = expandedFaqs.has(faq.faqId);

    return (
      <div
        key={faq.faqId || `faq-${index}`}
        className={`${neumorphStyles.small} ${neumorphStyles.hover} rounded-2xl overflow-hidden`}
      >
        <div className="flex items-center">
          <button
            onClick={() => toggleFaq(faq.faqId)}
            className="flex-1 text-left p-3 sm:p-4 transition-all duration-200 flex justify-between items-center"
          >
            <div className="flex items-center flex-1 min-w-0">
              <span className="text-base sm:text-lg font-medium text-[#FF8C4B] mr-2 sm:mr-3 flex-shrink-0">
                Q.
              </span>
              <span className="font-medium text-[#252422] text-base sm:text-lg lg:text-xl truncate">
                {faq.question}
              </span>
            </div>
            <div className="text-gray-400 flex-shrink-0 ml-2">
              <svg
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>
          {isAdmin && (
            <button
              onClick={() => handleEditFaq(faq)}
              className={`${neumorphStyles.small} ${neumorphStyles.hover} px-3 py-2 rounded-xl text-[#252422] font-semibold mr-2`}
            >
              수정
            </button>
          )}
        </div>

        {isExpanded && (
          <div className={`${neumorphStyles.smallInset} p-3 sm:p-4`}>
            <div className="flex">
              <span className="text-base sm:text-lg font-medium text-[#FF8C4B] mr-2 sm:mr-3 flex-shrink-0">
                A.
              </span>
              <div className="flex-1 text-[#252422] whitespace-pre-wrap text-base sm:text-lg lg:text-xl">
                {faq.answer}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className={layoutStyles.flex.center + ' h-64 w-full'}>
          <div
            className={`${componentStyles.text.loading} ${neumorphStyles.small} ${neumorphStyles.hover} px-6 py-3 rounded-2xl`}
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
          <button
            onClick={fetchFaqs}
            className={`${neumorphStyles.small} ${neumorphStyles.hover} px-6 py-3 rounded-xl text-[#252422] font-semibold`}
          >
            다시 시도
          </button>
        </div>
      );
    }

    return (
      <>
        {renderCategoryFilter()}

        <div className="space-y-5 sm:space-y-5">
          {filteredFaqs.length === 0 ? (
            <div
              className={`text-center py-8 ${componentStyles.text.loading} ${neumorphStyles.small} ${neumorphStyles.hover} rounded-2xl`}
            >
              해당 카테고리의 FAQ가 없습니다.
            </div>
          ) : (
            filteredFaqs.map(renderFaqItem)
          )}
        </div>
      </>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2
            className={`text-base sm:text-3xl lg:text-4xl font-bold text-[#252422] px-6 py-3 flex items-center gap-3`}
          >
            <img
              src={questionIcon}
              alt="자주 묻는 질문"
              className="w-10 h-10 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
            />
            자주 묻는 질문
          </h2>
          {isAdmin && (
            <button
              onClick={handleCreateFaq}
              className={`${neumorphStyles.small} ${neumorphStyles.hover} px-6 py-3 rounded-xl text-[#252422] font-semibold`}
            >
              FAQ 등록
            </button>
          )}
        </div>

        {renderContent()}
      </div>

      <FaqModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        faq={editingFaq}
        onSuccess={handleModalSuccess}
        mode={modalMode}
      />
    </div>
  );
};

export default FaqPage;
