import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import authAtom from '../recoil/auth';

const API_URL = 'http://localhost:8888';

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
      const response = await fetch(`${API_URL}/scraps/curations`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          setAuth({ isAuthenticated: false, accessToken: null });
          navigate('/login-notice');
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || '스크랩된 큐레이션을 가져오지 못했습니다.',
        );
      }

      const data = await response.json();
      setScrapedCurations(data);
    } catch (error) {
      console.error('스크랩된 큐레이션 조회 중 오류 발생:', error);
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
      const response = await fetch(
        `https://api.countonme.site/scraps/curations/${curationId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        setAuth({ isAuthenticated: false, accessToken: null });
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
        throw new Error('로그인이 만료되었습니다. 다시 로그인해주세요.');
      }

      if (!response.ok) {
        throw new Error('큐레이션 스크랩에 실패했습니다.');
      }

      await fetchScrapedCurations();
    } catch (error) {
      console.error('Failed to scrap curation:', error);
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
      const response = await fetch(
        `http://localhost:8888/scraps/curations/${curationId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        setAuth({ isAuthenticated: false, accessToken: null });
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
        throw new Error('로그인이 만료되었습니다. 다시 로그인해주세요.');
      }

      if (!response.ok) {
        throw new Error('큐레이션 스크랩 삭제에 실패했습니다.');
      }

      await fetchScrapedCurations();
    } catch (error) {
      console.error('Failed to unscrap curation:', error);
      throw error;
    }
  };

  return { scrapedCurations, loading, error, scrapCuration, unscrapCuration };
}

export default useScrapedCurations;
