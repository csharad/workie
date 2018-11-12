<template>
  <v-list-tile :class="tileClasses(task.checked)">
    <v-checkbox
      hide-details
      on-icon="done_all"
      off-icon="done"
      :input-value="task.is_completed"
      @change="toggleComplete"
    ></v-checkbox>
    <v-list-tile-title :class="titleClasses(task.is_completed)">{{
      task.task
    }}</v-list-tile-title>
    <v-icon @click="deleteSelf">delete</v-icon>
  </v-list-tile>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'TaskListItem',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions(['completeTask', 'deleteTask']),
    tileClasses(checked) {
      return ['py-1 relative', { grey: checked, 'lighten-4': checked }];
    },
    titleClasses(checked) {
      return ['ml-2', { 'line-through': checked }];
    },
    async toggleComplete(val) {
      await this.completeTask({ id: this.task.id, isCompleted: val });
    },
    async deleteSelf() {
      await this.deleteTask(this.task.id);
    }
  }
};
</script>

<style lang="stylus" scoped>
.line-through {
  text-decoration: line-through;
}

.relative {
  position: relative;
}
</style>
