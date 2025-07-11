import axios from 'axios';
import { getRecoil } from 'recoil-nexus';
import authAtom from '../recoil/auth';
import { tokenStorage } from './tokenStorage';

// 개발 환경인지 확인
const isDevelopment =
  import.meta.env.DEV ||
  import.meta.env.MODE === 'development' ||
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.port === '';

const api = axios.create({
  baseURL: isDevelopment
    ? 'http://localhost:8888'
    : 'https://api.countonme.site',
  withCredentials: true,
});

// let isRefreshing = false;
// let refreshSubscribers = [];

// function onRefreshed(token) {
//   refreshSubscribers.forEach((callback) => callback(token));
//   refreshSubscribers = [];
// }

api.interceptors.request.use((config) => {
  const token = tokenStorage.getToken();
  // console.log('axiosInstancetoken:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// config => {
//   const copyConfig = {...config};
//   if (!config.headers) return config;

// if (token && config.headers) {
//   copyConfig.headers.Authorization = `Bearer ${token}`
// }
//     return config;
//   },
//   error => {
//     console.log(error);
//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // const accessToken = getAccessToken();
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === 'auth/reissue') {
        return Promise.reject(error);
      }
      originalRequest._retry = true;
      try {
        const res = await api.post('auth/reissue');
        const newAccessToken = res.data.accessToken;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        if (refreshError.response?.status === 401) {
          console.debug(
            'Token refresh failed with 401, user probably logged out',
          );
        } else {
          console.error('Token refresh failed', refreshError);
        }
      }
    }
    return Promise.reject(error);
  },
  // try {
  //   const res = await api.post('/auth/reissue');

  //   const newAccessToken = res.data.accessToken;
  //   updateAuthAccessToken(newAccessToken);
  //   originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
  //   return api(originalRequest);
  // } catch (error) {
  //   console.error('Token refresh failed', error);
  //   alert('세션이 만료되었습니다. 로그인을 다시 시도해 주세요');
  //   window.location.href = '/login';
  //   return Promise.reject(error);
);
//   const refreshToken = getCookie(refreshToken);
// const errorStatus = error.response.status;
//   if (errorStatus === 401) {
//     try {
//       const res = await api.post('/auth/reissue', {refreshToken});

//       const newAccessToken = res.data.accessToken;
//       const newRefreshToken = res.data.refreshToken;
//       setAuth({accessToken: newAccessToken, isAuthenticated: true});
//       setCookie(refreshToken, newRefreshToken, { path: '/'
//       });

//       originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//       return await axios(originalRequest);
//     } catch (err) {
//       alert('다시 로그인 해주세요.');
//       window.location.replace('/login');
//     }
//   }
//   return Promise.reject(error);
// }
// async (config) => {
//   // /auth/reissue, /auth/logout 요청은 토큰 갱신 로직을 타지 않게 예외 처리
//   if (config.url === '/auth/reissue' || config.url === '/auth/logout')
//     return config;

//   let token = getRecoil(authAtom).accessToken;

//   if (!token) {
//     if (!isRefreshing) {
//       isRefreshing = true;
//       try {
//         const res = await api.post('/auth/reissue', null, {
//         });
//         token = res.data.accessToken;
//         setRecoil(authAtom, { accessToken: token });
//         onRefreshed(token);
//       } catch (err) {
//         console.error('토큰 갱신 실패:', err);
//         if (window.location.pathname !== '/login') {
//           window.location.href = '/login';
//         }
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     // 토큰이 갱신될 때까지 대기
//     return new Promise((resolve) => {
//       refreshSubscribers.push((newToken) => {
//         config.headers['Authorization'] = `Bearer ${newToken}`;
//         resolve(config);
//       });
//     });
//   }

//   if (token) {
//     config.headers['Authorization'] = `Bearer ${token}`;
//   }
//   return config;
// },
// (err) => Promise.reject(err),
// );

export default api;
