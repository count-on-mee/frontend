import { getRecoil } from "recoil-nexus";
import authAtom from "../recoil/auth";

export const useAutoLogin = () => {
  const setAuth = useSetRecoilState(authAtom);
  const setUser = useSetRecoilState(userAtom);
  const token = getRecoil(authAtom).accessToken;

  useEffect(() => {
    const reissue = async () => {
      if (token) return;
      try {
        const res = await api.post('/auth/reissue');

        if (!res.ok) throw new Error('Reissue failed');

        const data = await res.data;
        const newAccessToken = data.accessToken;

        setAuth({ accessToken: newAccessToken });

        const userRes = await api.get('/user/me');
        const userData = await userRes.data;
        setUser(userData);
      } catch (e) {
        console.error('자동 로그인 실패: ', e);
      }
    };

    reissue();
  }, [setAuth, setUser]);
};
