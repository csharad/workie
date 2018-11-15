import axios from './axios';

export const login = credentials => async dispatch => {
  const { data } = await axios.post('/login', credentials);
  dispatch(setMe(data));
};

export const getMe = () => async (dispatch, getState) => {
  const state = getState();
  if (!state.me) {
    try {
      const { data } = await axios.get('/users/me');
      dispatch(setMe(data));
    } catch (e) {
      const kind = e.response.data.kind;
      if (kind === 'UNAUTHORIZED') {
        dispatch(setMe(null));
      } else {
        throw e;
      }
    }
  }
};

export const logout = () => async dispatch => {
  await axios.post('/logout');
  dispatch(resetState());
};

export function setMe(user) {
  return {
    type: 'SET_ME',
    me: user
  };
}
setMe.TYPE = 'SET_ME';

export function resetState() {
  return {
    type: 'RESET_STATE'
  };
}
resetState.TYPE = 'RESET_STATE';
