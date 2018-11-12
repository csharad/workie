<template>
  <v-container>
    <v-layout justify-center>
      <v-flex md6>
        <v-card class="pa-4">
          <h5 class="headline">Settings</h5>

          <v-form>
            <v-text-field label="Name" v-model="name"></v-text-field>
            <v-text-field label="Email" v-model="email"></v-text-field>
            <v-text-field
              label="Password"
              type="password"
              v-model="password"
            ></v-text-field>
            <v-btn color="primary" class="mx-0">Update</v-btn>
          </v-form>
          <p class="mb-0 mt-3">
            If you don't want to use this app ever again, you may delete your
            account by clicking the button below.
          </p>
          <v-btn color="red" dark class="mx-0" @click="confirmation = 'delete';"
            >Delete My Account</v-btn
          >
        </v-card>
        <password-confirmation
          :confirmation="confirmation"
          :data="data"
          @close="confirmation = null;"
        ></password-confirmation>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PasswordConfirmation from '../components/PasswordConfirmation';

export default {
  name: 'Settings',
  inject: ['axios'],
  components: {
    PasswordConfirmation
  },
  data() {
    const { id, full_name, email } = this.$store.state.me || {};
    return {
      id,
      name: full_name || '',
      email: email || '',
      password: '',
      confirmation: null // either 'delete' | 'update'
    };
  },
  computed: {
    data() {
      return this.confirmation
        ? this.confirmation === 'delete'
          ? {}
          : { name: this.name, email: this.email, password: this.password }
        : null;
    }
  }
};
</script>
