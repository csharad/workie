<template>
  <v-list class="pa-0">
    <transition-group name="task-slide" tag="div">
      <v-list-tile class="py-1 white" v-if="tasks.length === 0" key="no-task">
        <v-list-tile-title class="subheading text-xs-center grey--text"
          >No Tasks</v-list-tile-title
        >
      </v-list-tile>
      <task-list-item
        v-for="task in incompleteTasks"
        :task="task"
        :key="task.id"
        class="task-item"
      ></task-list-item>
      <div
        key="completed"
        class="body-2 grey--text pa-2 completed-text"
        v-if="completedTasks.length !== 0"
      >
        COMPLETED
      </div>
      <task-list-item
        v-for="task in completedTasks"
        :task="task"
        :key="task.id"
        class="task-item"
      ></task-list-item>
    </transition-group>
  </v-list>
</template>

<script>
import TaskListItem from './TaskListItem';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'TaskList',
  components: {
    TaskListItem
  },
  computed: {
    ...mapState(['tasks']),
    incompleteTasks() {
      return this.tasks
        .filter(task => !task.is_completed)
        .sort((a, b) => (a.id < b.id ? 1 : a.id > b.id ? -1 : 0));
    },
    completedTasks() {
      return this.tasks
        .filter(task => !!task.is_completed)
        .sort((a, b) => {
          const aDate = new Date(a.completed_on).getTime();
          const bDate = new Date(b.completed_on).getTime();
          return aDate < bDate ? 1 : aDate > bDate ? -1 : 0;
        });
    }
  },
  async created() {
    await this.getAllTasks();
  },
  methods: {
    ...mapActions(['getAllTasks'])
  }
};
</script>

<style lang="stylus" scoped>
.task-item, .completed-text {
  transition: all 0.4s;
}

.task-slide {
  &-leave-active {
    position: absolute;
    width: 100%;
  }

  &-enter, &-leave-to {
    opacity: 0;
    transform: translateY(-50%);
  }

  &-move {
    transition: all 0.5s;
  }
}
</style>
