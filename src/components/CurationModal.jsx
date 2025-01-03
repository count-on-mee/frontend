import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import selectedSpotsAtom from '../recoil/selectedSpots';
import defaultImage from '../assets/img/icon.png';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function CurationModal({
  selectedCurationId,
  setShowCurationModal,
}) {
  const [curationData, setCurationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpots, setSelectedSpots] = useRecoilState(selectedSpotsAtom);

  useEffect(() => {
    const fetchCurationData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(
          `http://localhost:8888/curations/${selectedCurationId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!response.ok) throw new Error('Failed to fetch curation data.');

        const data = await response.json();
        setCurationData(data);
      } catch (error) {
        setError('큐레이션 데이터를 가져오는 중 문제가 발생했습니다.');
        console.error('Error fetching curation data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedCurationId) fetchCurationData();
  }, [selectedCurationId]);

  const handleClose = () => {
    setShowCurationModal(false);
  };

  const handleSelectSpot = spot => {
    setSelectedSpots(prev => {
      const isAlreadySelected = prev.some(
        selected => selected.spotId === spot.spotId,
      );
      if (isAlreadySelected) {
        return prev.filter(selected => selected.spotId !== spot.spotId);
      } else {
        return [...prev, spot];
      }
    });
  };

  const handleConfirmSelection = () => {
    // 선택된 스팟을 확인하는 로직이 필요하다면 여기에 추가
    console.log('선택된 스팟:', selectedSpots); // 선택된 스팟 로그 출력
    handleClose(); // 모달 닫기
  };

  if (isLoading) return <div className="text-center">로딩 중...</div>;
  if (error)
    return <div className="text-center text-red-500">에러: {error}</div>;
  if (!curationData) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-[#FFFCF2] rounded-lg shadow-lg w-full max-w-4xl h-[90vh] overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 flex-shrink-0">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <div className="flex items-center mb-6">
              <img
                src={curationData.imgUrl || defaultImage}
                alt={curationData.title}
                className="w-24 h-24 object-cover rounded-md mr-4"
              />
              <h2 className="text-3xl font-bold text-[#252422]">
                {curationData.title || '큐레이션 제목'}
              </h2>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto p-6 pt-0">
            <div className="space-y-2">
              {curationData.spots && curationData.spots.length > 0 ? (
                curationData.spots.map(({ spot }) => (
                  <div
                    key={spot.spotId}
                    className="p-6 border rounded-lg shadow-md bg-white flex items-center"
                  >
                    <img
                      src={spot.imgUrl?.[0] || defaultImage}
                      alt={spot.title}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-md text-[#252422]">
                        {spot.title}
                      </h3>
                      <p className="text-xs text-gray-500">{spot.address}</p>
                    </div>
                    <button
                      onClick={() => handleSelectSpot(spot)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        selectedSpots.some(
                          selected => selected.spotId === spot.spotId,
                        )
                          ? 'bg-[#EB5E28] text-white border'
                          : 'bg-transparent text-black border border-black hover:bg-gray-300'
                      }`}
                    >
                      {selectedSpots.some(
                        selected => selected.spotId === spot.spotId,
                      )
                        ? '선택됨'
                        : '선택'}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  등록된 장소가 없습니다.
                </p>
              )}
            </div>
          </div>
          {/* 확인 버튼 추가 */}
          <div className="p-6">
            <button
              onClick={handleConfirmSelection}
              className="bg-[#EB5E28] text-white font-semibold py-2 px-4 rounded-full hover:bg-[#D64E1E]"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
