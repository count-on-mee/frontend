import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import authAtom from '../recoil/auth';
import userAtom from '../recoil/user';
import axios from 'axios';

const useInitializeUser = () => {
    const accessToken = useRecoilValue(authAtom).accessToken;
  const setUser = useSetRecoilState(userAtom);

  useEffect(() => {
    const fetchUser = async () => { console.log('accessToken:', accessToken);
      if (accessToken) {
        try {
          const response = await axios.get('http://localhost:8888/users/me', {
            headers: { Authorization: `Bearer ${accessToken}`},
          });
          console.log("유저:", response.data);
          setUser(response.data);
        //   console.log("유저정보확인:", response.data);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      }
    };
    fetchUser();
  }, [accessToken,setUser]);
};

export default useInitializeUser;