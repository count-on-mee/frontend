import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useTripSocket = tripId => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!tripId) return;

    socketRef.current = io('http://your-backend-url', {
      query: { tripId },
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [tripId]);

  const emit = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  return { emit, on, socket: socketRef.current };
};

export default useTripSocket;
