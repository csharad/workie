import React, { Component } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  withStyles
} from '@material-ui/core';
import TaskListItem from './TaskListItem';
import { connect } from 'react-redux';
import { listAllTasks } from '../actions';

const styles = theme => ({
  completed: {
    padding: `0 ${theme.spacing.unit * 2}px`
  }
});

class TaskList extends Component {
  async componentDidMount() {
    await this.props.dispatch(listAllTasks());
  }

  render() {
    const { tasks, classes } = this.props;

    let noTask = null;
    if (tasks.length === 0) {
      noTask = (
        <ListItem>
          <ListItemText disableTypography>
            <Typography align="center" color="textSecondary">
              No task yet
            </Typography>
          </ListItemText>
        </ListItem>
      );
    }

    const taskItem = task => <TaskListItem key={task.id} task={task} />;
    const completedTasks = this.completedTasks();
    let completedLabel = null;
    if (completedTasks.length !== 0) {
      completedLabel = (
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.completed}
        >
          COMPLETED
        </Typography>
      );
    }

    return (
      <List>
        {this.incompleteTasks().map(taskItem)}
        {completedLabel}
        {completedTasks.map(taskItem)}
        {noTask}
      </List>
    );
  }

  incompleteTasks = () => {
    return this.props.tasks
      .filter(task => !task.is_completed)
      .sort((a, b) => (a.id < b.id ? 1 : a.id > b.id ? -1 : 0));
  };

  completedTasks = () => {
    return this.props.tasks
      .filter(task => !!task.is_completed)
      .sort((a, b) => {
        const aDate = new Date(a.completed_on).getTime();
        const bDate = new Date(b.completed_on).getTime();
        return aDate < bDate ? 1 : aDate > bDate ? -1 : 0;
      });
  };
}

export default connect(state => ({
  tasks: state.tasks
}))(withStyles(styles)(TaskList));
