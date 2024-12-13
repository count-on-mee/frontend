import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import userAtom from '../recoil/user';

const useInitializeUser = async() => {
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
    console.log("유저정보확인:", userAtom);
  }, [setUser]);
};

export default useInitializeUser;
