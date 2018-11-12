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
  inject: ['axios'],
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
    ...mapActions(['deleteMe']),
    close() {
      this.$refs.form.reset();
      this.$emit('close');
    },
    async ok() {
      if (!this.$refs.form.validate()) {
        return;
      }
      if (this.confirmation === 'delete') {
        await this.deleteUser();
      }
    },
    async deleteUser() {
      this.progress = true;
      try {
        await this.deleteMe({
          password: this.password
        });
        this.$emit('close');
        this.$router.push({
          name: 'home'
        });
      } catch (e) {
        const kind = e.response.data.kind;
        if (kind === 'UNAUTHORIZED') {
          this.wrongPassword = true;
          this.$nextTick(() => this.$refs.form.validate());
        } else {
          this.progress = false;
          throw e;
        }
      }
      this.progress = false;
    }
  }
};
</script>
