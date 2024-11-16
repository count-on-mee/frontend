import { atom } from 'recoil';

const spotsAtom = atom({
  key: 'spotsAtom',
  default: Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Spot ${i + 1}`,
    type: `Type ${i + 1}`,
    description: `Description ${i + 1}`,
    photo: Array.from({length: 10}, (_, j) => ({
      id: `Spot${i + 1}_Photo${j + 1}`,
      description: `Spot ${i + 1} Photo${j + 1}`
    }))
  })),
});
