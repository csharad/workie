import { setMe } from './actions';

const initialState = {
  me: null
};

export default function(state = initialState, action) {
  if (typeof action === 'undefined') {
    return state;
  }

  switch (action.type) {
    case setMe.TYPE:
      return {
        ...state,
        me: action.me
      };
    default:
      return state;
  }
}
