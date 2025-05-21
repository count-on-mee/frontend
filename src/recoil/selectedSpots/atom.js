import { atom } from 'recoil';

const selectedSpotsAtom = atom({
  key: 'selectedSpots',
  default: [],
});

export default selectedSpotsAtom;
