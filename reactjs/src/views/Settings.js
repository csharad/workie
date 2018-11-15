import React, { Component } from 'react';
import { Card, Grid, Typography, withStyles, Button } from '@material-ui/core';
import { Formik } from 'formik';
import VTextField from '../components/VTextField';
import * as yup from 'yup';
import { connect } from 'react-redux';
import SettingsConfirmation from '../components/SettingsConfirmation';

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
  constructor(props) {
    super(props);
    this.state = {
      confirmationKind: null,
      data: null
    };
    this.formRef = React.createRef();
  }

  render() {
    const { classes, name, email } = this.props;
    const { confirmationKind, data } = this.state;

    const form = ({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <VTextField name="name" label="Name" margin="normal" fullWidth />
        <VTextField name="email" label="Email" margin="normal" fullWidth />
        <VTextField
          name="password"
          type="password"
          label="Password"
          margin="normal"
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.spacingTop}
        >
          Update
        </Button>
      </form>
    );

    return (
      <Grid container justify="center" className={classes.container}>
        <Grid item md={5}>
          <Card classes={{ root: classes.card }}>
            <Typography variant="h5">Settings</Typography>
            <Formik
              enableReinitialize
              initialValues={{
                name: name || '',
                email: email || '',
                password: ''
              }}
              validationSchema={yup.object().shape({
                name: yup.string().trim(),
                email: yup
                  .string()
                  .email()
                  .required(),
                password: yup.string().min(8)
              })}
              onSubmit={data =>
                this.setState({
                  confirmationKind: 'update',
                  data
                })
              }
              ref={this.formRef}
            >
              {form}
            </Formik>
            <Typography className={classes.spacingTop}>
              If you don't want to use this app ever again, you may delete your
              account by clicking the button below.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              className={classes.deleteBtn}
              onClick={() => this.setState({ confirmationKind: 'delete' })}
            >
              Delete My Account
            </Button>
          </Card>
        </Grid>
        <SettingsConfirmation
          kind={confirmationKind}
          data={data}
          onClose={this.handleClose}
        />
      </Grid>
    );
  }

  handleClose = ekind => {
    this.setState({ confirmationKind: null, data: null });
    this.formRef.current.resetForm();
    if (ekind === 'NOT_UNIQUE') {
      this.formRef.current.setErrors({
        email: 'This email is already used.'
      });
    }
  };
}

export default connect(state => ({
  name: state.me && state.me.full_name,
  email: state.me && state.me.email
}))(withStyles(styles)(Settings));
