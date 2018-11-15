import React, { Component } from 'react';
import { List, ListItem, ListItemText, Typography } from '@material-ui/core';
import TaskListItem from './TaskListItem';
import { connect } from 'react-redux';
import { listAllTasks } from '../actions';

class TaskList extends Component {
  async componentDidMount() {
    await this.props.dispatch(listAllTasks());
  }

  render() {
    const { tasks } = this.props;

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

    return (
      <List>
        {tasks.map(task => (
          <TaskListItem key={task.id} task={task} />
        ))}
        {noTask}
      </List>
    );
  }
}

export default connect(state => ({
  tasks: state.tasks
}))(TaskList);
