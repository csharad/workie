import React, { Component, Fragment } from 'react';
import { AppBar, Toolbar, Button, withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../actions';
import { withRouter } from 'react-router-dom';

const styles = {
  logo: {
    marginRight: 'auto'
  }
};

function BtnLink(props) {
  return <Button color="inherit" {...props} component={Link} />;
}

class Navigation extends Component {
  render() {
    const { isLogged, classes } = this.props;

    let menu;
    if (isLogged) {
      menu = (
        <Fragment>
          <BtnLink to="/settings">Settings</BtnLink>
          <Button color="inherit" onClick={this.handleLogout}>
            Logout
          </Button>
        </Fragment>
      );
    } else {
      menu = (
        <Fragment>
          <BtnLink to="/login">Login</BtnLink>
          <BtnLink to="/sign-up">Sign Up</BtnLink>
        </Fragment>
      );
    }

    return (
      <AppBar position="sticky">
        <Toolbar>
          <BtnLink className={classes.logo} to="/">
            Workie
          </BtnLink>
          {menu}
        </Toolbar>
      </AppBar>
    );
  }

  handleLogout = async () => {
    const { dispatch, history } = this.props;
    await dispatch(logout());
    history.push('/');
  };
}

export default withStyles(styles)(
  connect(state => ({
    isLogged: !!state.me
  }))(withRouter(Navigation))
);
