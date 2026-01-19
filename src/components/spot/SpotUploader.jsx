import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import UploadImages from '../ui/UploadImages';
import { neumorphStyles } from '../../utils/style';

export default function SpotUploader({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState(null);
  const [tel, setTel] = useState('');
  const [newPhotos, setNewPhotos] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const categories = [
    '숙소',
    '카페',
    '복합문화공간',
    '박물관',
    '미술관',
    '도서관',
    '역사',
    '종교',
    '관광지',
    '자연',
    '식당',
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleUpload = (files) => {
    const updatePhotos = Array.from(files).map((file, index) => ({
      id: index,
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewPhotos(updatePhotos);
  };

  useEffect(() => {
    return () => {
      newPhotos.forEach((photo) => {
        if (photo?.preview) {
          URL.revokeObjectURL(photo.preview);
        }
      });
    };
  }, [newPhotos]);

  const handleRemovePhoto = (index) => {
    const updatedPhotos = [...newPhotos];
    const removed = updatedPhotos.splice(index, 1)[0];
    if (removed?.preview) {
      URL.revokeObjectURL(removed.preview);
    }
    setNewPhotos(updatedPhotos);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('newPhotosIndex', index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = e.dataTransfer.getData('newPhotosIndex');
    const updatedPhotos = [...newPhotos];
    const draggedPhoto = updatedPhotos.splice(dragIndex, 1)[0];
    updatedPhotos.splice(dropIndex, 0, draggedPhoto);
    setNewPhotos(updatedPhotos);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleConvert = async () => {
    try {
      const response = await api.get(
        `/maps/geocode?address=${encodeURIComponent(address)}`,
      );
      setCoords(response.data);
    } catch (error) {
      console.error('변환 실패:', error);
      const message = error.response?.data?.message;
      setError(message || '요청에 실패하였습니다.');
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('address', address);
    formData.append('tel', tel);
    formData.append('latitude', coords.latitude);
    formData.append('longitude', coords.longitude);
    formData.append('categories', JSON.stringify(selectedCategories));
    newPhotos.forEach((photo) => {
      formData.append('spotImgs', photo.file);
    });
    try {
      const response = await api.post(`/spots`, formData);
      setName('');
      setAddress('');
      setTel('');
      setCoords('');
      setSelectedCategories([]);
      setNewPhotos([]);
      onClose();
    } catch (error) {
      console.error('spot 등록 중 오류 발생', error);
    } finally {
      setIsConfirmOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIsConfirmOpen(false);
    }
  }, [isOpen]);

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
        <div
          className="flex justify-between items-center px-6 py-4 flex-shrink-0"
        >
          <h2 className="text-2xl font-bold text-[#252422]">Spot 등록</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${neumorphStyles.small} ${neumorphStyles.hover}`}
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          <div className="w-full lg:w-1/2 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-[#252422] mb-2">
                  Spot 이름
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${neumorphStyles.small} ${neumorphStyles.hover}`}
                  placeholder="Spot 이름을 입력하세요"
                />
              </div>

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
                          ? 'bg-[#FF8C4B] text-white shadow-[inset_3px_3px_6px_#d46a2a,inset_-3px_-3px_6px_#ffae6c]'
                          : `${neumorphStyles.small} ${neumorphStyles.hover} text-[#252422]`
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-[#252422] mb-2">
                  전화번호
                </label>
                <input
                  type="text"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${neumorphStyles.small} ${neumorphStyles.hover}`}
                  placeholder="전화번호를 입력하세요"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-[#252422] mb-2">
                  주소
                </label>
                <div className="flex gap-2">
                  <textarea
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setError('');
                      setCoords('');
                    }}
                    className={`flex-1 px-4 py-3 rounded-xl border-2 resize-none transition-colors h-20 ${
                      error ? 'border-red-500' : ''
                    } ${neumorphStyles.small} ${neumorphStyles.hover}`}
                    placeholder="주소를 입력하세요"
                  />
                  <button
                    className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 h-20 ${
                      address.trim()
                        ? 'bg-[#FF8C4B] text-white hover:bg-[#D46A2A] shadow-[3px_3px_6px_#d46a2a,-3px_-3px_6px_#ffae6c] hover:shadow-[inset_3px_3px_6px_#d46a2a,inset_-3px_-3px_6px_#ffae6c]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={handleConvert}
                    disabled={!address.trim()}
                  >
                    검증
                  </button>
                </div>
                {coords && (
                  <div className="mt-2 text-sm text-gray-600 font-medium">
                    ✓ 검증 완료
                  </div>
                )}
                {error && (
                  <div className="mt-2 text-sm text-red-500 font-medium">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 p-6 overflow-y-auto">
            <div className="space-y-6">
              <label className="block text-lg font-semibold text-[#252422] mb-2">
                Spot 사진
              </label>
              <div
                className={`border-2 border-dashed rounded-xl min-h-[400px] ${neumorphStyles.smallInset}`}
              >
                {newPhotos.length === 0 ? (
                  <UploadImages
                    onUpload={handleUpload}
                    mode="multiple"
                    className="py-10 mx-auto"
                  />
                ) : (
                  <div className="grid grid-cols-3 gap-4 p-4 content-start h-full overflow-y-auto">
                    {newPhotos.map((photo, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragOver={handleDragOver}
                        className="relative aspect-square group"
                      >
                        <img
                          src={photo.preview}
                          alt={`Preview-${index}`}
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 rounded-xl flex items-center justify-center">
                          <button
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemovePhoto(index)}
                          >
                            <TrashIcon className="w-8 h-8 text-white" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex justify-end px-6 py-4 flex-shrink-0"
        >
          <button
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
              name.trim() &&
              address.trim() &&
              coords &&
              selectedCategories.length > 0
                ? 'bg-[#FF8C4B] text-white hover:bg-[#D46A2A] shadow-[3px_3px_6px_#d46a2a,-3px_-3px_6px_#ffae6c] hover:shadow-[inset_3px_3px_6px_#d46a2a,inset_-3px_-3px_6px_#ffae6c]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={() => setIsConfirmOpen(true)}
            disabled={
              !name.trim() ||
              !address.trim() ||
              !coords ||
              selectedCategories.length === 0
            }
          >
            등록
          </button>
        </div>
      </div>

      {isConfirmOpen && (
        <div className="fixed inset-0 flex bg-black/40 backdrop-blur-sm items-center justify-center z-[60]">
          <div
            className={`bg-[#f0f0f3] p-6 rounded-xl max-w-[280px] text-center ${neumorphStyles.medium}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 text-[#252422] font-semibold">
              spot 중복 검색 하셨습니까?
            </div>
            <div className="flex gap-3 justify-center">
              <button
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${neumorphStyles.small} ${neumorphStyles.hover} text-[#252422]`}
                onClick={() => setIsConfirmOpen(false)}
              >
                아니요
              </button>
              <button
                className="px-4 py-2 rounded-xl font-medium transition-all duration-200 bg-[#FF8C4B] text-white hover:bg-[#D46A2A] shadow-[3px_3px_6px_#d46a2a,-3px_-3px_6px_#ffae6c] hover:shadow-[inset_3px_3px_6px_#d46a2a,inset_-3px_-3px_6px_#ffae6c]"
                onClick={handleSubmit}
              >
                네
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
