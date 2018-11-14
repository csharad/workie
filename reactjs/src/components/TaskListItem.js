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
    const { classes } = this.props;

    return (
      <ListItem disableGutters classes={{ root: classes.listItem }}>
        <IconButton className={classes.check}>
          <Icon>done</Icon>
        </IconButton>
        <ListItemText classes={{ root: classes.listItemText }}>
          Task text
        </ListItemText>
        <IconButton className={classes.trash}>
          <Icon>delete</Icon>
        </IconButton>
      </ListItem>
    );
  }
}

export default withStyles(styles)(TaskListItem);
