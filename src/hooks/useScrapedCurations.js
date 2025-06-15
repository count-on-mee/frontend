import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import authAtom from '../recoil/auth';
import axiosInstance from '../utils/axiosInstance';

function useScrapedCurations() {
  const navigate = useNavigate();
  const [scrapedCurations, setScrapedCurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useRecoilValue(authAtom);
  const setAuth = useSetRecoilState(authAtom);

  const fetchScrapedCurations = useCallback(async () => {
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
      const { data } = await axiosInstance.get('/scraps/curations');
      setScrapedCurations(data);
    } catch (error) {
      console.error('스크랩된 큐레이션 조회 중 오류 발생:', error);
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

  useEffect(() => {
    fetchScrapedCurations();
  }, [fetchScrapedCurations]);

  const scrapCuration = async (curationId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    try {
      await axiosInstance.post(`/scraps/curations/${curationId}`);
      await fetchScrapedCurations();
    } catch (error) {
      console.error('Failed to scrap curation:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        setAuth({ isAuthenticated: false, accessToken: null });
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      }
      throw error;
    }
  };

  const unscrapCuration = async (curationId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    try {
      await axiosInstance.delete(`/scraps/curations/${curationId}`);
      await fetchScrapedCurations();
    } catch (error) {
      console.error('Failed to unscrap curation:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        setAuth({ isAuthenticated: false, accessToken: null });
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      }
      throw error;
    }
  };

  return { scrapedCurations, loading, error, scrapCuration, unscrapCuration };
}

export default useScrapedCurations;
