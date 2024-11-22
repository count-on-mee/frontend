import { useEffect } from 'react';
import { useSetRecoilState, useRecoilState } from 'recoil';
import Cookies from 'js-cookie';
import userAtom from '../recoil/user';

const useInitializeUser = () => {
  const [user, setUser] = useRecoilState(userAtom);

  useEffect(() => {
    const token = Cookies.get('token');
    console.log('🚀 ~ useEffect ~ token:', token);
    if (token) {
      fetchUser(token);
    }
  }, []);

  const fetchUser = async token => {
    try {
      const response = await fetch('http://localhost:8888/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const userData = await response.json();
        console.log('🚀 ~ fetchUser ~ userData:', userData);
        setUser(userData);
        console.log('🚀 ~ fetchUser ~ userData:', user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };
};

export default useInitializeUser;

// import { useEffect } from 'react';
// import { useSetRecoilState } from 'recoil';
// import userAtom from '../recoil/user';

// const useInitializeUser = () => {
//   const setUser = useSetRecoilState(userAtom);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await fetch('http://localhost:8888/users/me', {
//           method: 'GET',
//           credentials: 'include', // 쿠키를 포함해 서버로 요청
//         });

//         if (response.ok) {
//           const userData = await response.json();
//           setUser(userData); // 유저 상태 업데이트
//         } else {
//           setUser(null); // 인증 실패 시 상태 초기화
//         }
//       } catch (error) {
//         console.error('Failed to fetch user:', error);
//         setUser(null); // 오류 발생 시 상태 초기화
//       }
//     };

//     fetchUser();
//   }, [setUser]);
// };

// export default useInitializeUser;
