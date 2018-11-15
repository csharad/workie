import React, { Component } from 'react';
import { Card, Button, Grid, Typography, withStyles } from '@material-ui/core';
import { Formik } from 'formik';
import * as yup from 'yup';
import VTextField from '../components/VTextField';
import axios from '../axios';
import { connect } from 'react-redux';
import { login } from '../actions';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit * 2
  },
  loginTitle: {
    margin: `48px 0`
  },
  titleText: {
    marginTop: theme.spacing.unit
  },
  form: {
    padding: `0 ${theme.spacing.unit * 2.5}px`,
    marginBottom: theme.spacing.unit * 3
  },
  button: {
    marginTop: theme.spacing.unit * 2
  }
});

class SignUp extends Component {
  render() {
    const { classes } = this.props;

    const form = ({ handleSubmit, isSubmitting }) => (
      <form className={classes.form} onSubmit={handleSubmit}>
        <VTextField label="Name" name="name" fullWidth margin="normal" />
        <VTextField label="Email" name="email" fullWidth margin="normal" />
        <VTextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.button}
          disabled={isSubmitting}
        >
          Sign Up
        </Button>
      </form>
    );

    return (
      <Grid container justify="center" className={classes.container}>
        <Grid item md={3}>
          <Card>
            <Grid container justify="center">
              <Grid item className={classes.loginTitle}>
                <Grid container justify="center">
                  <Button variant="contained" color="secondary">
                    <Typography variant="h4" color="inherit">
                      W
                    </Typography>
                  </Button>
                </Grid>
                <Typography variant="h4" className={classes.titleText}>
                  Sign Up
                </Typography>
              </Grid>
            </Grid>

            <Formik
              initialValues={{
                name: '',
                email: '',
                password: ''
              }}
              validationSchema={yup.object().shape({
                name: yup.string().required(),
                email: yup
                  .string()
                  .email()
                  .required(),
                password: yup
                  .string()
                  .min(8)
                  .required()
              })}
              onSubmit={this.trySignUp}
            >
              {form}
            </Formik>
          </Card>
        </Grid>
      </Grid>
    );
  }

  trySignUp = async (form, action) => {
    const { dispatch, history } = this.props;
    try {
      await axios.post('/users', {
        full_name: form.name,
        email: form.email,
        password: form.password
      });
      await dispatch(
        login({
          email: form.email,
          password: form.password
        })
      );
      history.push('/');
    } catch (e) {
      const kind = e.response.data.kind;
      if (kind === 'NOT_UNIQUE') {
        action.setErrors({
          email: 'This email is already used.'
        });
      } else {
        action.setSubmitting(false);
        throw e;
      }
    }
    action.setSubmitting(false);
  };
}

export default connect()(withStyles(styles)(withRouter(SignUp)));
