import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import userAtom from '../recoil/user';


const useInitializeUser = () => {
  const setUser = useSetRecoilState(userAtom);

  useEffect(() => {
    const fetchUser = async () => {
      let accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const response = await fetch('http://localhost:8888/users/me', {
            headers: { Authorization: `Bearer ${accessToken}`},
          });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      }
    };
    fetchUser();
  }, [setUser]);
};

export default useInitializeUser;
