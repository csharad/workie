import React, { Component } from 'react';
import { List } from '@material-ui/core';
import TaskListItem from './TaskListItem';

class TaskList extends Component {
  render() {
    return (
      <List>
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <TaskListItem key={index} />
          ))}
      </List>
    );
  }
}

export default TaskList;
