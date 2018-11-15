import React, { Component, Fragment } from 'react';
import { CssBaseline } from '@material-ui/core';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Home from './views/Home';
import Navigation from './components/Navigation';
import Login from './views/Login';
import SignUp from './views/SignUp';
import Settings from './views/Settings';
import { connect } from 'react-redux';
import { getMe } from './actions';

class App extends Component {
  routes = [
    { path: '/', component: Home, exact: true },
    { path: '/login', component: Login, exact: true },
    { path: '/sign-up', component: SignUp, exact: true },
    { path: '/settings', component: Settings, exact: true }
  ];

  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch(getMe());
  }

  render() {
    return (
      <BrowserRouter>
        <Fragment>
          <CssBaseline />
          <Navigation />
          <Switch>
            {this.routes.map((route, index) => (
              <Route {...route} key={index} />
            ))}
          </Switch>
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default connect()(App);
