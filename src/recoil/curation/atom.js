import { atom } from 'recoil';

const curationsAtom = atom({
  key: 'curationsAtom',
  default: Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Curation ${i + 1}`,
    imgUrl: `https://picsum.photos/600/800/?random=`,
  })),
});

export default curationsAtom;
