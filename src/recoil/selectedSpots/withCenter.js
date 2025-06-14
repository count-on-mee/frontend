import { selector } from 'recoil';
import selectedSpotsAtom from './atom';
import centerAtom from '../center';

const selectedSpotsWithCenter = selector({
  key: 'selectedSpotsWithCenter',
  get: ({ get }) => {
    return get(selectedSpotsAtom);
  },
  set: ({ set }, spot) => {
    set(selectedSpotsAtom, spot);
    set(centerAtom, {
      lat: spot.position.lat(),
      lng: spot.position.lng(),
    });
  },
});

export default selectedSpotsWithCenter;
