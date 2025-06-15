import { useRef, useCallback } from 'react';

export const useDebounce = (func, delay) => {
  const timeoutRef = useRef(null);

  return useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    },
    [func, delay],
  );
};

export const useSocketDebounce = (socket, delay = 800) => {
  const timeoutRef = useRef(null);
  const lastValueRef = useRef(null);

  return useCallback(
    (eventName, data) => {
      // 이전 값과 동일한 경우 이벤트 발송하지 않음
      const dataKey = JSON.stringify(data);
      if (lastValueRef.current === dataKey) {
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (socket && socket.connected) {
          socket.emit(eventName, data);
          lastValueRef.current = dataKey;
        }
      }, delay);
    },
    [socket, delay],
  );
};

export const useKoreanInputDebounce = (socket) => {
  const timeoutRef = useRef(null);
  const isComposingRef = useRef(false);
  const pendingDataRef = useRef(null);

  const debouncedEmit = useCallback(
    (eventName, data) => {
      // composition 중이면 데이터를 저장하고 대기
      if (isComposingRef.current) {
        pendingDataRef.current = { eventName, data };
        return;
      }

      // composition이 끝났으면 즉시 발송
      if (socket && socket.connected) {
        socket.emit(eventName, data);
      }
    },
    [socket],
  );

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const handleCompositionEnd = useCallback(() => {
    isComposingRef.current = false;

    // pending 데이터가 있으면 발송
    if (pendingDataRef.current) {
      const { eventName, data } = pendingDataRef.current;
      if (socket && socket.connected) {
        socket.emit(eventName, data);
      }
      pendingDataRef.current = null;
    }
  }, [socket]);

  return {
    debouncedEmit,
    handleCompositionStart,
    handleCompositionEnd,
  };
};
