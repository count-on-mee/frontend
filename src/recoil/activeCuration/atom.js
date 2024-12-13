import { atom } from 'recoil';

const activeCurationAtom = atom({
  key: 'activeCurationAtom',
  default: null, // 'preview' | 'sideBar' | 'detail'
});

export default activeCurationAtom;
