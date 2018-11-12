<template>
  <v-container>
    <v-layout justify-center>
      <v-flex md6>
        <h4 class="display-1 text-xs-center mb-5 font-weight-light" v-if="!me">
          You need to be logged in first
        </h4>
        <v-card>
          <v-text-field
            solo
            flat
            hide-details
            label="Enter a task to do"
            height="64"
            append-icon="playlist_add"
            class="task-input"
            @click:append="add"
            @keydown.enter="add"
            v-model="text"
            :disabled="!me"
          ></v-text-field>
          <v-divider></v-divider>
          <task-list></task-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TaskList from '../components/TaskList';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Home',
  components: {
    TaskList
  },
  data: () => ({
    text: ''
  }),
  computed: mapState(['me']),
  methods: {
    ...mapActions(['createTask']),
    async add() {
      const text = this.text.trim();
      if (text.length !== 0) {
        await this.createTask(text);
        this.text = '';
      }
    }
  }
};
</script>

<style lang="stylus">
.task-input {
  position: relative;
  z-index: 100;

  & input, & label {
    font-size: 1.5rem;
  }
}

.linethrough {
  text-decoration: line-through;
}
</style>
