import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import authAtom from '../recoil/auth';
import userAtom from '../recoil/user';
import api from '../utils/axiosInstance';

function useTrip() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = useRecoilValue(authAtom);
  const user = useRecoilValue(userAtom);
  // console.log(auth, user);

  const createTrip = useCallback(
    async ({
      title,
      destinations,
      startDate,
      endDate,
      spotIds,
      participantFields,
    }) => {
      setLoading(true);
      setError(null);
      try {
        if (!auth.isAuthenticated) {
          navigate('/login-notice');
          throw new Error('로그인이 필요합니다.');
        }

        const requestData = {
          title,
          destinations,
          startDate,
          endDate,
          spotIds,
          participantFields,
        };

        const response = await api.post('/trips', requestData);
        return response.data;
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/login-notice');
          setError('로그인이 만료되었습니다. 다시 로그인해주세요.');
        } else {
          setError(
            error.response?.data?.message || '여행 생성에 실패했습니다.',
          );
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [auth, navigate],
  );

  const getTrip = useCallback(async (tripId) => {
    if (!tripId) return null;

    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/trips/${tripId}`, {
        params: {
          'include[]': ['itineraries', 'tripDestinations'],
        },
      });
      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTripDates = useCallback(
    async (tripId, { startDate, endDate }) => {
      if (!tripId) return;

      setLoading(true);
      setError(null);
      try {
        const response = await api.patch(`/trips/${tripId}`, {
          startDate,
          endDate,
        });
        return response.data;
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/login-notice');
          setError('로그인이 만료되었습니다. 다시 로그인해주세요.');
        } else {
          setError(
            error.response?.data?.message || '여행 날짜 수정에 실패했습니다.',
          );
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  return {
    loading,
    error,
    createTrip,
    getTrip,
    updateTripDates,
  };
}

export default useTrip;
