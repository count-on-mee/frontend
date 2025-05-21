import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import authAtom from '../recoil/auth';

const API_URL = 'http://localhost:8888';

function useScrapedSpots() {
  const navigate = useNavigate();
  const [scrapedSpots, setScrapedSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useRecoilValue(authAtom);
  const setAuth = useSetRecoilState(authAtom);

  const fetchScrapedSpots = useCallback(async () => {
    if (!auth.isAuthenticated) {
      navigate('/login-notice');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/scraps/spots`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setAuth({ isAuthenticated: false, accessToken: null });
          navigate('/login-notice');
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || '스크랩된 스팟을 가져오지 못했습니다.',
        );
      }

      const data = await response.json();
      setScrapedSpots(data);
    } catch (error) {
      console.error('스크랩된 스팟 조회 중 오류 발생:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [auth.isAuthenticated, auth.accessToken, navigate, setAuth]);

  const scrapSpot = async (spotId) => {
    if (!auth.isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/scraps/spots/${spotId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });

      if (response.status === 401) {
        setAuth({ isAuthenticated: false, accessToken: null });
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
        throw new Error('로그인이 만료되었습니다. 다시 로그인해주세요.');
      }

      if (!response.ok) {
        throw new Error('스팟 스크랩에 실패했습니다.');
      }

      await fetchScrapedSpots();
    } catch (error) {
      console.error('Failed to scrap spot:', error);
      throw error;
    }
  };

  const unscrapSpot = async (spotId) => {
    if (!auth.isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/scraps/spots/${spotId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });

      if (response.status === 401) {
        setAuth({ isAuthenticated: false, accessToken: null });
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
        throw new Error('로그인이 만료되었습니다. 다시 로그인해주세요.');
      }

      if (!response.ok) {
        throw new Error('스팟 스크랩 삭제에 실패했습니다.');
      }

      await fetchScrapedSpots();
    } catch (error) {
      console.error('Failed to unscrap spot:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchScrapedSpots();
  }, [fetchScrapedSpots]);

  return { scrapedSpots, loading, error, scrapSpot, unscrapSpot };
}

export default useScrapedSpots;
