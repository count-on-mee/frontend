import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_BACKEND_URL, {
  withCredentials: true,
  autoConnect: true,
});

socket.on('connect', () => {
  console.log('서버에 연결되었습니다.');
});

socket.on('disconnect', () => {
  console.log('서버와의 연결이 끊어졌습니다.');
});

socket.on('error', (error) => {
  console.error('소켓 에러:', error);
});

export { socket };
