import { selector } from 'recoil';
import itinerarySpotAtom from './atom';
import centerAtom from '../center';

const itinerarySpotWithCenter = selector({
  key: 'itinerarySpotWithCenter',
  get: ({ get }) => {
    return get(itinerarySpotAtom);
  },
  set: ({ set }, spot) => {
    set(itinerarySpotAtom, spot);
    set(centerAtom, {
      lat: spot.location.lat,
      lng: spot.location.lng,
    });
  },
});

export default itinerarySpotWithCenter;
