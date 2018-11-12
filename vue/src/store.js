import Vue from 'vue';
import Vuex from 'vuex';
import { axios } from './main';

Vue.use(Vuex);

const initialState = () => ({
  me: null,
  tasks: []
});

export default new Vuex.Store({
  state: initialState,
  mutations: {
    unsetMe(state) {
      state.me = null;
    },
    setMe(state, user) {
      state.me = user;
    },
    resetState(state) {
      const s = initialState();
      Object.keys(s).forEach(key => {
        state[key] = s[key];
      });
    },
    setTasks(state, tasks) {
      state.tasks = tasks;
    },
    addTask(state, task) {
      state.tasks.push(task);
    },
    updateTask(state, task) {
      state.tasks.forEach((oldTask, index) => {
        if (task.id === oldTask.id) {
          Object.keys(task).forEach(key => {
            state.tasks[index][key] = task[key];
          });
        }
      });
    },
    deleteTask(state, task) {
      state.tasks = state.tasks.filter(oldTask => oldTask.id !== task.id);
    }
  },
  actions: {
    async getMe({ commit, state }) {
      if (!state.me) {
        try {
          const { data } = await axios.get('/users/me');
          commit('setMe', data);
        } catch (e) {
          if (e.response.status === 401) {
            commit('unsetMe');
            return;
          }
          throw e;
        }
      }
    },
    async login({ commit }, credentials) {
      const { data } = await axios.post('/login', credentials);
      commit('setMe', data);
    },
    async logout({ commit }) {
      await axios.post('/logout');
      commit('resetState');
    },
    async deleteMe({ commit }, credentials) {
      await axios.post('/users/me/delete', credentials);
      commit('resetState');
    },
    async getAllTasks({ commit, state }) {
      if (state.tasks.length === 0) {
        const { data } = await axios.get('/tasks');
        commit('setTasks', data);
      }
    },
    async createTask({ commit }, task) {
      const { data } = await axios.post('/tasks', { task });
      commit('addTask', data);
    },
    async completeTask({ commit }, { id, isCompleted }) {
      const { data } = await axios.patch(`/tasks/${id}`, {
        is_completed: isCompleted
      });
      commit('updateTask', data);
    },
    async deleteTask({ commit }, id) {
      const { data } = await axios.delete(`/tasks/${id}`);
      commit('deleteTask', data);
    }
  }
});
