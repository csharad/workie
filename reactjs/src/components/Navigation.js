import React, { Component } from 'react';
import { AppBar, Toolbar, Button, withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

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
    const { classes } = this.props;

    return (
      <AppBar position="sticky">
        <Toolbar>
          <BtnLink className={classes.logo} to="/">
            Workie
          </BtnLink>

          <BtnLink to="/settings">Settings</BtnLink>
          <Button color="inherit">Logout</Button>

          <BtnLink to="/login">Login</BtnLink>
          <BtnLink to="/sign-up">Sign Up</BtnLink>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Navigation);
