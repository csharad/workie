<template>
  <v-container class="pa-0">
    <v-layout justify-center>
      <v-flex md4 :class="cardSpacing">
        <v-card class="px-4 pb-4 pt-5 mt-0">
          <v-layout column align-center class="mb-5">
            <v-btn color="black" class="white--text headline logo px-0" large
              >W</v-btn
            >
            <h4 class="display-1">Login</h4>
          </v-layout>
          <v-form @submit.prevent="tryLogin" ref="form">
            <v-text-field
              label="E-mail"
              v-model="email"
              :rules="emailRules"
            ></v-text-field>
            <v-text-field
              label="Password"
              type="password"
              v-model="password"
              :rules="passwordRules"
            ></v-text-field>
            <v-btn
              block
              color="primary"
              type="submit"
              class="mt-3"
              :disabled="isSubmitting"
              >Login</v-btn
            >
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import { emailRules, passwordRules } from '../validations';

export default {
  name: 'Login',
  data: () => ({
    email: '',
    password: '',
    isSubmitting: false,
    emailNotFound: false,
    passwordWrong: false
  }),
  computed: {
    emailRules() {
      return emailRules({
        notFound: this.emailNotFound
      });
    },
    passwordRules() {
      return passwordRules({
        wrong: this.passwordWrong
      });
    },
    cardSpacing() {
      const bp = this.$vuetify.breakpoint;
      if (bp.xsOnly) {
        return '';
      } else if (bp.smOnly) {
        return 'pa-1';
      } else {
        return 'pa-4';
      }
    }
  },
  watch: {
    email() {
      this.emailNotFound = false;
    },
    password() {
      this.passwordWrong = false;
    }
  },
  methods: {
    ...mapActions(['login']),
    validateLater() {
      this.$nextTick(() => {
        this.$refs.form.validate();
      });
    },
    async tryLogin() {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.isSubmitting = true;
      try {
        await this.login({
          email: this.email,
          password: this.password
        });
        this.$router.push({ name: 'home' });
      } catch (e) {
        const kind = e.response.data.kind;
        if (kind === 'NOT_FOUND') {
          this.emailNotFound = true;
          this.validateLater();
        } else if (kind === 'UNAUTHORIZED') {
          this.passwordWrong = true;
          this.validateLater();
        } else {
          this.isSubmitting = false;
          throw e;
        }
      }
      this.isSubmitting = false;
    }
  }
};
</script>

<style lang="stylus" scoped>
.logo {
  min-width: 48px;
}
</style>
