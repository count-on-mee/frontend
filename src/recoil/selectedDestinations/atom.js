import { atom } from 'recoil';

const selectedDestinationsAtom = atom({
  key: 'selectedDestinationsAtom',
  default: [],
});

export default selectedDestinationsAtom;
