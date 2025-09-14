import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import authAtom from '../recoil/auth';
import api from '../utils/axiosInstance';

function useTrip() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = useRecoilValue(authAtom);

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

        const response = await api.post('/trips', {
          title,
          destinations,
          startDate,
          endDate,
          spotIds,
          participantFields,
        });
        return response.data;
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/login-notice');
          setError('로그인이 만료되었습니다. 다시 로그인해주세요.');
        } else if (error.response?.status === 400) {
          setError(error.response.data?.message || '입력 정보를 확인해주세요.');
        } else if (error.response?.status === 500) {
          setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } else {
          setError(
            error.response?.data?.message ||
              '여행 생성에 실패했습니다. 다시 시도해주세요.',
          );
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [auth, navigate],
  );

  const getTrip = useCallback(
    async (tripId) => {
      if (!tripId) return null;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/trips/${tripId}`, {
          params: {
            'include[]': ['itineraries', 'tripDestinations'],
          },
        });
        if (!response.data) return null;
        else return response.data;
      } catch (error) {
        if (error.response?.status === 404) {
          setError('존재하지 않는 여행입니다.');
        } else if (error.response?.status === 401) {
          navigate('/login-notice');
          setError('로그인이 만료되었습니다. 다시 로그인해주세요.');
        } else {
          setError('여행 정보를 불러오는데 실패했습니다.');
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
  };
}

export default useTrip;
