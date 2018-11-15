import React, { Component } from 'react';
import {
  ListItem,
  ListItemText,
  Icon,
  IconButton,
  withStyles
} from '@material-ui/core';

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
  }
});

class TaskListItem extends Component {
  render() {
    const { task, classes } = this.props;

    let tick;
    if (task.is_completed) {
      tick = (
        <IconButton className={classes.check}>
          <Icon>done_all</Icon>
        </IconButton>
      );
    } else {
      tick = (
        <IconButton className={classes.check}>
          <Icon>done</Icon>
        </IconButton>
      );
    }

    return (
      <ListItem disableGutters classes={{ root: classes.listItem }}>
        {tick}
        <ListItemText classes={{ root: classes.listItemText }}>
          {task.task}
        </ListItemText>
        <IconButton className={classes.trash}>
          <Icon>delete</Icon>
        </IconButton>
      </ListItem>
    );
  }
}

export default withStyles(styles)(TaskListItem);
