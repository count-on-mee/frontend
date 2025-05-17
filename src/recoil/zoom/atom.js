import { atom } from 'recoil';

const zoomAtom = atom({
  key: 'zoomAtom',
  default: 15,
});

export default zoomAtom;