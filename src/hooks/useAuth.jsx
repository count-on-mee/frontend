import { useSetRecoilState } from 'recoil';
import Cookies from 'js-cookie';
import userAtom from '../recoil/user';

export const useAuth = () => {
  const setUser = useSetRecoilState(userAtom);

  const login = async () => {
    try {
      const response = await fetch('/api/login', { method: 'POST' });
      const data = await response.json();

      if (data.token) {
        Cookies.set('token', data.token, { secure: true, sameSite: 'Strict' });
        setUser(data.user); // 유저 상태 업데이트
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null); // 유저 상태 초기화
  };

  return { login, logout };
};
