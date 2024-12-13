import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InquiryPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    inquiryType: '',
    title: '',
    content: '',
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validators = {
    name: value => value.trim().length >= 2,
    email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    inquiryType: value => value !== '',
    title: value => value.trim().length >= 5,
    content: value => value.trim().length >= 10,
  };

  const validateField = (name, value) => {
    if (validators[name]) {
      return validators[name](value);
    }
    return true;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');
    const response = await fetch('http://localhost:8888/support/inquiries', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inquiryCategoryType: formData.inquiryType,
        title: formData.title,
        content: formData.content,
      }),
    });

    if (response.ok) {
      navigate('/support/inquiry');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      inquiryType: '',
      title: '',
      content: '',
      dataConsent: false,
    });
    setErrors({});
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      const newErrors = {};
      Object.keys(validators).forEach(field => {
        if (formData[field] && !validateField(field, formData[field])) {
          newErrors[field] = true;
        }
      });
      setErrors(newErrors);
    }, 300);

    return () => clearTimeout(debounce);
  }, [formData]);

  return (
    <div className="min-h-screen bg-[#FFFCF2] py-1">
      <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        {showSuccess && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md max-w-2xl mx-auto">
            문의가 성공적으로 제출되었습니다. 감사합니다!
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white p-6 border border-[#403D39]"
        >
          <div className="mb-4">
            <label htmlFor="inquiryType" className="block font-semibold">
              문의 유형
            </label>
            <select
              id="inquiryType"
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleChange}
              className={`w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 ${
                errors.inquiryType ? 'border-red-500' : ''
              }`}
              required
            >
              <option value="" disabled>
                --선택하세요--
              </option>
              <option value="Spot 추천">Spot 추천</option>
              <option value="Spot 삭제">Spot 삭제</option>
              <option value="계정 관리">계정 관리</option>
            </select>
            {errors.inquiryType && (
              <p className="text-red-500 text-sm mt-1">
                문의 유형을 선택해주세요.
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="block font-semibold">
              제목
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 ${
                errors.title ? 'border-red-500' : ''
              }`}
              required
              placeholder="문의 제목을 입력해주세요"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                제목은 5글자 이상이어야 합니다.
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block font-semibold">
              내용
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={`w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 ${
                errors.content ? 'border-red-500' : ''
              }`}
              required
              placeholder="문의 내용을 상세히 적어주세요"
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                내용은 10글자 이상이어야 합니다.
              </p>
            )}
          </div>
          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="dataConsent"
                name="dataConsent"
                checked={formData.dataConsent}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label
                htmlFor="dataConsent"
                className="ml-2 block text-sm text-gray-900"
              >
                개인정보 처리에 동의합니다.
              </label>
            </div>
            {errors.dataConsent && (
              <p className="text-red-500 text-sm mt-1">
                개인정보 처리에 동의해주세요.
              </p>
            )}
          </div>
          <div className="flex justify-center space-x-8 mt-6">
            <button
              type="submit"
              className="bg-white text-2xl font-light leading-6 text-[#403D39] border border-[#403D39]
    rounded-3xl px-6 pt-2 pb-3 hover:bg-[#EB5E28]"
            >
              제출하기
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-white text-2xl font-light leading-6 text-[#403D39] border border-[#403D39]
    rounded-3xl px-6 pt-2 pb-3 hover:bg-[#EB5E28]"
            >
              취소하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InquiryPage;
