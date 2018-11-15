import React, { Component } from 'react';
import {
  Paper,
  TextField,
  Grid,
  withStyles,
  InputAdornment,
  IconButton,
  Icon,
  Typography
} from '@material-ui/core';
import TaskList from '../components/TaskList';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { createTask } from '../actions';
import * as yup from 'yup';

const styles = theme => ({
  topSpace: {
    marginTop: theme.spacing.unit * 4
  },
  input: {
    padding: theme.spacing.unit * 2.5,
    fontSize: '1.3rem'
  },
  message: {
    textAlign: 'center',
    margin: `${theme.spacing.unit * 3}px 0`
  }
});

class Home extends Component {
  render() {
    const { classes, isLogged } = this.props;

    return (
      <Grid container justify="center">
        <Grid item md={5}>
          {!isLogged && (
            <Typography
              variant="display1"
              color="textPrimary"
              className={classes.message}
            >
              You need to be logged in first
            </Typography>
          )}
          <Paper className={classes.topSpace}>
            <Formik
              initialValues={{ task: '' }}
              validationSchema={yup.object().shape({
                task: yup
                  .string()
                  .required()
                  .trim()
              })}
              onSubmit={this.handleAddingTask}
            >
              {({ values, handleSubmit, handleChange, handleBlur }) => (
                <form onSubmit={handleSubmit}>
                  <TextField
                    name="task"
                    placeholder="Enter a task to do"
                    fullWidth
                    InputProps={{
                      classes: {
                        input: classes.input
                      },
                      endAdornment: (
                        <InputAdornment>
                          <IconButton type="submit" disabled={!isLogged}>
                            <Icon>playlist_add</Icon>
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    value={values.task}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={!isLogged}
                  />
                </form>
              )}
            </Formik>
            <TaskList />
          </Paper>
        </Grid>
      </Grid>
    );
  }

  handleAddingTask = async (form, action) => {
    await this.props.dispatch(
      createTask({
        task: form.task
      })
    );
    action.resetForm();
  };
}

export default connect(state => ({
  isLogged: !!state.me
}))(withStyles(styles)(Home));
