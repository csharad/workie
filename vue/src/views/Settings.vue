<template>
  <v-container>
    <v-layout justify-center>
      <v-flex md6>
        <v-card class="pa-4">
          <h5 class="headline">Settings</h5>

          <v-form ref="form" @submit.prevent="updateMe">
            <v-text-field label="Name" v-model.trim="name"></v-text-field>
            <v-text-field
              label="Email"
              v-model="email"
              :rules="emailRules"
            ></v-text-field>
            <v-text-field
              label="Password"
              type="password"
              v-model="password"
              :rules="passwordRules"
            ></v-text-field>
            <v-btn type="submit" color="primary" class="mx-0">Update</v-btn>
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
          @close="confirmationClose"
        ></password-confirmation>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PasswordConfirmation from '../components/PasswordConfirmation';
import { emailRules, passwordRules } from '../validations';
import { mapState } from 'vuex';

export default {
  name: 'Settings',
  inject: ['axios'],
  components: {
    PasswordConfirmation
  },
  data() {
    const { full_name, email } = this.$store.state.me || {};

    return {
      name: full_name || '',
      email: email || '',
      password: '',
      confirmation: null, // either 'delete' | 'update'
      passwordRules: passwordRules({ required: false }),
      emailNotUnique: false
    };
  },
  computed: {
    ...mapState(['me']),
    data() {
      return this.confirmation
        ? this.confirmation === 'delete'
          ? {}
          : { name: this.name, email: this.email, password: this.password }
        : null;
    },
    emailRules() {
      return emailRules({ notUnique: this.emailNotUnique });
    }
  },
  watch: {
    email() {
      this.emailNotUnique = false;
    },
    me(newVal) {
      if (newVal) {
        const { full_name, email } = newVal;
        this.name = full_name;
        this.email = email;
      }
    }
  },
  methods: {
    updateMe() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.confirmation = 'update';
    },
    confirmationClose(err) {
      this.confirmation = null;
      if (err === 'NOT_UNIQUE') {
        this.emailNotUnique = true;
      } else {
        this.password = '';
      }
    }
  }
};
</script>
