import { atom } from 'recoil';

const selectedSpotAtom = atom({
  key: 'selectedSpotAtom',
  default: null,
});

export default selectedSpotAtom;