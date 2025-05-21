import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import authAtom from '../recoil/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8888';

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
  }) => {
    setLoading(true);
    setError(null);
    try {
      if (!auth.isAuthenticated) {
        navigate('/login-notice');
        throw new Error('로그인이 필요합니다.');
      }

      const response = await fetch(`${API_URL}/trips`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          destinations,
          startDate,
          endDate,
          spotIds,
        }),
      });

      if (response.status === 401) {
        navigate('/login-notice');
        throw new Error('로그인이 만료되었습니다. 다시 로그인해주세요.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '여행 생성에 실패했습니다.');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to create trip:', error);
      setError(error.message);
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
