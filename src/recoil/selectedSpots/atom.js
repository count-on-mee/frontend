import { atom } from 'recoil';

const selectedSpotsAtom = atom({
  key: 'selectedSpotsAtom',
  default: [],
});

export default selectedSpotsAtom;
