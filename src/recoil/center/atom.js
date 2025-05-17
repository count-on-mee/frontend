import { atom } from 'recoil';

const centerAtom = atom({
  key: 'centerAtom',
  default: { lat: 37.5666103, lng: 126.9783882 },
});

export default centerAtom;