import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import authAtom from '../recoil/auth';
import useAuth from '../hooks/useAuth';
import api from '../utils/axiosInstance';
import { tokenStorage } from '../utils/tokenStorage';
import userAtom from '../recoil/user';

function OAuthCallbackPage() {
  const navigate = useNavigate();
  const setAuth = useSetRecoilState(authAtom);
  const setUser = useSetRecoilState(userAtom);
  const { login } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('accessToken');
    // console.log(token);

    if (token) {
      setAuth({
        accessToken: token,
        isAuthenticated: true,
      });
      login(token);
      localStorage.setItem('isLoggedIn', 'true');
      tokenStorage.setToken(token);
        const fetchUser = async() => {
          const response = await api.get('users/me');
          setUser(response.data);
      }
      fetchUser();
    }
      navigate('/spot');
  }, [setAuth, login, navigate]);

  return <div>로그인 처리 중입니다...</div>;
}

export default OAuthCallbackPage;
