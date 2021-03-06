import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import store from './store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: () =>
        import(/* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () =>
        import(/* webpackChunkName: "sign-up" */ './views/SignUp.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () =>
        import(/* webpackChunkName: "settings" */ './views/Settings.vue')
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  await store.dispatch('getMe');
  if ((to.name === 'login' || to.name === 'sign-up') && store.state.me) {
    // Hide login / sign-up routes if already logged in.
    next({ name: 'home' });
  } else if (to.name === 'settings' && !store.state.me) {
    // Hide settings page if not logged in.
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
