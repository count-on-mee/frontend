import React, { useState } from 'react';

const InquiryPage = () => {
  const [name, setName] = useState('');
  const [inquiryType, setInquiryType] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    alert('Inquiry submitted!');
  };

  return (
    <div className="min-h-screen bg-[#FFFCF2] py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center mb-4">문의하기</h2>
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-white p-6 rounded-md shadow-md"
        >
          <div className="mb-4">
            <label htmlFor="name" className="block font-semibold">
              이름
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="inquiryType" className="block font-semibold">
              문의 유형
            </label>
            <select
              id="inquiryType"
              value={inquiryType}
              onChange={e => setInquiryType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">--선택하세요--</option>
              <option value="General">일반 문의</option>
              <option value="Technical">기술 지원</option>
              <option value="Billing">청구 관련</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="block font-semibold">
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block font-semibold">
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md"
            >
              제출하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InquiryPage;
