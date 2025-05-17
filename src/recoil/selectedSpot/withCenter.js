import { selector } from 'recoil';
import selectedSpotAtom from './atom';
import centerAtom from '../center';

const selectedSpotWithCenter = selector({
  key: 'selectedSpotWithCenter',
  get: ({ get }) => {
    return get(selectedSpotAtom);
  },
  set: ({ set }, spot) => {
    set(selectedSpotAtom, spot);
    set(centerAtom, {
      lat: spot.position.lat(),
      lng: spot.position.lng(),
    });
  },
});

export default selectedSpotWithCenter;