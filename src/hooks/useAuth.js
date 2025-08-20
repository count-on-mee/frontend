import { useSetRecoilState } from 'recoil';
import authAtom from '../recoil/auth';
import { useCallback } from 'react';
import api from '../utils/axiosInstance.js';
import { tokenStorage } from '../utils/tokenStorage.js';
import { useResetUserAtoms } from '../utils/resetUserAtoms.js';

export default function useAuth() {
  const setAuth = useSetRecoilState(authAtom);
  const resetUserAtoms = useResetUserAtoms();

  const login = (accessToken) => {
    setAuth({
      accessToken,
      isAuthenticated: true,
    });
    tokenStorage.setToken(accessToken);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('로그아웃 실패:', err.response?.data || err.message);
    } finally {
      resetUserAtoms();
      localStorage.removeItem('isLoggedIn');
    }
  }, [resetUserAtoms]);

  return { login, logout };
}
