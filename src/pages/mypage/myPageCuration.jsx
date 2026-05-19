import { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import {
  XMarkIcon,
  PencilIcon,
  EyeIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import defaultImage from '../../assets/logo.png';
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
    <div className="w-full">
      <h2 className="text-[13px] font-semibold text-charcoal/50 uppercase tracking-wider mb-3 px-1">
        Curation
      </h2>

      <div className="w-full">
        {curations.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-14 h-14 mx-auto mb-4 bg-[#f0f0f3] rounded-full flex items-center justify-center shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff]">
              <PencilIcon className="w-7 h-7 text-charcoal/30" />
            </div>
            <p className="text-sm text-charcoal/40 mb-4">아직 작성한 큐레이션이 없습니다</p>
            <button
              className="text-[13px] text-charcoal/60 py-2 px-4 border border-charcoal/15 rounded-xl hover:bg-charcoal/5 transition-colors"
              onClick={() => navigate('/curation/create')}
            >
              큐레이션 작성하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
            {curations.map((curation) => (
              <div
                key={curation.curationId}
                className="relative aspect-[3/4] cursor-pointer rounded-lg overflow-hidden group"
                onClick={() => handleCurationClick(curation.curationId)}
              >
                <img
                  src={curation.imgUrl || defaultImage}
                  alt={curation.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => { e.target.src = defaultImage; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute top-1.5 right-1.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button
                    className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow"
                    onClick={(e) => handleEditCuration(e, curation.curationId)}
                  >
                    <PencilIcon className="w-3 h-3 text-charcoal/70" />
                  </button>
                  <button
                    className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow"
                    onClick={(e) => openDeleteModal(e, curation.curationId, curation.name)}
                  >
                    <XMarkIcon className="w-3 h-3 text-[#FF8C4B]" />
                  </button>
                </div>

                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-[11px] text-white font-semibold truncate">{curation.name}</p>
                  <p className="text-[10px] text-white/70 truncate">{curation.author?.nickname || '익명'}</p>
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
