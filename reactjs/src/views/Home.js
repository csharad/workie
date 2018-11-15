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
  }
});

class Home extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Grid container justify="center">
        <Grid item md={5}>
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
                          <IconButton type="submit">
                            <Icon>playlist_add</Icon>
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    value={values.task}
                    onChange={handleChange}
                    onBlur={handleBlur}
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

export default connect()(withStyles(styles)(Home));
