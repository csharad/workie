import { setMe, resetState, addTask, setTasks, updateTask } from './actions';

const initialState = {
  me: null,
  tasks: []
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
    case addTask.TYPE:
      return {
        ...state,
        tasks: [...state.tasks, action.task]
      };
    case setTasks.TYPE:
      return {
        ...state,
        tasks: action.tasks
      };
    case updateTask.TYPE:
      return {
        ...state,
        tasks: state.tasks.map(task => {
          if (task.id === action.task.id) {
            return action.task;
          }
          return task;
        })
      };
    default:
      return state;
  }
}
