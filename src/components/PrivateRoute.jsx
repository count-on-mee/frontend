import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import authAtom from '../recoil/auth'

function PrivateRoute({ children }) {
  const auth = useRecoilValue(authAtom);
    if(!auth.isAuthenticated) {
      alert("로그인이 필요한 기능입니다. 로그인해주세요.");
      return <Navigate to="/login" replace />

    }

    return children;
}

export default PrivateRoute;