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
      lat: spot.location.lat,
      lng: spot.location.lng,
    });
  },
});

export default curationSpotWithCenter;
