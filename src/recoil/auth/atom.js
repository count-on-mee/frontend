import { atom } from 'recoil';

const authAtom = atom({
  key: 'auth',
  default: {
    accessToken: null,
    isAuthenticated: false,
  },
});

export default authAtom;
