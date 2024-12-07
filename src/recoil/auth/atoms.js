import { atom } from 'recoil';

const authAtom = atom({
  key: 'auth',
  default: { isAuthenticated: false },
  effects: [
    ({ setSelf, onSet }) => {
        const savedValue = localStorage.getItem('auth');
        if (savedValue != null) {
          setSelf(JSON.parse(savedValue));
        }
        onSet((newValue) => {
          console.log('onSet called with:', newValue);
          localStorage.setItem('auth', JSON.stringify(newValue));
        })
    },
  ],
});

// const authAtom = atom({
//   key: 'auth',
//   default: {isAuthenticated: false},
//   effects: [
//     ({ setSelf, onSet }) => {
//         const savedData = localStorage.getItem("auth");
//         if (savedData) setSelf(JSON.parse(savedData));
//         onSet((newValue, isReset) => {
//           console.log('onSet called with:', newValue, isReset);
//           isReset
//             ? localStorage.removeItem("auth")
//             : localStorage.setItem("auth", JSON.stringify(newValue));
//         })
//     },
//   ],
// });

export default authAtom;