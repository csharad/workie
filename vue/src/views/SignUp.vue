<template>
  <v-container>
    <v-layout justify-center>
      <v-flex md4 class="px-4">
        <v-card class="px-4 pb-4 pt-5">
          <v-layout column align-center class="mb-5">
            <v-btn color="black" class="white--text headline logo px-0" large
              >W</v-btn
            >
            <h4 class="display-1">Sign Up</h4>
          </v-layout>
          <v-form @submit.prevent="trySignUp" ref="form">
            <v-text-field
              label="Name"
              :rules="nameRules"
              v-model="name"
            ></v-text-field>
            <v-text-field
              label="E-mail"
              :rules="emailRules"
              v-model="email"
            ></v-text-field>
            <v-text-field
              label="Password"
              type="password"
              :rules="passwordRules"
              v-model="password"
            ></v-text-field>
            <v-btn
              block
              color="primary"
              type="submit"
              class="mt-3"
              :disabled="isSubmitting"
              >Sign Up</v-btn
            >
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import { nameRules, emailRules, passwordRules } from '../validations';

export default {
  name: 'SignUp',
  inject: ['axios'],
  data: () => ({
    name: '',
    email: '',
    password: '',
    emailNotUnique: false,
    isSubmitting: false,
    nameRules: nameRules({ required: true }),
    passwordRules: passwordRules()
  }),
  computed: {
    emailRules() {
      return emailRules({ notUnique: this.emailNotUnique });
    }
  },
  watch: {
    email() {
      this.emailNotUnique = false;
    }
  },
  methods: {
    ...mapActions(['login']),
    async trySignUp() {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.isSubmitting = true;
      try {
        // Sign up the user.
        await this.axios.post('/users', {
          full_name: this.name,
          email: this.email,
          password: this.password
        });

        // Then, immediately login the user.
        await this.login({
          email: this.email,
          password: this.password
        });

        this.$router.push({
          name: 'home'
        });
      } catch (e) {
        const kind = e.response.data.kind;

        if (kind === 'NOT_UNIQUE') {
          this.emailNotUnique = true;
          this.$nextTick(() => {
            this.$refs.form.validate();
          });
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
