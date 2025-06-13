import { atom } from 'recoil';

const curationMarkersAtom = atom({
  key: 'curationMarkersAtom',
  default: [],
});

export default curationMarkersAtom;
