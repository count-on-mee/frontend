import axios from 'axios';
import authAtom from '../recoil/auth';
import { getRecoil, setRecoil } from 'recoil-nexus';

const api = axios.create({
  baseURL: 'http://localhost:8888',
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

api.interceptors.request.use(
  async (config) => {
    // /auth/reissue, /auth/logout 요청은 토큰 갱신 로직을 타지 않게 예외 처리
    if (config.url === '/auth/reissue' || config.url === '/auth/logout')
      return config;

    let token = getRecoil(authAtom).accessToken;

    if (!token) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const res = await api.post('/auth/reissue', null, {
            withCredentials: true,
          });
          token = res.data.accessToken;
          setRecoil(authAtom, { accessToken: token });
          onRefreshed(token);
        } catch (err) {
          console.error('토큰 갱신 실패:', err);
          window.location.href = '/login';
        } finally {
          isRefreshing = false;
        }
      }

      // 토큰이 갱신될 때까지 대기
      return new Promise((resolve) => {
        refreshSubscribers.push((newToken) => {
          config.headers['Authorization'] = `Bearer ${newToken}`;
          resolve(config);
        });
      });
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err),
);

export default api;
