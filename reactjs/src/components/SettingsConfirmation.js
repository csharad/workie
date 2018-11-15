import React, { Component } from 'react';
import { Dialog, DialogTitle, Button, withStyles } from '@material-ui/core';
import { Formik } from 'formik';
import VTextField from './VTextField';
import * as yup from 'yup';
import { connect } from 'react-redux';
import { deleteMe, updateMe } from '../actions';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
  dialog: {
    width: 400
  },
  form: {
    padding: `0 ${theme.spacing.unit * 3}px`,
    marginBottom: theme.spacing.unit * 2
  },
  buttons: {
    marginTop: theme.spacing.unit * 2,
    textAlign: 'right'
  },
  buttonRight: {
    marginLeft: theme.spacing.unit
  }
});

class SettingsConfirmation extends Component {
  render() {
    const { kind, onClose, classes } = this.props;

    return (
      <Dialog
        open={!!kind}
        onClose={onClose}
        classes={{ paper: classes.dialog }}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <Formik
          initialValues={{ password: '' }}
          validationSchema={yup.object().shape({
            password: yup
              .string()
              .min(8)
              .required()
          })}
          onSubmit={this.afterConfirmation}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form className={classes.form} onSubmit={handleSubmit}>
              <VTextField
                name="password"
                label="Password"
                type="password"
                fullWidth
              />
              <div className={classes.buttons}>
                <Button onClick={() => onClose()} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.buttonRight}
                  disabled={isSubmitting}
                >
                  Ok
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Dialog>
    );
  }

  afterConfirmation = async (form, action) => {
    const { kind, dispatch, onClose, history, data } = this.props;

    try {
      if (kind === 'delete') {
        await dispatch(
          deleteMe({
            password: form.password
          })
        );
        onClose();
        history.push('/');
      } else if (kind === 'update') {
        await dispatch(
          updateMe({
            full_name: data.name || null,
            email: data.email,
            new_password: data.password || null,
            password: form.password
          })
        );
        onClose();
        action.resetForm();
      }
    } catch (e) {
      const ekind = e.response.data.kind;
      if (ekind === 'UNAUTHORIZED') {
        action.setErrors({
          password: 'You have entered wrong password.'
        });
      } else if (ekind === 'NOT_UNIQUE') {
        onClose(ekind);
        action.resetForm();
      } else {
        action.setSubmitting(false);
        throw e;
      }
    }
    action.setSubmitting(false);
  };
}

export default connect()(withStyles(styles)(withRouter(SettingsConfirmation)));
