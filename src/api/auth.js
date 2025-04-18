import axios from './axiosInstance';

export const logoutRequest = () => axios.post('/auth/logout', null, {
  withCredentials: true,
});
