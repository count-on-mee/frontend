import { useRecoilValue } from 'recoil';
import userAtom from '../recoil/user';

const useAdmin = () => {
  const user = useRecoilValue(userAtom);

  return {
    isAdmin: user?.role === 'admin',
    user,
    isLoading: user === null,
  };
};

export default useAdmin;
