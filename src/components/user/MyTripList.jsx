import { getRecoil } from 'recoil-nexus';
import authAtom from '../../recoil/auth';
import api from '../../utils/axiosInstance';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  XMarkIcon,
  CalendarIcon,
  UsersIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import TripProfile from './tripProfile';
import useTrip from '../../hooks/useTrip';
import { componentStyles, styleUtils, neumorphStyles } from '../../utils/style';

export default function MyTripList() {
  const [tripList, setTripList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tripDetails, setTripDetails] = useState({});
  const [isSectionHovered, setIsSectionHovered] = useState(false);
  const navigate = useNavigate();
  const { getTrip } = useTrip();

  const fetchTripList = async () => {
    try {
      setLoading(true);
      const token = getRecoil(authAtom).accessToken;
      const response = await api.get('/trips', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
    } finally {
      setLoading(false);
    }
  };

  const deleteTripList = async (event, tripId) => {
    event.stopPropagation();
    const confirmed = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmed) return; // 취소 누르면 삭제 취소
    try {
      const token = getRecoil(authAtom).accessToken;
      await api.delete(`/trips/${tripId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTripList();
    } catch (error) {
      console.error('Failed to delete trip list:', error);
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
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#252422] mb-4">My Trip List</h1>
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
                                  {tripDetail?.participants?.length || 0}명 참여
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
                          className={`${componentStyles.deleteButton} opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-10 h-10`}
                          onClick={(event) =>
                            deleteTripList(event, trip.tripId)
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
  );
}
