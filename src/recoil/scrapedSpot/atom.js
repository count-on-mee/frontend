import { atom } from 'recoil';

const scrapedSpotsAtom = atom({
  key: 'scrapedSpotsAtom',
  default: [],
});

export default scrapedSpotsAtom;
