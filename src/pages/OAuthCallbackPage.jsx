import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import authAtom from '../recoil/auth';

function OAuthCallbackPage() {
  const navigate = useNavigate();
  const setAuth = useSetRecoilState(authAtom);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('accessToken');
    console.log(token);

    if (token) {
      setAuth({
        accessToken: token,
        isAuthenticated: true,
      });
      navigate('/spot');
    }
    
  }, []);

  return <div>로그인 처리 중입니다...</div>;
}

export default OAuthCallbackPage;