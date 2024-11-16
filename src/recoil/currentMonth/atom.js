import { atom } from 'recoil';
import { format, startOfToday } from 'date-fns';

const currentMonthAtom = atom({
  key: 'currentMonthAtom',
  default: format(startOfToday(), 'yyyy-MMM'),
});

export default currentMonthAtom;
