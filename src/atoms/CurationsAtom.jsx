import { atom } from 'recoil';

export const curationsAtom = atom({
  key: 'curationsAtom',
  default: Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Curation ${i + 1}`,
    description: `Description ${i + 1}`,
  })),
});
