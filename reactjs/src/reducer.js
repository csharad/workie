import { setMe, resetState } from './actions';

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
    case resetState.TYPE:
      return { ...initialState };
    default:
      return state;
  }
}
