import axios from 'axios';
import { tokenStorage } from './tokenStorage';
import { setRecoil } from "recoil-nexus";
import authAtom from '../recoil/auth';

const api = axios.create({
  baseURL: 'https://api.countonme.site',
  // baseURL: 'http://localhost:8888',
  withCredentials: true,
});

//----- Race condition 방지 -----
let isRefreshing = false; 
let pendingRequests = []; // 토큰 재발급 후 실행할 대기 요청들

function addPendingRequest(resolveRequest) {
  pendingRequests.push(resolveRequest);
}

function flushPendingRequests(newToken) {
  pendingRequests.forEach((resolveRequest) => resolveRequest(newToken));
  pendingRequests = [];
}

// ------ Request Interceptor -----
api.interceptors.request.use(async (config) => {
  const token = tokenStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  }
  
  //토큰이 없고 재발급 중일 때 완료시까지 대기
  if (isRefreshing) {
    await new Promise ((resolve) => {
      addPendingRequest(() => resolve());
    });
    config.headers.Authorization = `Bearer ${tokenStorage.getToken()}`;
  }
  return config;
}, (error) => Promise.reject(error));

//----- Response Interceptor -----
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if(error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

    if(!isRefreshing) {
      isRefreshing = true;
      try {
        const res = await api.post("/auth/reissue");
        const newToken = res.data.accessToken;

        tokenStorage.setToken(newToken);
        setRecoil(authAtom, {accessToken : newToken});

        isRefreshing = false;
        flushPendingRequests(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (error) {
        isRefreshing = false;
        return Promise.reject(error);
      }
    } else {
      //이미 재발급 중일 경우 대기 -> 완료되면 새 토큰으로 재요청함
      return new Promise ((resolve) => {
        addPendingRequest((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }
    }
    return Promise.reject(error)
  }
);

export default api;
