import { atom } from 'recoil';

export const spotsAtom = atom({
  key: 'spotsAtom',
  default: Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Spot ${i + 1}`,
    type: `Type ${i + 1}`,
    description: `Description ${i + 1}`,
  })),
});
