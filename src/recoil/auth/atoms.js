import { atom } from 'recoil';

const authAtom = atom({
  key: 'auth',
  default: { 
    isAuthenticated: false,
    token: null,
 },

});

export default authAtom;