import React, { useEffect, useState } from 'react';
import { Outlet, useParams, Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

import useSocket from '../hooks/useSocket';
import useTrip from '../hooks/useTrip';
import TripProfile from '../components/user/tripProfile';
import Invitation from '../components/invitation';

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
  const { socket, isConnected, error } = useSocket(tripId);
  const { getTrip } = useTrip();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    if (!socket || !isConnected) {
      return;
    }

    const handleParticipantAdded = (data) => {
      const newParticipant = data.participant || data.user || data;
      
      setTripData((prev) => {
        if (!prev) return prev;
        
        const exists = prev.participants?.some(
          (p) => p.userId === newParticipant.userId
        );
        
        if (exists) {
          return prev;
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
          participants: (prev.participants || []).filter(
            (p) => p.userId !== userId
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

  const isActive = (path) => {
    return location.pathname === `/trip/${tripId}${path}`;
  };

  return (
    <div className="min-h-screen w-full bg-[#f0f0f3] font-prompt">
      <div className="h-16"></div>
      <nav className="w-full">
        <div className="max-w-[90%] mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
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

            <div className="scale-125">
              <TripProfile
                participants={tripData?.participants}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </nav>
      <main className="w-full">
        <div className="max-w-[90%] mx-auto px-4 py-6">
          {error && (
            <div style={{ color: 'red' }}>소켓 에러: {error.message}</div>
          )}
          <Outlet context={{ socket, isConnected, tripId, tripData, loading }} />
        </div>
      </main>
    </div>
  );
};

export default TripLayout;
