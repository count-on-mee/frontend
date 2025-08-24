import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import { neumorphStyles, componentStyles } from '../../utils/style';
import boardIcon from '../../assets/board.png';
import useAdmin from '../../hooks/useAdmin';
import NoticeModal from '../../components/support/noticeModal';

const NoticePage = () => {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingNotice, setEditingNotice] = useState(null);

  const { isAdmin } = useAdmin();

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/support/notices');
      setNotices(response.data);
      setError(null);
    } catch (err) {
      setError('공지사항을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchNoticeDetail = async (noticeId) => {
    try {
      const response = await api.get(`/support/notices/${noticeId}`);
      setSelectedNotice(response.data);
    } catch (err) {
      setError('공지사항 상세 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleCreateNotice = () => {
    setModalMode('create');
    setEditingNotice(null);
    setShowModal(true);
  };

  const handleEditNotice = (notice) => {
    setModalMode('edit');
    setEditingNotice(notice);
    setShowModal(true);
  };

  const handleModalSuccess = (action) => {
    fetchNotices();
    if (action === 'delete') {
      setSelectedNotice(null);
    } else if (selectedNotice) {
      fetchNoticeDetail(selectedNotice.noticeId);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div
          className={`text-lg text-gray-600 ${neumorphStyles.small} ${neumorphStyles.hover} px-6 py-3 rounded-2xl`}
        >
          로딩 중...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 w-full">
        <div
          className={`text-red-600 mb-4 ${neumorphStyles.small} ${neumorphStyles.hover} px-6 py-3 rounded-2xl`}
        >
          {error}
        </div>
        <button
          onClick={fetchNotices}
          className={`${componentStyles.button.primary} ${neumorphStyles.small} ${neumorphStyles.hover}`}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2
            className={`text-xl sm:text-2xl lg:text-3xl font-semibold text-[#252422] px-6 py-3 flex items-center gap-3`}
          >
            <img
              src={boardIcon}
              alt="공지사항"
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
            />
            공지사항
          </h2>
          {isAdmin && (
            <button
              onClick={handleCreateNotice}
              className={`${neumorphStyles.small} ${neumorphStyles.hover} px-6 py-3 rounded-xl text-[#252422] font-semibold`}
            >
              등록
            </button>
          )}
        </div>

        {selectedNotice ? (
          <div
            className={`${neumorphStyles.small} ${neumorphStyles.hover} rounded-2xl p-6`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-medium text-[#252422] flex-1 mr-4">
                {selectedNotice.title}
              </h3>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={() => handleEditNotice(selectedNotice)}
                    className={`${componentStyles.button.secondary} ${neumorphStyles.small} ${neumorphStyles.hover} px-4 py-2 rounded-xl`}
                  >
                    수정
                  </button>
                )}
                <button
                  onClick={() => setSelectedNotice(null)}
                  className={`text-[#FF8C4B] hover:text-[#D54E23] text-base sm:text-lg flex-shrink-0 ${neumorphStyles.small} ${neumorphStyles.hover} px-4 py-2 rounded-xl`}
                >
                  ← 목록으로
                </button>
              </div>
            </div>
            <div className="text-base text-gray-500 mb-4">
              {formatDate(selectedNotice.createdAt)}
            </div>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-[#252422] text-base sm:text-lg">
                {selectedNotice.content}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {notices.length === 0 ? (
              <div
                className={`text-center py-8 text-gray-500 ${neumorphStyles.small} ${neumorphStyles.hover} rounded-2xl`}
              >
                등록된 공지사항이 없습니다.
              </div>
            ) : (
              notices.map((notice) => (
                <div
                  key={notice.noticeId}
                  className={`${neumorphStyles.small} ${neumorphStyles.hover} rounded-2xl p-4 transition-all duration-200`}
                >
                  <button
                    onClick={() => fetchNoticeDetail(notice.noticeId)}
                    className="w-full text-left transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[#252422] mb-1 text-base sm:text-lg truncate">
                          {notice.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-500">
                          {formatDate(notice.createdAt)}
                        </p>
                      </div>
                      <div className="text-[#FF8C4B] ml-2 sm:ml-4 flex-shrink-0">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Notice 모달 */}
      <NoticeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        notice={editingNotice}
        onSuccess={handleModalSuccess}
        mode={modalMode}
      />
    </div>
  );
};

export default NoticePage;
