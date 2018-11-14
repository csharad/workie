import React, { Component } from 'react';
import {
  Paper,
  TextField,
  Grid,
  withStyles,
  InputAdornment,
  IconButton,
  Icon
} from '@material-ui/core';
import TaskList from '../components/TaskList';

const styles = theme => ({
  topSpace: {
    marginTop: theme.spacing.unit * 4
  },
  input: {
    padding: theme.spacing.unit * 2.5,
    fontSize: '1.3rem'
  }
});

class Home extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Grid container justify="center">
        <Grid item md={5}>
          <Paper className={classes.topSpace}>
            <form>
              <TextField
                placeholder="Enter a task to do"
                fullWidth
                InputProps={{
                  classes: {
                    input: classes.input
                  },
                  endAdornment: (
                    <InputAdornment>
                      <IconButton>
                        <Icon>playlist_add</Icon>
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </form>
            <TaskList />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Home);
