import React, { Component } from 'react';
import { Card, Button, Grid, Typography, withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import VTextField from '../components/VTextField';
import * as yup from 'yup';
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

class Login extends Component {
  render() {
    const { classes } = this.props;

    const form = ({ handleSubmit, isSubmitting }) => (
      <form className={classes.form} onSubmit={handleSubmit}>
        <VTextField name="email" label="Email" fullWidth margin="normal" />
        <VTextField
          name="password"
          label="Password"
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
          Login
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
                  Login
                </Typography>
              </Grid>
            </Grid>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={yup.object().shape({
                email: yup
                  .string()
                  .email()
                  .required(),
                password: yup
                  .string()
                  .min(8)
                  .required()
              })}
              onSubmit={this.tryLogin}
            >
              {form}
            </Formik>
          </Card>
        </Grid>
      </Grid>
    );
  }

  tryLogin = async (form, action) => {
    const { dispatch, history } = this.props;
    try {
      await dispatch(
        login({
          email: form.email,
          password: form.password
        })
      );
      history.push('/');
    } catch (e) {
      const kind = e.response.data.kind;
      if (kind === 'UNAUTHORIZED') {
        action.setErrors({
          password: 'The entered password is incorrect.'
        });
      } else if (kind === 'NOT_FOUND') {
        action.setErrors({
          email: 'This email is not registered.'
        });
      } else {
        action.setSubmitting(false);
        throw e;
      }
    }
    action.setSubmitting(false);
  };
}

export default withRouter(withStyles(styles)(connect()(Login)));
