import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import axiosInstance from '../utils/axiosInstance';

const useSocket = (tripId) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // 소켓 연결 해제
  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setError(null);
  }, []);

  // 소켓 연결
  const connectSocket = useCallback(() => {
    if (!tripId) return;

    const baseURL = axiosInstance.defaults.baseURL;
    const socketURL = baseURL.replace(/^https?:\/\//, '').split('/')[0];
    const protocol = baseURL.startsWith('https') ? 'https' : 'http';

    setIsConnecting(true);
    setError(null);

    // 기존 소켓이 있다면 정리
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // 소켓 연결 생성
    socketRef.current = io(`${protocol}://${socketURL}`, {
      path: '/socket.io/',
      transports: ['websocket'],
      query: { tripId },
      withCredentials: true,
      timeout: 15000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      forceNew: true,
      autoConnect: false,
    });

    // 이벤트 리스너 설정
    socketRef.current.on('connect', () => {
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    });

    socketRef.current.on('connecting', () => {
      setIsConnected(false);
      setIsConnecting(true);
      setError(null);
    });

    socketRef.current.on('connect_error', (err) => {
      setIsConnected(false);
      setIsConnecting(false);
      setError(err);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      setIsConnecting(false);
    });

    socketRef.current.on('reconnect', () => {
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    });

    socketRef.current.on('reconnect_failed', () => {
      setIsConnected(false);
      setIsConnecting(false);
      setError(new Error('소켓 재연결에 실패했습니다.'));
    });

    socketRef.current.on('reconnect_attempt', () => {
      setIsConnecting(true);
    });

    // 연결 시작
    socketRef.current.connect();
  }, [tripId]);

  // tripId가 변경될 때 연결
  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, [tripId, connectSocket, disconnectSocket]);

  return {
    socket: socketRef.current,
    isConnected,
    isConnecting,
    error,
  };
};

export default useSocket;
