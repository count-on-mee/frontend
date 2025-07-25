import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import authAtom from '../recoil/auth';
import axiosInstance from '../utils/axiosInstance';
import api from '../utils/axiosInstance';

function useScrapedSpots() {
  const navigate = useNavigate();
  const [scrapedSpots, setScrapedSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useRecoilValue(authAtom);
  const setAuth = useSetRecoilState(authAtom);

  const fetchScrapedSpots = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (token && !auth.isAuthenticated) {
      setAuth({ isAuthenticated: true, accessToken: token });
    }

    if (!auth.accessToken) {
      navigate('/login-notice');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get('/scraps/spots');
      setScrapedSpots(data);
    } catch (error) {
      console.error('스크랩된 스팟 조회 중 오류 발생:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        setAuth({ isAuthenticated: false, accessToken: null });
        navigate('/login-notice');
        return;
      }
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [auth.isAuthenticated, auth.accessToken, navigate, setAuth]);

  const scrapSpot = async (spotId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    try {
      await axiosInstance.post(`/scraps/spots/${spotId}`);
      await fetchScrapedSpots();
    } catch (error) {
      console.error('Failed to scrap spot:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        setAuth({ isAuthenticated: false, accessToken: null });
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      }
      throw error;
    }
  };

  const unscrapSpot = async (spotId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    try {
      await axiosInstance.delete(`/scraps/spots/${spotId}`);
      await fetchScrapedSpots();
    } catch (error) {
      console.error('Failed to unscrap spot:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        setAuth({ isAuthenticated: false, accessToken: null });
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      }
      throw error;
    }
  };

  useEffect(() => {
    fetchScrapedSpots();
  }, [fetchScrapedSpots]);

  return { scrapedSpots, loading, error, scrapSpot, unscrapSpot };
}

export default useScrapedSpots;
