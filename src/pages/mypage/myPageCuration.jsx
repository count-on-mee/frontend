import { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import {
  XMarkIcon,
  PencilIcon,
  EyeIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import defaultImage from '../../assets/icon.png';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';

function MyPageCuration() {
  const [curations, setCurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    curationId: null,
    curationName: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchMyCurations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/curations/me');
      setCurations(response.data);
    } catch (error) {
      console.error('Failed to fetch my curations:', error);
      if (error.response?.status === 401) {
        alert('인증이 필요합니다. 다시 로그인해주세요.');
        window.location.href = '/login';
      } else {
        alert('큐레이션 조회에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (event, curationId, curationName) => {
    event.stopPropagation();
    setDeleteModal({ isOpen: true, curationId, curationName });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, curationId: null, curationName: '' });
  };

  const deleteCuration = async () => {
    if (!deleteModal.curationId) return;

    setIsDeleting(true);
    try {
      await api.delete(`/curations/${deleteModal.curationId}`);
      fetchMyCurations();
      closeDeleteModal();
    } catch (error) {
      console.error('Failed to delete curation:', error);
      if (error.response?.status === 401) {
        alert('인증이 필요합니다. 다시 로그인해주세요.');
        window.location.href = '/login';
      } else {
        alert('큐레이션 삭제에 실패했습니다.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCurationClick = (curationId) => {
    navigate(`/curation/${curationId}`);
  };

  const handleEditCuration = (event, curationId) => {
    event.stopPropagation();
    navigate(`/curation/edit/${curationId}`);
  };

  useEffect(() => {
    fetchMyCurations();
  }, []);

  // 페이지가 포커스될 때마다 데이터 새로고침
  useEffect(() => {
    const handleFocus = () => {
      fetchMyCurations();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return (
    <div className="px-6 py-8">
      <div className="w-full">
        {curations.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-[#f0f0f3] to-[#e0e0e3] rounded-full flex items-center justify-center shadow-[inset_8px_8px_16px_#d1d1d1,inset_-8px_-8px_16px_#ffffff]">
              <PencilIcon className="w-16 h-16 text-[#666]" />
            </div>
            <h3 className="text-2xl font-bold text-[#252422] mb-3">
              아직 작성한 큐레이션이 없습니다
            </h3>
            <p className="text-[#666] mb-8 text-lg">
              새로운 큐레이션을 작성해보세요!
            </p>
            <button
              className="bg-gradient-to-r from-[#EB5E28] to-[#D54E23] text-white rounded-3xl px-8 py-4 text-lg font-semibold shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/curation/create')}
            >
              큐레이션 작성하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {curations.map((curation) => (
              <div key={curation.curationId} className="group h-full">
                <div
                  className="relative h-full cursor-pointer bg-[#f0f0f3] rounded-3xl overflow-hidden shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] transition-all duration-300 hover:scale-[1.02] flex flex-col"
                  onClick={() => handleCurationClick(curation.curationId)}
                >
                  {/* 이미지 컨테이너 */}
                  <div className="relative overflow-hidden">
                    <img
                      src={curation.imgUrl || defaultImage}
                      alt={curation.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = defaultImage;
                      }}
                    />
                    {/* 그라데이션 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                    {/* 액션 버튼들 */}
                    <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-blue-50 transition-all duration-300"
                        onClick={(event) =>
                          handleEditCuration(event, curation.curationId)
                        }
                      >
                        <PencilIcon className="w-5 h-5 text-[#666] group-hover:text-blue-600" />
                      </button>
                      <button
                        className="p-3 bg-[#f0f0f3] backdrop-blur-sm rounded-full shadow-lg hover:bg-orange-50 transition-all duration-300"
                        onClick={(event) =>
                          openDeleteModal(
                            event,
                            curation.curationId,
                            curation.name,
                          )
                        }
                      >
                        <XMarkIcon className="w-5 h-5 text-[#FF8C4B] group-hover:text-[#D54E23]" />
                      </button>
                    </div>
                  </div>

                  {/* 콘텐츠 영역 */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col">
                    <h3
                      className="text-xl font-bold text-[#252422] group-hover:text-[#EB5E28] transition-colors overflow-hidden"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {curation.name}
                    </h3>

                    <p
                      className="text-[#666] text-base overflow-hidden flex-1"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {curation.description || ''}
                    </p>

                    <div className="flex items-center justify-between pt-3">
                      {/* 작성자 정보 */}
                      <div className="text-sm text-[#999] font-medium">
                        {curation.author?.nickname || '익명'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={deleteCuration}
        title="큐레이션 삭제"
        message={`"${deleteModal.curationName}" 큐레이션을 삭제하시겠습니까?`}
        confirmText="삭제"
        cancelText="취소"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default MyPageCuration;
