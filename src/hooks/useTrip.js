import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import authAtom from '../recoil/auth';
import axiosInstance from '../utils/axiosInstance';

function useTrip() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = useRecoilValue(authAtom);

  const createTrip = async ({
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

      const response = await axiosInstance.post('/trips', requestData);

      return response.data;
    } catch (error) {
      console.error('Failed to create trip:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);

      if (error.response?.status === 401) {
        navigate('/login-notice');
        setError('로그인이 만료되었습니다. 다시 로그인해주세요.');
      } else {
        setError(error.response?.data?.message || '여행 생성에 실패했습니다.');
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createTrip,
  };
}

export default useTrip;
