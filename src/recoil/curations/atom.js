import { atom } from 'recoil';

const curationsAtom = atom({
  key: 'curationsAtom',
  default: [],
});

export default curationsAtom;
