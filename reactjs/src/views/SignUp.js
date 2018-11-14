import React, { Component } from 'react';
import {
  Card,
  Button,
  TextField,
  Grid,
  Typography,
  withStyles
} from '@material-ui/core';

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

            <form className={classes.form}>
              <TextField label="Name" fullWidth margin="normal" />
              <TextField label="Email" fullWidth margin="normal" />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Sign Up
              </Button>
            </form>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(SignUp);
