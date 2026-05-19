import React, { useEffect, useState } from 'react';
import {
  Outlet,
  useParams,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import clsx from 'clsx';
import useSocket from '../hooks/useSocket';
import useTrip from '../hooks/useTrip';
import TripProfile from '../components/user/tripProfile';
import Invitation from '../components/invitation';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';
import axiosInstance from '../utils/axiosInstance';
import editIcon from '../assets/edit.png';
import selectIcon from '../assets/selectIcon.png';
import cancelIcon from '../assets/cancelIcon.png';
import exitTripIcon from '../assets/exitTrip.png';

const baseShadowStyles =
  'shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.8)]';
const hoverShadowStyles =
  'hover:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]';

const navLinkStyles = (isActive) =>
  clsx(
    'px-6 py-3 rounded-full transition-all duration-300',
    'text-[#2c3e50] font-medium',
    isActive
      ? 'bg-[#f5861d] text-white shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2)]'
      : 'bg-[#f0f0f3]',
    !isActive && baseShadowStyles,
    !isActive && hoverShadowStyles,
  );

const TripLayout = () => {
  const { tripId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { socket, isConnected, error } = useSocket(tripId);
  const { getTrip, updateTrip } = useTrip();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [isSavingTitle, setIsSavingTitle] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const fetchTripData = async () => {
      if (tripId) {
        try {
          const data = await getTrip(tripId);
          setTripData(data);
        } catch (error) {
          console.error('Trip 데이터 로딩 실패:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTripData();
  }, [tripId, getTrip]);

  useEffect(() => {
    if (tripData?.title) {
      setTitleInput(tripData.title);
    }
  }, [tripData?.title]);

  useEffect(() => {
    if (!socket || !isConnected) {
      return;
    }

    const handleParticipantAdded = (data) => {
      const newParticipant = data.participant || data.user || data;

      setTripData((prev) => {
        if (!prev) return prev;

        const exists = prev.participants?.some(
          (p) => p.userId === newParticipant.userId,
        );

        if (exists) {
          return {
            ...prev,
            participants: prev.participants.map((p) =>
              p.userId === newParticipant.userId
                ? { ...p, ...newParticipant }
                : p,
            ),
          };
        }

        return {
          ...prev,
          participants: [...(prev.participants || []), newParticipant],
        };
      });
    };

    const handleParticipantRemoved = (data) => {
      const userId = data.userId || data.user?.userId || data;

      setTripData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          participants: (prev.participants || []).map((p) =>
            p.userId === userId ? { ...p, status: 'LEFT' } : p,
          ),
        };
      });
    };

    socket.on('participantAdded', handleParticipantAdded);
    socket.on('participantJoined', handleParticipantAdded);
    socket.on('userJoined', handleParticipantAdded);
    socket.on('participantRemoved', handleParticipantRemoved);
    socket.on('participantLeft', handleParticipantRemoved);
    socket.on('userLeft', handleParticipantRemoved);

    return () => {
      socket.off('participantAdded', handleParticipantAdded);
      socket.off('participantJoined', handleParticipantAdded);
      socket.off('userJoined', handleParticipantAdded);
      socket.off('participantRemoved', handleParticipantRemoved);
      socket.off('participantLeft', handleParticipantRemoved);
      socket.off('userLeft', handleParticipantRemoved);
    };
  }, [socket, isConnected]);

  useEffect(() => {
    if (!socket || !isConnected || !tripId) {
      return;
    }

    let pollCount = 0;
    const maxPolls = 5;

    const pollInterval = setInterval(async () => {
      if (pollCount >= maxPolls) {
        clearInterval(pollInterval);
        return;
      }

      try {
        const data = await getTrip(tripId);
        setTripData((prev) => {
          const newCount = data?.participants?.length || 0;
          const prevCount = prev?.participants?.length || 0;

          if (newCount !== prevCount) {
            return data;
          }

          return prev;
        });
        pollCount++;
      } catch (error) {
        console.error('참여자 목록 갱신 실패:', error);
      }
    }, 2000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [socket, isConnected, tripId, getTrip]);

  const handleLeaveTrip = async () => {
    setIsLeaving(true);
    try {
      await axiosInstance.post(`/trips/${tripId}/leave`);
      setShowLeaveModal(false);
      navigate('/');
    } catch (err) {
      console.error('여행방 나가기 실패:', err);
      alert('여행방 나가기에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLeaving(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === `/trip/${tripId}${path}`;
  };

  return (
    <div className="min-h-screen w-full bg-[#f0f0f3] font-prompt">
      <nav className="w-full sticky top-14 desktop:static bg-[#f0f0f3] z-30 shadow-[0_2px_8px_rgba(0,0,0,0.06)] desktop:shadow-none desktop:pt-4">
        <div className="max-w-[95%] desktop:max-w-[90%] mx-auto px-3 desktop:px-4">
          <div className="py-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {!isEditingTitle ? (
                <>
                  <div className="text-lg desktop:text-2xl font-semibold text-[#2c3e50] truncate">
                    {tripData?.title || '여행'}
                  </div>
                  <button
                    aria-label="여행 이름 수정"
                    className="p-0 bg-transparent shadow-none hover:shadow-none transition flex-shrink-0"
                    onClick={() => setIsEditingTitle(true)}
                    disabled={loading}
                    style={{ lineHeight: 0 }}
                  >
                    <img
                      src={editIcon}
                      alt="수정"
                      className="w-5 h-5 desktop:w-7 desktop:h-7"
                    />
                  </button>
                </>
              ) : (
                <>
                  <input
                    className="px-3 py-1.5 desktop:py-2 rounded-lg bg-[#f0f0f3] text-[#2c3e50] text-sm desktop:text-base shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] outline-none min-w-0"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    maxLength={50}
                  />
                  <div className="flex items-center flex-shrink-0">
                    <button
                      aria-label="저장"
                      className="p-0 bg-transparent shadow-none hover:shadow-none transition disabled:opacity-50"
                      onClick={async () => {
                        if (!titleInput?.trim() || isSavingTitle) return;
                        try {
                          setIsSavingTitle(true);
                          const updated = await updateTrip(tripId, {
                            title: titleInput.trim(),
                          });
                          setTripData((prev) => ({
                            ...(prev || {}),
                            ...(updated || {}),
                            title: titleInput.trim(),
                          }));
                          setIsEditingTitle(false);
                        } catch {
                          alert('여행 이름 수정에 실패했습니다.');
                        } finally {
                          setIsSavingTitle(false);
                        }
                      }}
                      disabled={isSavingTitle || !titleInput?.trim()}
                    >
                      <img
                        src={selectIcon}
                        alt="확인"
                        className="w-8 h-8 desktop:w-10 desktop:h-10"
                      />
                    </button>
                    <button
                      aria-label="취소"
                      className="p-0 bg-transparent shadow-none hover:shadow-none transition"
                      onClick={() => {
                        setTitleInput(tripData?.title || '');
                        setIsEditingTitle(false);
                      }}
                      disabled={isSavingTitle}
                    >
                      <img
                        src={cancelIcon}
                        alt="취소"
                        className="w-8 h-8 desktop:w-10 desktop:h-10"
                      />
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="flex desktop:hidden items-center gap-2 flex-shrink-0">
              <TripProfile
                participants={tripData?.participants}
                loading={loading}
              />
              <button
                aria-label="여행방 나가기"
                onClick={() => setShowLeaveModal(true)}
                className="p-0 bg-transparent shadow-none hover:shadow-none transition"
              >
                <img
                  src={exitTripIcon}
                  alt="여행방 나가기"
                  className="w-7 h-7 desktop:w-10 desktop:h-10"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[95%] desktop:max-w-[90%] mx-auto px-3 desktop:px-4 pb-2 desktop:pb-4">
          <div className="flex desktop:hidden gap-2">
            <Invitation tripId={tripId} />
            <div className="flex flex-1 gap-2">
              <Link
                to={`/trip/${tripId}/itinerary`}
                className={clsx(
                  'flex-1 text-center px-2 py-1.5 rounded-xl text-sm font-medium transition-all duration-300',
                  isActive('/itinerary')
                    ? 'bg-[#f5861d] text-white shadow-[inset_3px_3px_6px_rgba(0,0,0,0.2)]'
                    : 'bg-[#f0f0f3] text-[#2c3e50] shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,0.8)]',
                )}
              >
                일정
              </Link>
              <Link
                to={`/trip/${tripId}/details`}
                className={clsx(
                  'flex-1 text-center px-2 py-1.5 rounded-xl text-sm font-medium transition-all duration-300',
                  isActive('/details')
                    ? 'bg-[#f5861d] text-white shadow-[inset_3px_3px_6px_rgba(0,0,0,0.2)]'
                    : 'bg-[#f0f0f3] text-[#2c3e50] shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,0.8)]',
                )}
              >
                여행 관리
              </Link>
            </div>
          </div>

          <div className="hidden desktop:flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Invitation tripId={tripId} />
            </div>

            <div className="flex space-x-8">
              <Link
                to={`/trip/${tripId}/itinerary`}
                className={navLinkStyles(isActive('/itinerary'))}
              >
                일정
              </Link>
              <Link
                to={`/trip/${tripId}/details`}
                className={navLinkStyles(isActive('/details'))}
              >
                여행 관리
              </Link>
            </div>

            <div className="flex items-center gap-6">
              <div className="scale-125 mr-4">
                <TripProfile
                  participants={tripData?.participants}
                  loading={loading}
                />
              </div>
              <button
                aria-label="여행방 나가기"
                onClick={() => setShowLeaveModal(true)}
                className="p-0 bg-transparent shadow-none hover:shadow-none transition hover:opacity-80"
              >
                <img
                  src={exitTripIcon}
                  alt="여행방 나가기"
                  className="w-20 h-20"
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full">
        <div className="max-w-[95%] desktop:max-w-[90%] mx-auto px-3 desktop:px-4 py-4 desktop:py-6">
          {error && (
            <div style={{ color: 'red' }}>소켓 에러: {error.message}</div>
          )}
          <Outlet
            context={{ socket, isConnected, tripId, tripData, loading }}
          />
        </div>
      </main>

      <DeleteConfirmModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={handleLeaveTrip}
        title="여행방 나가기"
        message="정말로 이 여행방을 나가시겠습니까?"
        confirmText="나가기"
        cancelText="취소"
        isLoading={isLeaving}
      />
    </div>
  );
};

export default TripLayout;
