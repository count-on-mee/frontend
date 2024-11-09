import { createStore } from 'redux';

const initialState = {
  markers: [],
  center: { lat: 37.5666103, lng: 126.9783882 },
  zoom: 13,
};

function mapReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_MARKERS':
      return { ...state, markers: action.payload };
    case 'SET_CENTER':
      return { ...state, center: action.payload };
    case 'SET_ZOOM':
      return { ...state, zoom: action.payload };
    default:
      return state;
  }
}

const store = createStore(mapReducer);

export default store;
