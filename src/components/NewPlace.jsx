import React, { useState } from 'react';

const NewPlaceModal = ({ onClose, onSubmit }) => {
  const [placeType, setPlaceType] = useState('');
  const placeTypes = ['식당', '카페', '숙소', '관광지', '박물관', '전시관'];

  const handleSubmit = () => {
    if (!placeType) return alert('항목을 선택해주세요.');
    onSubmit(placeType);
    onClose();
  };

  return (
    <div
      className="bg-white p-8 rounded-lg max-w-2xl w-full shadow-lg"
      style={{ maxHeight: '90vh' }}
    >
      <h2 className="text-2xl font-bold text-center text-[#252422] mb-4">
        장소 유형 선택
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {placeTypes.map(type => (
          <button
            key={type}
            onClick={() => setPlaceType(type)}
            className={`py-2 px-4 rounded-full border-2 text-center font-semibold cursor-pointer transition-colors ${
              placeType === type
                ? 'bg-[#D54E23] text-white border-[#D54E23]'
                : 'bg-gray-200 text-black border-gray-300'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={handleSubmit}
          className="bg-[#D54E23] text-white font-semibold py-3 px-8 rounded-full hover:bg-[#EB5E28]"
        >
          확인
        </button>
        <button
          onClick={onClose}
          className="bg-gray-300 text-black font-semibold py-3 px-8 rounded-full hover:bg-gray-400"
        >
          취소
        </button>
      </div>
    </div>
  );
};

const NewPlace = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) return alert('검색어를 입력해주세요.');
    setIsModalOpen(true); // 장소 유형 모달 열기
  };

  const handleModalClose = () => setIsModalOpen(false);

  const handleModalSubmit = selectedType => {
    console.log('선택된 유형:', selectedType);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {!isModalOpen ? (
        <div
          className="bg-white p-8 rounded-lg max-w-2xl w-full shadow-lg"
          style={{ maxHeight: '90vh' }}
        >
          <div className="flex items-center justify-between mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#252422"
              className="size-10 cursor-pointer"
              onClick={onClose}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            <h2 className="text-2xl font-bold text-[#252422]">
              신규 장소 등록
            </h2>
            <div className="size-10"></div>
          </div>

          <div className="w-full mb-6 relative">
            <input
              className="w-full h-12 px-5 pr-12 text-sm placeholder-gray-600 bg-white md:text-lg focus:outline-none border-2 border-gray-300 rounded-lg"
              type="search"
              placeholder="상호명 또는 주소를 입력하세요"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={handleSearch}
              className="bg-[#D54E23] text-white font-semibold py-3 px-8 rounded-full hover:bg-[#EB5E28]"
            >
              검색
            </button>
          </div>
        </div>
      ) : (
        <NewPlaceModal
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default NewPlace;
