<template>
  <v-dialog :value="!!confirmation" @input="close" width="400">
    <v-card>
      <v-card-title> <h6 class="title">Are you sure?</h6> </v-card-title>
      <v-form class="px-3" ref="form" @submit.prevent="ok">
        <v-text-field
          label="Password"
          type="password"
          :rules="passwordRules"
          v-model="password"
          autofocus
          v-if="confirmation"
        ></v-text-field>
        <v-layout>
          <v-spacer></v-spacer>
          <div class="pb-2">
            <v-btn small flat @click="close" :disabled="progress">Cancel</v-btn>
            <v-btn
              type="submit"
              small
              color="primary"
              class="mr-0"
              :disabled="progress"
              >Ok</v-btn
            >
          </div>
        </v-layout>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import { passwordRules } from '../validations';

export default {
  name: 'PasswordConfirmation',
  props: {
    confirmation: String,
    data: Object
  },
  data: () => ({
    password: '',
    wrongPassword: false,
    progress: false
  }),
  computed: {
    passwordRules() {
      return passwordRules({ wrong: this.wrongPassword });
    }
  },
  watch: {
    password() {
      this.wrongPassword = false;
    }
  },
  methods: {
    ...mapActions(['deleteMe', 'updateMe']),
    close(kind) {
      this.$refs.form.reset();
      this.$emit('close', kind);
    },
    async ok() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.progress = true;
      try {
        if (this.confirmation === 'delete') {
          await this.deleteUser();
        } else if (this.confirmation === 'update') {
          await this.updateUser();
        }
      } catch (e) {
        const kind = e.response.data.kind;
        if (kind === 'UNAUTHORIZED') {
          this.wrongPassword = true;
          this.$nextTick(() => this.$refs.form.validate());
        } else if (kind === 'NOT_UNIQUE') {
          this.close(kind);
        } else {
          this.progress = false;
          throw e;
        }
      }
      this.progress = false;
    },
    async deleteUser() {
      await this.deleteMe({
        password: this.password
      });
      this.close();
      this.$router.push({
        name: 'home'
      });
    },
    async updateUser() {
      const { name, email, password } = this.data;
      await this.updateMe({
        full_name: name,
        email,
        new_password: password.length === 0 ? null : password,
        password: this.password
      });
      this.close();
    }
  }
};
</script>
