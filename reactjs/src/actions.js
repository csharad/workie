import axios from './axios';

export const login = credentials => async dispatch => {
  const { data } = await axios.post('/login', credentials);
  dispatch(resetState());
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

export const createTask = task => async dispatch => {
  const { data } = await axios.post('/tasks', task);
  dispatch(addTask(data));
};

export const listAllTasks = () => async (dispatch, getState) => {
  const state = getState();
  if (state.tasks.length === 0) {
    const { data } = await axios.get('/tasks');
    dispatch(setTasks(data));
  }
};

export const toggleTaskCompleted = (id, isCompleted) => async dispatch => {
  const { data } = await axios.patch(`/tasks/${id}`, {
    is_completed: isCompleted
  });
  dispatch(updateTask(data));
};

export const deleteTask = id => async dispatch => {
  await axios.delete(`/tasks/${id}`);
  dispatch(removeTask(id));
};

export function addTask(task) {
  return {
    type: 'ADD_TASK',
    task
  };
}
addTask.TYPE = 'ADD_TASK';

export function setTasks(tasks) {
  return {
    type: 'SET_TASKS',
    tasks
  };
}
setTasks.TYPE = 'SET_TASKS';

export function updateTask(task) {
  return {
    type: 'UPDATE_TASK',
    task
  };
}
updateTask.TYPE = 'UPDATE_TASK';

export function removeTask(id) {
  return {
    type: 'REMOVE_TASK',
    id
  };
}
removeTask.TYPE = 'REMOVE_TASK';
