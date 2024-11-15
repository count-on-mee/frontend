import { atom } from 'recoil';

const tripDatesAtom = atom({
  key: 'tripDatesAtom',
  default: {
    startDate: null,
    endDate: null,
  },
});

export default tripDatesAtom;
