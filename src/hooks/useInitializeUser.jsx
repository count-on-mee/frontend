import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import Cookies from 'js-cookie';
import userAtom from '../recoil/user';

const useInitializeUser = () => {
  const setUser = useSetRecoilState(userAtom);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      fetchUser(token);
    }
  }, []);

  const fetchUser = async token => {
    try {
      const response = await fetch('http://localhost:8888/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };
};

export default useInitializeUser;
