import api from '../../utils/axiosInstance';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  XMarkIcon,
  CalendarIcon,
  UsersIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import TripProfile from '../../components/user/tripProfile';
import useTrip from '../../hooks/useTrip';
import { styleUtils, neumorphStyles } from '../../utils/style';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import editIcon from '../../assets/edit.png';
import selectIcon from '../../assets/selectIcon.png';
import cancelIcon from '../../assets/cancelIcon.png';

function MyPageTripList() {
  const [tripList, setTripList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tripDetails, setTripDetails] = useState({});
  const [isSectionHovered, setIsSectionHovered] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    tripId: null,
    tripTitle: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingTripId, setEditingTripId] = useState(null);
  const [titleInput, setTitleInput] = useState('');
  const [savingTripId, setSavingTripId] = useState(null);
  const navigate = useNavigate();
  const { getTrip, updateTrip } = useTrip();

  const fetchTripList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/trips');
      const data = response.data;

      const detailsPromises = data.map(async (trip) => {
        try {
          const tripDetail = await getTrip(trip.tripId);
          return { tripId: trip.tripId, detail: tripDetail };
        } catch {
          return { tripId: trip.tripId, detail: null };
        }
      });

      const details = await Promise.all(detailsPromises);
      const detailsMap = {};
      details.forEach(({ tripId, detail }) => {
        detailsMap[tripId] = detail;
      });
      setTripDetails(detailsMap);

      const accessibleTrips = data.filter(
        (trip) => detailsMap[trip.tripId] !== null,
      );
      setTripList(accessibleTrips);
    } catch (error) {
      console.error('Failed to fetch trip list:', error);
      if (error.response?.status === 401) {
        alert('인증이 필요합니다. 다시 로그인해주세요.');
        navigate('/login');
      } else {
        alert('여행 목록 조회에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  }, [getTrip, navigate]);

  const openDeleteModal = (event, tripId, tripTitle) => {
    event.stopPropagation();
    setDeleteModal({ isOpen: true, tripId, tripTitle });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, tripId: null, tripTitle: '' });
  };

  const deleteTripList = async () => {
    if (!deleteModal.tripId) return;

    setIsDeleting(true);
    try {
      await api.delete(`/trips/${deleteModal.tripId}`);
      fetchTripList();
      closeDeleteModal();
    } catch (error) {
      console.error('Failed to delete trip list:', error);
      if (error.response?.status === 401) {
        alert('인증이 필요합니다. 다시 로그인해주세요.');
        navigate('/login');
      } else {
        alert('여행 삭제에 실패했습니다.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTripClick = (tripId) => {
    navigate(`/trip/${tripId}/itinerary`);
  };

  useEffect(() => {
    fetchTripList();
  }, [fetchTripList]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full">
        <h2 className="text-[13px] font-semibold text-charcoal/50 uppercase tracking-wider mb-3 px-1">
          나의 여행
        </h2>

        <div className="space-y-3">
          {tripList.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <MapPinIcon className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-sm text-charcoal/40">아직 여행 계획이 없습니다</p>
            </div>
          ) : (
            tripList.map((trip, index) => {
              const tripDetail = tripDetails[trip.tripId];

              return (
                <div
                  key={trip.tripId}
                  className={`${neumorphStyles.base} rounded-xl transition-all duration-300 ease-in-out cursor-pointer group`}
                  onClick={() => handleTripClick(trip.tripId)}
                >
                  <div className="p-3 sm:p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`w-8 h-8 sm:w-10 sm:h-10 ${neumorphStyles.small} rounded-full flex items-center justify-center text-[#FF8C4B] font-bold text-sm sm:text-base flex-shrink-0`}
                          >
                            {index + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1 mb-1">
                              {editingTripId === trip.tripId ? (
                                <>
                                  <input
                                    className="flex-1 px-2 py-1 rounded-lg bg-[#f0f0f3] text-[#252422] text-sm shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] outline-none min-w-0"
                                    value={titleInput}
                                    onChange={(e) =>
                                      setTitleInput(e.target.value)
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                    maxLength={50}
                                  />
                                  <button
                                    className="p-0 bg-transparent shadow-none hover:shadow-none transition disabled:opacity-50 flex-shrink-0"
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      if (!titleInput?.trim() || savingTripId)
                                        return;
                                      try {
                                        setSavingTripId(trip.tripId);
                                        await updateTrip(trip.tripId, {
                                          title: titleInput.trim(),
                                        });
                                        setTripList((prev) =>
                                          prev.map((t) =>
                                            t.tripId === trip.tripId
                                              ? {
                                                  ...t,
                                                  title: titleInput.trim(),
                                                }
                                              : t,
                                          ),
                                        );
                                        setEditingTripId(null);
                                      } catch {
                                        alert(
                                          '여행 이름 수정에 실패했습니다.',
                                        );
                                      } finally {
                                        setSavingTripId(null);
                                      }
                                    }}
                                    disabled={
                                      savingTripId === trip.tripId ||
                                      !titleInput?.trim()
                                    }
                                  >
                                    <img
                                      src={selectIcon}
                                      alt="확인"
                                      className="w-7 h-7"
                                    />
                                  </button>
                                  <button
                                    className="p-0 bg-transparent shadow-none hover:shadow-none transition flex-shrink-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingTripId(null);
                                      setTitleInput('');
                                    }}
                                  >
                                    <img
                                      src={cancelIcon}
                                      alt="취소"
                                      className="w-7 h-7"
                                    />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <h3 className="text-[15px] font-semibold text-[#252422] truncate">
                                    {trip.title}
                                  </h3>
                                  <button
                                    className="p-0 bg-transparent shadow-none hover:shadow-none transition opacity-0 group-hover:opacity-100 flex-shrink-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingTripId(trip.tripId);
                                      setTitleInput(trip.title || '');
                                    }}
                                    aria-label="여행 이름 수정"
                                  >
                                    <img
                                      src={editIcon}
                                      alt="수정"
                                      className="w-4 h-4"
                                    />
                                  </button>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-charcoal/50 flex-wrap">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="w-3.5 h-3.5" />
                                <span className="text-[11px]">
                                  {trip.startDate} ~ {trip.endDate}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <UsersIcon className="w-3.5 h-3.5" />
                                <span className="text-[11px]">
                                  {tripDetail?.participants?.length || 0}명 참여
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <TripProfile
                          participants={tripDetail?.participants}
                          loading={loading || !tripDetail}
                        />
                        <button
                          className="p-1.5 flex items-center justify-center w-8 h-8 rounded-full bg-[#f0f0f3] text-[#FF8C4B] hover:text-[#D54E23] transition-all duration-200 shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff] opacity-0 group-hover:opacity-100"
                          onClick={(event) =>
                            openDeleteModal(event, trip.tripId, trip.title)
                          }
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {tripList.length > 0 && (
          <button
            className="mt-3 w-full text-[13px] text-charcoal/60 py-2 border border-charcoal/15 rounded-xl hover:bg-charcoal/5 transition-colors"
            onClick={() => navigate('/com/calendar')}
          >
            + 새로운 여행 계획하기
          </button>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={deleteTripList}
        title="여행 삭제"
        message={`"${deleteModal.tripTitle}" 여행을 삭제하시겠습니까?`}
        confirmText="삭제"
        cancelText="취소"
        isLoading={isDeleting}
        variant="trip"
      />
    </div>
  );
}

export default MyPageTripList;
