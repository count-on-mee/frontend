import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import { neumorphStyles, componentStyles } from '../../utils/style';
import questionIcon from '../../assets/question.png';

const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedFaqs, setExpandedFaqs] = useState(new Set());

  const categories = [
    { value: 'ALL', label: '전체' },
    { value: '계정', label: '계정' },
    { value: '서비스 이용', label: '서비스 이용' },
    { value: '스팟', label: '스팟' },
    { value: '큐레이션', label: '큐레이션' },
    { value: '기타', label: '기타' },
  ];

  useEffect(() => {
    fetchFaqs();
  }, [selectedCategory]);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      let response;

      if (selectedCategory === 'ALL') {
        response = await api.get('/support/faqs');
      } else {
        response = await api.get(
          `/support/faqs/categories?category=${selectedCategory}`,
        );
      }

      setFaqs(response.data);
      setError(null);
    } catch (err) {
      setError('FAQ를 불러오는데 실패했습니다.');
      console.error('FAQ 조회 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (faqId) => {
    const newExpanded = new Set(expandedFaqs);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
    }
    setExpandedFaqs(newExpanded);
  };

  const filteredFaqs = faqs;

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
        <button
          onClick={fetchFaqs}
          className={`${componentStyles.button.primary} ${neumorphStyles.small} ${neumorphStyles.hover}`}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="w-full">
        <h2
          className={`text-xl sm:text-2xl lg:text-3xl font-semibold text-[#252422] mb-4 sm:mb-6 px-6 py-3 flex items-center gap-3`}
        >
          <img
            src={questionIcon}
            alt="자주 묻는 질문"
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
          />
          자주 묻는 질문
        </h2>

        {/* 카테고리 필터 */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.value
                    ? neumorphStyles.active
                    : `${neumorphStyles.small} ${neumorphStyles.hover} text-[#252422]`
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ 목록 */}
        <div className="space-y-3 sm:space-y-4">
          {filteredFaqs.length === 0 ? (
            <div
              className={`text-center py-8 text-gray-500 ${neumorphStyles.small} ${neumorphStyles.hover} rounded-2xl`}
            >
              해당 카테고리의 FAQ가 없습니다.
            </div>
          ) : (
            filteredFaqs.map((faq) => (
              <div
                key={faq.faqId}
                className={`${neumorphStyles.small} ${neumorphStyles.hover} rounded-2xl overflow-hidden`}
              >
                <button
                  onClick={() => toggleFaq(faq.faqId)}
                  className="w-full text-left p-3 sm:p-4 transition-all duration-200 flex justify-between items-center"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <span className="text-base font-medium text-[#FF8C4B] mr-2 sm:mr-3 flex-shrink-0">
                      Q.
                    </span>
                    <span className="font-medium text-[#252422] text-base sm:text-lg truncate">
                      {faq.question}
                    </span>
                  </div>
                  <div className="text-gray-400 flex-shrink-0 ml-2">
                    <svg
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                        expandedFaqs.has(faq.faqId) ? 'rotate-180' : ''
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

                {expandedFaqs.has(faq.faqId) && (
                  <div className={`${neumorphStyles.smallInset} p-3 sm:p-4`}>
                    <div className="flex">
                      <span className="text-base font-medium text-[#FF8C4B] mr-2 sm:mr-3 flex-shrink-0">
                        A.
                      </span>
                      <div className="flex-1 text-[#252422] whitespace-pre-wrap text-base sm:text-lg">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
