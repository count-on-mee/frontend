import { atom } from 'recoil';

const activeSpotAtom = atom({
  key: 'activeSpotAtom',
  default: null, // 'sideBar' | 'detail'
});

export default activeSpotAtom;
