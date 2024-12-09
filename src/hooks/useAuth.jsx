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
        setUser(data.user);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    Cookies.remove('accessToken');
    setUser(null);
  };

  return { login, logout };
};
