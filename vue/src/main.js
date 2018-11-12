import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import Axios from 'axios';

Vue.config.productionTip = false;

export const axios = Axios.create({
  baseURL: '/api'
});

new Vue({
  router,
  store,
  provide: {
    axios
  },
  render: h => h(App)
}).$mount('#app');
