import { atom } from 'recoil';

const markersAtom = atom({
  key: 'markersAtom',
  default: [],
});

export default markersAtom;