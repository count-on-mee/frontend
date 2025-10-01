import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import Searchbar from '../ui/Searchbar';
import { getRecoil } from 'recoil-nexus';
import authAtom from '../../recoil/auth';
import api from '../../utils/axiosInstance';
import { useRecoilState } from 'recoil';
import scrappedSpotsAtom from '../../recoil/scrapedSpot';
import SpotCart from './SpotCart';
import defaultImage from '../../assets/icon.png';
import { neumorphStyles } from '../../utils/style';

export default function CurationUploader({
  isOpen,
  onClose,
  fetchCuration,
  isEdit = false,
  editData = null,
  onSubmit,
}) {
  const [error, setError] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [scrapedSpots, setScrapedSpots] = useRecoilState(scrappedSpotsAtom);
  const [cartSpots, setCartSpots] = useState([]);
  const categories = ['여행', '식당', '카페', '자연'];
  const token = getRecoil(authAtom).accessToken;

  const handleAddToCart = (spot) => {
    setCartSpots((prev) => {
      // 수정 모드에서는 spotId로, 생성 모드에서는 spotScrapId로 중복 체크
      const identifier = isEdit ? spot.spotId : spot.spotScrapId;
      const alreadyIn = prev.some((s) =>
        isEdit ? s.spotId === identifier : s.spotScrapId === identifier,
      );

      if (alreadyIn) {
        // 제거
        return prev.filter((s) =>
          isEdit ? s.spotId !== identifier : s.spotScrapId !== identifier,
        );
      } else {
        // 추가 - 수정 모드에서는 uniqueId 추가
        const spotToAdd = isEdit
          ? {
              ...spot,
              uniqueId: `new-${spot.spotId}-${Date.now()}`,
            }
          : spot;
        return [...prev, spotToAdd];
      }
    });
  };

  const handleDelete = (identifier) => {
    setCartSpots((prev) => {
      if (isEdit) {
        // 수정 모드: uniqueId 또는 spotId로 삭제
        return prev.filter(
          (spot) =>
            spot.uniqueId !== identifier &&
            spot.spotId !== identifier &&
            spot.spotScrapId !== identifier,
        );
      } else {
        // 생성 모드: spotScrapId로 삭제
        return prev.filter((spot) => spot.spotScrapId !== identifier);
      }
    });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setSelectedCategories([]);
    setCartSpots([]);
    fetchCuration();
    onClose();
  };

  const handleSubmit = async () => {
    const refinedSpots = cartSpots.map((spot, index) => ({
      spotId: spot.spotId,
      order: index + 1,
    }));

    const payload = {
      name,
      description,
      categories: selectedCategories,
      spots: refinedSpots,
    };

    if (refinedSpots.length < 2) {
      alert('스팟은 최소 2개 이상 선택해야 합니다.');
      return;
    }

    if (selectedCategories.length < 1) {
      alert('카테고리는 최소 1개 이상 선택해야 합니다.');
      return;
    }

    try {
      if (isEdit && onSubmit) {
        // 수정 모드: 부모 컴포넌트의 onSubmit 함수 호출
        await onSubmit(payload);
      } else {
        // 생성 모드: 기존 로직
        const token = getRecoil(authAtom).accessToken;
        const response = await api.post('/curations', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('scrapedSpots API 응답:', response.data);
        handleClose();
      }
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length > 1000) {
      setError(true);
    } else {
      setError(false);
      setDescription(value);
    }
  };

  const fetchScrapedSpots = async () => {
    try {
      const response = await api.get('/scraps/spots', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.data;
      setScrapedSpots(data);
    } catch (error) {
      console.error('Failed to fetch scraped spots:', error);
    }
  };

  useEffect(() => {
    fetchScrapedSpots();
  }, []);

  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (isEdit && editData) {
      setName(editData.name || '');
      setDescription(editData.description || '');
      setSelectedCategories(editData.categories || []);

      // 기존 스팟들을 카트에 추가
      if (editData.spots && Array.isArray(editData.spots)) {
        const spotsWithOrder = editData.spots.map((spot, index) => ({
          ...spot,
          order: spot.order || index + 1,
          // 수정 모드에서는 spotId를 고유 식별자로 사용
          uniqueId: spot.spotId || `edit-${spot.spotId}-${index}`,
        }));
        setCartSpots(spotsWithOrder);
      }
    }
  }, [isEdit, editData]);

  //esc로 모달 닫기
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  //스크롤차단
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }, [isOpen]);

  return !isOpen ? null : (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-6xl h-[90vh] mx-4 bg-[#f0f0f3] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div
          className={`flex justify-between items-center px-6 py-4 border-b border-gray-200 ${neumorphStyles.smallInset} flex-shrink-0`}
        >
          <h2 className="text-2xl font-bold text-[#252422]">
            {isEdit ? '큐레이션 수정' : '큐레이션 만들기'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${neumorphStyles.small} ${neumorphStyles.hover}`}
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* 스팟 선택 */}
          <div className="w-full lg:w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
            <div className="space-y-6">
              {/* 검색 */}
              <div>
                <Searchbar placeholder="스팟 검색" className="w-full" />
              </div>

              {/* 스팟 리스트 */}
              {scrapedSpots.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#252422] mb-4">
                    스크랩한 스팟
                  </h3>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {scrapedSpots.map((spot) => (
                      <div
                        key={spot.spotScrapId}
                        onClick={() => handleAddToCart(spot)}
                        className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                          cartSpots.some((s) =>
                            isEdit
                              ? s.spotId === spot.spotId
                              : s.spotScrapId === spot.spotScrapId,
                          )
                            ? `${neumorphStyles.smallInset} border-2 border-[#EB5E28]`
                            : `${neumorphStyles.small} ${neumorphStyles.hover}`
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={spot.imgUrls[0] || defaultImage}
                            alt={spot.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#252422] truncate">
                              {spot.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {spot.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 장바구니 */}
              <div>
                <h3 className="text-lg font-semibold text-[#252422] mb-4">
                  선택된 스팟 ({cartSpots.length}개)
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  2개 이상의 스팟을 선택해 주세요!
                </p>
                <SpotCart spots={cartSpots} onDelete={handleDelete} />
              </div>
            </div>
          </div>

          {/* 폼 */}
          <div className="w-full lg:w-1/2 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* 제목 */}
              <div>
                <label className="block text-lg font-semibold text-[#252422] mb-2">
                  큐레이션 제목
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${neumorphStyles.small} ${neumorphStyles.hover}`}
                  placeholder="큐레이션 제목을 입력하세요"
                />
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-lg font-semibold text-[#252422] mb-2">
                  상세 설명
                </label>
                <textarea
                  value={description}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 resize-none transition-colors h-32 ${
                    error ? 'border-red-500' : ''
                  } ${neumorphStyles.small} ${neumorphStyles.hover}`}
                  placeholder="큐레이션에 대한 상세한 설명을 작성해주세요"
                />
                <div className="flex justify-between items-center mt-2">
                  <span
                    className={`text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    {error
                      ? '1000자 이내로 입력해주세요'
                      : `${description.length}/1000`}
                  </span>
                </div>
              </div>

              {/* 카테고리 */}
              <div>
                <label className="block text-lg font-semibold text-[#252422] mb-2">
                  카테고리
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        selectedCategories.includes(category)
                          ? 'bg-[#EB5E28] text-white shadow-[inset_3px_3px_6px_#c44e1f,inset_-3px_-3px_6px_#ff6c31]'
                          : `${neumorphStyles.small} ${neumorphStyles.hover} text-[#252422]`
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div
          className={`flex justify-end px-6 py-4 border-t border-gray-200 ${neumorphStyles.smallInset} flex-shrink-0`}
        >
          <button
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
              cartSpots.length >= 2 &&
              selectedCategories.length >= 1 &&
              name.trim()
                ? 'bg-[#EB5E28] text-white hover:bg-[#D54E23] shadow-[3px_3px_6px_#c44e1f,-3px_-3px_6px_#ff6c31] hover:shadow-[inset_3px_3px_6px_#c44e1f,inset_-3px_-3px_6px_#ff6c31]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleSubmit}
            disabled={
              cartSpots.length < 2 ||
              selectedCategories.length < 1 ||
              !name.trim()
            }
          >
            {isEdit ? '수정 완료' : '작성 완료'}
          </button>
        </div>
      </div>
    </div>
  );
}
