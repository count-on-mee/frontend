import { selector } from 'recoil';
import curationSpotAtom from './atom';
import centerAtom from '../center';

const curationSpotWithCenter = selector({
  key: 'curationSpotWithCenter',
  get: ({ get }) => {
    return get(curationSpotAtom);
  },
  set: ({ set }, spot) => {
    set(curationSpotAtom, spot);
    set(centerAtom, {
      lat: spot.position.lat(),
      lng: spot.position.lng(),
    });
  },
});

export default curationSpotWithCenter;
