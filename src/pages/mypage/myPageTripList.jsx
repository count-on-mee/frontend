import api from '../../utils/axiosInstance';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  XMarkIcon,
  CalendarIcon,
  UsersIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import TripProfile from '../../components/user/tripProfile';
import useTrip from '../../hooks/useTrip';
import { componentStyles, styleUtils, neumorphStyles } from '../../utils/style';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';

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
  const navigate = useNavigate();
  const { getTrip } = useTrip();

  const fetchTripList = async () => {
    try {
      setLoading(true);
      const response = await api.get('/trips');
      const data = await response.data;
      setTripList(data);

      const detailsPromises = data.map(async (trip) => {
        try {
          const tripDetail = await getTrip(trip.tripId);
          return { tripId: trip.tripId, detail: tripDetail };
        } catch (error) {
          console.error(`Failed to fetch trip ${trip.tripId} details:`, error);
          return { tripId: trip.tripId, detail: null };
        }
      });

      const details = await Promise.all(detailsPromises);
      const detailsMap = {};
      details.forEach(({ tripId, detail }) => {
        detailsMap[tripId] = detail;
      });
      setTripDetails(detailsMap);
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
  };

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
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#252422] mb-4">
            My Trip List
          </h1>
        </div>

        <div
          className={`transition-all duration-700 ease-in-out ${
            isSectionHovered
              ? 'max-h-[80vh] overflow-y-auto'
              : 'max-h-[60vh] overflow-hidden'
          }`}
          onMouseEnter={() => setIsSectionHovered(true)}
          onMouseLeave={() => setIsSectionHovered(false)}
        >
          <div className="space-y-6">
            {tripList.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <MapPinIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  아직 여행 계획이 없습니다
                </h3>
                <p className="text-gray-500">새로운 여행을 계획해보세요!</p>
              </div>
            ) : (
              tripList.map((trip, index) => {
                const tripDetail = tripDetails[trip.tripId];

                return (
                  <div
                    key={trip.tripId}
                    className={`${neumorphStyles.base} rounded-2xl transition-all duration-300 ease-in-out cursor-pointer group hover:shadow-lg mx-3 my-5`}
                    onClick={() => handleTripClick(trip.tripId)}
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <div
                              className={`w-12 h-12 ${neumorphStyles.small} rounded-full flex items-center justify-center text-[#FF8C4B] font-bold text-lg transition-all duration-200 hover:${neumorphStyles.smallInset.replace('bg-[#f0f0f3] ', '')}`}
                            >
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-[#252422] mb-1">
                                {trip.title}
                              </h3>
                              <div className="flex items-center gap-6 text-gray-600">
                                <div className="flex items-center gap-2">
                                  <CalendarIcon className="w-5 h-5" />
                                  <span className="text-sm">
                                    {trip.startDate} ~ {trip.endDate}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <UsersIcon className="w-5 h-5" />
                                  <span className="text-sm">
                                    {tripDetail?.participants?.length || 0}명
                                    참여
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <TripProfile
                              participants={tripDetail?.participants}
                              loading={loading || !tripDetail}
                            />
                          </div>

                          <button
                            className="p-2 flex items-center justify-center w-10 h-10 rounded-full bg-[#f0f0f3] text-[#FF8C4B] hover:text-[#D54E23] transition-all duration-200 shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff] opacity-0 group-hover:opacity-100"
                            onClick={(event) =>
                              openDeleteModal(event, trip.tripId, trip.title)
                            }
                          >
                            <XMarkIcon className="w-7 h-7" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {tripList.length > 0 && (
          <div className="text-center mt-12">
            <button
              className={`${styleUtils.confirmButtonStyle} inline-flex items-center gap-2`}
              onClick={() => navigate('/com/calendar')}
            >
              <span>새로운 여행 계획하기</span>
            </button>
          </div>
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
