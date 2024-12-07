import { useRecoilState, useSetRecoilState } from 'recoil';
import Cookies from 'js-cookie';
import userAtom from '../recoil/user';
import authAtom from '../recoil/auth';
import { useEffect } from 'react';

const useAuth = () => {
  const setUser = useSetRecoilState(userAtom);
  const [auth, setAuth] = useRecoilState(authAtom);

  const getCookie = (name) => {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key.trim() == name) {
        return value;
      }
    }
    return null;
  }
      
  useEffect(() => {
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      login(accessToken);
    }
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
}, [auth]);
  
const login = (accessToken) => {
  if(accessToken){
    localStorage.setItem('accessToken', accessToken);
    Cookies.remove('accessToken');
    setAuth({ isAuthenticated: true });
    // setUser({ accessToken });
  }
}

useEffect(() => {
  console.log('현재 auth 상태:', auth); // 최신 값 확인
}, [auth]);

const logout = async() => {
  const response = await fetch('http://localhost:8888/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
  if(response.ok) {
    localStorage.removeItem('accessToken');
    setAuth({ isAuthenticated: false });
    setUser(null);
  } else {
  console.error('Failed to logout');
  };
}

const refreshAccessToken = async () => {
  try {
    const response = await fetch('http://localhost:8888/auth/token', {
      method: 'POST',
      credentials: 'include', 
    });

    if (response.ok) {
      const data = await response.json();
      const newAccessToken = data.accessToken;
      localStorage.setItem('accessToken', newAccessToken);
      setAuth({ isAuthenticated: true });
      return newAccessToken;
    } else {
      console.error('Failed to refresh access token');
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
  }
};

  return {login, logout, refreshAccessToken};
};
  
        
  

  

  // const refreshAccessToken = async () => {
  //   const refreshToken = Cookies.get('refreshToken');
  //   if (refreshToken) {
  //     try {
  //       const response = await fetch('api/refresh-token', {
  //         method: 'POST',
  //         headers: {'Authorization': `Bearer ${refreshToken}`}
  //       });
  //       if (response.ok) {
  //         const data = await response.json();
  //         localStorage.setItem('accessToken', data.accessToken);
  //       } else {
  //         console.error('Failed to refresh access token');
  //       }
  //     } catch (error) {
  //       console.error('Error while refreshing access token:', error);
  //     }
  //   }
  // }


  //     if (data.token) {
  //       Cookies.set('token', data.token, { secure: true, sameSite: 'Strict' });
  //       setUser(data.user);
  //     }
  //   } catch (error) {
  //     console.error('Login failed:', error);
  //   }
  // };

  // const logout = () => {
  //   Cookies.remove('token');
  //   setUser(null);
  // };

//   return { login, logout, refreshAccessToken };
// };

export default useAuth;