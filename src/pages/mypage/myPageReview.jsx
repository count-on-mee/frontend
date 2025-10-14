import { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon, PencilIcon, StarIcon } from '@heroicons/react/24/outline';
import defaultImage from '../../assets/icon.png';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';

function MyPageReview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    reviewId: null,
    reviewContent: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/spots/reviews/me');
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch my reviews:', error);
      if (error.response?.status === 401) {
        alert('인증이 필요합니다. 다시 로그인해주세요.');
        window.location.href = '/login';
      } else {
        alert('리뷰 조회에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (event, reviewId, reviewContent) => {
    event.stopPropagation();
    setDeleteModal({ isOpen: true, reviewId, reviewContent });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, reviewId: null, reviewContent: '' });
  };

  const deleteReview = async () => {
    if (!deleteModal.reviewId) return;

    setIsDeleting(true);
    try {
      await api.delete(`/spots/reviews/${deleteModal.reviewId}`);
      fetchMyReviews();
      closeDeleteModal();
    } catch (error) {
      console.error('Failed to delete review:', error);
      if (error.response?.status === 401) {
        alert('인증이 필요합니다. 다시 로그인해주세요.');
        window.location.href = '/login';
      } else {
        alert('리뷰 삭제에 실패했습니다.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSpotClick = (spotId) => {
    navigate(`/spot/${spotId}`);
  };

  const handleEditReview = (event, review) => {
    event.stopPropagation();
    navigate(`/review/edit/${review.spotReviewId}`, { state: { review } });
  };

  useEffect(() => {
    fetchMyReviews();
  }, []);

  return (
    <div className="px-6 py-8">
      <div className="w-full">
        {reviews.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-[#f0f0f3] to-[#e0e0e3] rounded-full flex items-center justify-center shadow-[inset_8px_8px_16px_#d1d1d1,inset_-8px_-8px_16px_#ffffff]">
              <StarIcon className="w-16 h-16 text-[#666]" />
            </div>
            <h3 className="text-2xl font-bold text-[#252422] mb-3">
              아직 작성한 리뷰가 없습니다
            </h3>
            <p className="text-[#666] mb-8 text-lg">
              방문한 장소에 대한 리뷰를 작성해보세요!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.spotReviewId}
                className="bg-[#f0f0f3] rounded-xl shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff] p-4 cursor-pointer group hover:shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] transition-all duration-300"
                onClick={() => handleSpotClick(review.spotId)}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <img
                      src={review.imgUrls?.[0] || defaultImage}
                      alt="리뷰 이미지"
                      className="w-14 h-14 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = defaultImage;
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-[#252422] mb-1">
                          리뷰 #{review.spotReviewId}
                        </h3>
                        <p className="text-gray-700 mb-2 line-clamp-2 text-sm">
                          {review.content}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                          <span>작성자: {review.author?.nickname}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-3">
                        <button
                          className="p-1.5 bg-[#f0f0f3] rounded-full shadow-[4px_4px_8px_#d1d1d1,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_4px_#d1d1d1,inset_-2px_-2px_4px_#ffffff] opacity-0 group-hover:opacity-100 transition-all duration-300"
                          onClick={(event) => handleEditReview(event, review)}
                        >
                          <PencilIcon className="w-3.5 h-3.5 text-[#666]" />
                        </button>
                        <button
                          className="p-1.5 bg-[#f0f0f3] rounded-full shadow-[4px_4px_8px_#d1d1d1,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_4px_#d1d1d1,inset_-2px_-2px_4px_#ffffff] opacity-0 group-hover:opacity-100 transition-all duration-300"
                          onClick={(event) =>
                            openDeleteModal(
                              event,
                              review.spotReviewId,
                              review.content,
                            )
                          }
                        >
                          <XMarkIcon className="w-3.5 h-3.5 text-[#FF8C4B]" />
                        </button>
                      </div>
                    </div>
                    {review.imgUrls && review.imgUrls.length > 0 && (
                      <div className="flex gap-1.5 mt-2">
                        {review.imgUrls.slice(0, 3).map((imgUrl, index) => (
                          <img
                            key={index}
                            src={imgUrl}
                            alt={`리뷰 이미지 ${index + 1}`}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ))}
                        {review.imgUrls.length > 3 && (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                            +{review.imgUrls.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={deleteReview}
        title="리뷰 삭제"
        message={`이 리뷰를 삭제하시겠습니까?`}
        confirmText="삭제"
        cancelText="취소"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default MyPageReview;
