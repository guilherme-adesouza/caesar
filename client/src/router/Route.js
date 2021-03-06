import React from 'react';
import {
  Route,
  Redirect,
} from "react-router-dom";

import LoadingPage from '../pages/public/Loading';
import Api from '../service/Api';

export class PrivateComponent extends React.Component {

  state = {
    loading: true,
    isLogged: true,
    isAuthenticated: false,
  };

  async componentDidMount() {
    await this.doAuthenticate();
  }

  async doAuthenticate(){
    const isLogged = await Api.User.verifyAuth();
    let isAuthenticated = isLogged;
    if(isLogged && this.props.masterRoute) {
      isAuthenticated = await Api.User.verifyMaster();
    }
    this.setState({
      loading: false,
      isLogged,
      isAuthenticated,
    });
  }

  render() {
    const { Component, ...props} = this.props;
    const redirectPath = (this.state.isLogged && this.props.masterRoute) ? '/403' : '/login';

    if (this.state.loading) {
      return <LoadingPage />;
    } else {
      return (
        <React.Fragment>
          {!this.state.isAuthenticated ?
            <Redirect to={{ pathname: redirectPath}} /> :
            <Component {...props} />
          }
        </React.Fragment>
      )
    }
  }
}

export function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route {...rest} render={props => (<PrivateComponent Component={Component} {...props}/>)}/>
  )
}

export function MasterRoute({ component: Component, ...rest }) {
  return (
    <Route {...rest} render={props => (<PrivateComponent Component={Component} masterRoute={true} {...props}/>)}/>
  )
}
