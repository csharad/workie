import React, { Component } from 'react';
import {
  ListItem,
  ListItemText,
  Icon,
  IconButton,
  withStyles
} from '@material-ui/core';
import { connect } from 'react-redux';
import { toggleTaskCompleted, deleteTask } from '../actions';

const styles = theme => ({
  listItem: {
    paddingTop: theme.spacing.unit * 0.25,
    paddingBottom: theme.spacing.unit * 0.25
  },
  check: {
    marginLeft: theme.spacing.unit
  },
  listItemText: {
    paddingLeft: theme.spacing.unit * 0.25
  },
  trash: {
    marginRight: theme.spacing.unit
  },
  strikeThrough: {
    textDecoration: 'line-through'
  }
});

class TaskListItem extends Component {
  render() {
    const { task, classes } = this.props;

    let tick;
    if (task.is_completed) {
      tick = (
        <IconButton
          className={classes.check}
          color="secondary"
          onClick={this.toggleCompleted}
        >
          <Icon>done_all</Icon>
        </IconButton>
      );
    } else {
      tick = (
        <IconButton className={classes.check} onClick={this.toggleCompleted}>
          <Icon>done</Icon>
        </IconButton>
      );
    }

    return (
      <ListItem disableGutters classes={{ root: classes.listItem }}>
        {tick}
        <ListItemText
          classes={{
            root: `${classes.listItemText} ${
              task.is_completed ? classes.strikeThrough : ''
            }`
          }}
        >
          {task.task}
        </ListItemText>
        <IconButton className={classes.trash} onClick={this.handleDelete}>
          <Icon>delete</Icon>
        </IconButton>
      </ListItem>
    );
  }

  toggleCompleted = async () => {
    const { task, dispatch } = this.props;
    await dispatch(toggleTaskCompleted(task.id, !task.is_completed));
  };

  handleDelete = async () => {
    const { task, dispatch } = this.props;
    await dispatch(deleteTask(task.id));
  };
}

export default connect()(withStyles(styles)(TaskListItem));
