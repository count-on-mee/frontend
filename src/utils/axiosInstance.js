import axios from 'axios';
import { tokenStorage } from './tokenStorage';

const api = axios.create({
  // baseURL: 'https://api.countonme.site',
  baseURL: 'http://localhost:8888',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const wasLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!wasLoggedIn) {
        if (originalRequest.url === 'auth/reissue') {
          return Promise.resolve();
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
    }
  },
);

export default api;
