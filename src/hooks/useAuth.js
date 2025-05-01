import { useSetRecoilState, useResetRecoilState } from 'recoil';
import authAtom from '../recoil/auth';
import userAtom from '../recoil/user';
import { useCallback, useEffect } from 'react';
import api from '../utils/axiosInstance.js';

export default function useAuth() {
  // console.log('useAuth호출');
  const setAuth = useSetRecoilState(authAtom);
  const resetAuth = useResetRecoilState(authAtom);
  const resetUser = useResetRecoilState(userAtom);

  const login = (accessToken) => {
    console.log('로그인시도');
    setAuth({ accessToken });
    localStorage.setItem('isLoggedIn', 'true');
  };

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('로그아웃 실패:', err.response?.data || err.message);
    } finally {
      resetAuth();
      resetUser();
      localStorage.removeItem('isLoggedIn');
    }
  }, [resetAuth, resetUser]);

  const reissue = useCallback(async () => {
    try {
      const res = await api.post('auth/reissue');
      const newToken = res.data.accessToken;
      setAuth({ accessToken: newToken });
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      logout();
    }
  }, [setAuth, logout]);

  useEffect(() => {
    const shouldReissue = localStorage.getItem('isLoggedIn') === 'true';
    if (shouldReissue) {
      reissue();
    }
  }, [reissue]);

  return { login, logout, reissue };
}
