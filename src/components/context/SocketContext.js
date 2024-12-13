import React, { createContext, useContext } from 'react';
import useTripSocket from '../hooks/useTripSocket';

const SocketContext = createContext();

export const SocketProvider = ({ tripId, children }) => {
  const { emit, on, socket } = useTripSocket(tripId);

  return (
    <SocketContext.Provider value={{ emit, on, socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
