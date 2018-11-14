import React, { Component } from 'react';
import {
  Card,
  Grid,
  Typography,
  TextField,
  withStyles,
  Button
} from '@material-ui/core';

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit * 2
  },
  card: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 4}px`
  },
  spacingTop: {
    marginTop: theme.spacing.unit * 2
  },
  deleteBtn: {
    marginTop: theme.spacing.unit
  }
});

class Settings extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Grid container justify="center" className={classes.container}>
        <Grid item md={5}>
          <Card classes={{ root: classes.card }}>
            <Typography variant="h5">Settings</Typography>

            <form>
              <TextField label="Name" margin="normal" fullWidth />
              <TextField label="Email" margin="normal" fullWidth />
              <TextField label="Password" margin="normal" fullWidth />
              <Button
                variant="contained"
                color="primary"
                className={classes.spacingTop}
              >
                Update
              </Button>
            </form>

            <Typography className={classes.spacingTop}>
              If you don't want to use this app ever again, you may delete your
              account by clicking the button below.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              className={classes.deleteBtn}
            >
              Delete My Account
            </Button>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Settings);
