import { useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import authAtom from '../recoil/auth';
import userAtom from '../recoil/user';
import api from '../utils/axiosInstance';
import { tokenStorage } from '../utils/tokenStorage';

const useInitializeUser = () => {
  const accessToken = useRecoilValue(authAtom).accessToken;
  const setUser = useSetRecoilState(userAtom);
  const setAuth = useSetRecoilState(authAtom);
  const auth = useRecoilValue(authAtom);
  const initializedRef = useRef(false);
  const wasLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const initializeAuth = async () => {
      if (!wasLoggedIn || accessToken) return;
      if (!accessToken){
        try {
        const data = await api.post('auth/reissue');
        const newAccessToken = data.data.accessToken;
        setAuth({ accessToken: newAccessToken, isAuthenticated: true});
        tokenStorage.setToken(newAccessToken);
        const response = await api.get('users/me');
        setUser(response.data);
      } catch (error) {
        setAuth({ accessToken: null, isAuthenticated: false});
      } } else if (accessToken){
        try {
          const response = await api.get('users/me');
          setUser(response.data);
        } catch (error) {
          console.error('유저 정보 가져오기 실패', error);
        }
      }
    }
    initializeAuth();
  }, []);
};

export default useInitializeUser;
