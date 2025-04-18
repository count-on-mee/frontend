import { useSetRecoilState, useResetRecoilState } from 'recoil';
import  authAtom  from '../recoil/auth';
import userAtom from '../recoil/user';
import axios from '../api/axiosInstance.js';

export default function useAuth() {
  console.log("useAuth호출출")
  const setAuth = useSetRecoilState(authAtom);
  const resetAuth = useResetRecoilState(authAtom);
  const resetUser = useResetRecoilState(userAtom);

  const login = (accessToken) => {
    setAuth({ accessToken });
  };

  const logout = async () => {
    console.log('로그아웃 클릭됨');
    try {
      const res = await axios.post('/auth/logout', null, {
        withCredentials: true
      });
      console.log('응답 성공', res.data);
    } catch (err) {
      console.error('Logout failed:', err.response?.data || err.message);
    } finally {
      console.log('finally 실행');
      resetAuth();
      resetUser();
    }
  };

  return { login, logout };
};
