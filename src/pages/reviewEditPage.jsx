import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

import UploadImages from '../components/ui/UploadImages';

import api from '../utils/axiosInstance';
import defaultImage from '../assets/logo.png';
import { neumorphStyles, styleUtils } from '../utils/style';

export default function ReviewEditPage() {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [review, setReview] = useState(null);
  const [content, setContent] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [deleteImgUrls, setDeleteImgUrls] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // 리뷰 데이터 초기화
  useEffect(() => {
    const reviewData = location.state?.review;
    if (reviewData) {
      setReview(reviewData);
      setContent(reviewData.content || '');
      setExistingImages(reviewData.imgUrls || []);
      setLoading(false);
    } else {
      alert('리뷰 데이터를 불러올 수 없습니다.');
      navigate('/mypage/review');
    }
  }, [reviewId, location.state]);

  useEffect(() => {
    return () => {
      newPhotos.forEach((photo) => {
        URL.revokeObjectURL(photo.preview);
      });
    };
  }, []);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleCancel();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // 스크롤 차단
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // 새 이미지 업로드
  const handleUpload = (files) => {
    const updatePhotos = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewPhotos([...newPhotos, ...updatePhotos]);
  };

  const handleRemoveExistingImage = (imgUrl) => {
    setExistingImages((prev) => prev.filter((url) => url !== imgUrl));
    setDeleteImgUrls((prev) => [...prev, imgUrl]);
  };

  const handleRemoveNewPhoto = (index) => {
    setNewPhotos((prev) => {
      const updated = [...prev];
      const removed = updated.splice(index, 1)[0];
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return updated;
    });
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('newPhotosIndex', index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('newPhotosIndex'));
    setNewPhotos((prev) => {
      const updated = [...prev];
      const [draggedPhoto] = updated.splice(dragIndex, 1);
      updated.splice(dropIndex, 0, draggedPhoto);
      return updated;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setError(value.length > 1000);
    setContent(value);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('content', content);

    deleteImgUrls.forEach((url) => formData.append('deleteImgUrls[]', url));
    newPhotos.forEach((photo) => formData.append('reviewImgs', photo.file));

    try {
      await api.patch(`/spots/reviews/${reviewId}`, formData);
      alert('리뷰가 수정되었습니다.');
      navigate('/mypage/review');
    } catch (error) {
      console.error('리뷰 수정 중 오류 발생:', error);
      const status = error.response?.status;
      if (status === 401) {
        alert('인증이 필요합니다. 다시 로그인해주세요.');
        navigate('/login');
      } else if (status === 403) {
        alert('수정 권한이 없습니다.');
      } else if (status === 404) {
        alert('리뷰를 찾을 수 없습니다.');
        navigate('/mypage/review');
      } else {
        alert('리뷰 수정에 실패했습니다.');
      }
    }
  };

  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까?')) {
      navigate(-1);
    }
  };

  if (loading || !review) {
    return loading ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="text-lg text-white">로딩 중...</div>
      </div>
    ) : null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-6xl h-[90vh] mx-4 bg-[#f0f0f3] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div
          className={`flex justify-between items-center px-6 py-4 border-b border-gray-200 ${neumorphStyles.smallInset} flex-shrink-0`}
        >
          <h2 className="text-2xl font-bold text-[#252422]">리뷰 수정</h2>
          <button
            onClick={handleCancel}
            className={`p-2 rounded-full ${neumorphStyles.small} ${neumorphStyles.hover}`}
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* 이미지 */}
          <div className="w-full lg:w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2 text-[#252422]">사진</h3>
                <p className="text-sm text-gray-600">
                  사진은 최대 15장까지 업로드 가능합니다.
                </p>
              </div>

              {/* 기존 이미지 */}
              {existingImages.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-gray-700">
                    기존 이미지
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {existingImages.map((imgUrl, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <img
                          src={imgUrl}
                          alt={`기존 이미지 ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = defaultImage;
                          }}
                        />
                        <button
                          className="absolute top-1 right-1 p-1 bg-[#f5861d] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveExistingImage(imgUrl)}
                          aria-label="이미지 삭제"
                        >
                          <TrashIcon className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 새 이미지 업로드 */}
              <div>
                <h4 className="text-sm font-semibold mb-2 text-gray-700">
                  새 이미지 추가
                </h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg min-h-[200px] max-h-[400px] overflow-y-auto">
                  {newPhotos.length === 0 ? (
                    <UploadImages onUpload={handleUpload} mode="multiple" />
                  ) : (
                    <div className="p-4 space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        {newPhotos.map((photo, index) => (
                          <div
                            key={photo.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragOver={handleDragOver}
                            className="relative group cursor-move"
                          >
                            <img
                              src={photo.preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              className="absolute top-1 right-1 p-1 bg-[#f5861d] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveNewPhoto(index)}
                              aria-label="이미지 삭제"
                            >
                              <TrashIcon className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <UploadImages onUpload={handleUpload} mode="multiple" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 후기 */}
          <div className="w-full lg:w-1/2 p-6 overflow-y-auto">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#252422]">후기</h3>
              <textarea
                value={content}
                onChange={handleChange}
                className={`resize-none outline-none w-full h-[500px] p-4 rounded-xl border-2 transition-colors ${
                  error ? 'border-red-500' : 'border-gray-300'
                } ${neumorphStyles.small} ${neumorphStyles.hover}`}
                placeholder="-리뷰 작성 시 유의사항 한 번 확인하기!&#13;&#13;-리뷰를 보는 모든 사용자와 사업자에게 상처가 되는 욕설, 비방, 명예훼손성 표현은 사용하지 말아주세요."
                maxLength={1000}
              />
              <p
                className={`text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}
              >
                {error
                  ? '1000자 이내로 입력해주세요'
                  : `${content.length}/1000`}
              </p>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div
          className={`flex justify-end gap-3 px-6 py-4 border-t border-gray-200 ${neumorphStyles.smallInset} flex-shrink-0`}
        >
          <button
            className={styleUtils.buttonStyle(false, false, 'lg')}
            onClick={handleCancel}
          >
            취소
          </button>
          <button
            className={styleUtils.buttonStyle(true, error || loading, 'lg')}
            onClick={handleSave}
            disabled={error || loading}
          >
            수정 완료
          </button>
        </div>
      </div>
    </div>
  );
}
