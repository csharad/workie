<template>
  <v-app>
    <v-toolbar dark color="secondary">
      <v-toolbar-title>
        <v-btn flat :to="{ name: 'home' }" active-class
          >Workie {{ firstName }}</v-btn
        >
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="!me">
        <v-btn flat :to="{ name: 'login' }">Login</v-btn>
        <v-btn flat :to="{ name: 'sign-up' }">Sign Up</v-btn>
      </template>
      <template v-else>
        <v-btn flat :to="{ name: 'settings' }">Settings</v-btn>
        <v-btn flat @click="tryLogout">Logout</v-btn>
      </template>
    </v-toolbar>
    <router-view></router-view>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapState(['me']),
    firstName() {
      return this.me && this.me.full_name && this.me.full_name.split(' ')[0];
    }
  },
  async created() {
    await this.getMe();
  },
  methods: {
    ...mapActions(['getMe', 'logout']),
    async tryLogout() {
      await this.logout();
    }
  }
};
</script>
