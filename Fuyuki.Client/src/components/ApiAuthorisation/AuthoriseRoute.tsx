import React from 'react';
import { Component } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import {
  ApplicationPaths,
  QueryParameterNames
} from './ApiAuthorisationConstants';
import authService from './AuthoriseService';

interface AuthoriseRouteProps extends RouteProps {}

interface AuthoriseRouteState {
  ready: boolean;
  authenticated: boolean;
}

export default class AuthoriseRoute extends Component<
  AuthoriseRouteProps,
  AuthoriseRouteState
> {
  private _subscription: number = 0;

  constructor(props: AuthoriseRouteProps) {
    super(props);

    this.state = {
      ready: false,
      authenticated: false
    };
  }

  componentDidMount() {
    this._subscription = authService.subscribe(() =>
      this.authenticationChanged()
    );

    this.populateAuthenticationState();
  }

  componentWillUnmount() {
    authService.unsubscribe(this._subscription);
  }

  async populateAuthenticationState() {
    const authenticated = await authService.isAuthenticated();
    this.setState({ ready: true, authenticated });
  }

  async authenticationChanged() {
    this.setState({ ready: false, authenticated: false });
    await this.populateAuthenticationState();
  }

  render() {
    const { ready, authenticated } = this.state;
    const redirectUrl = `${ApplicationPaths.Login}?${
      QueryParameterNames.ReturnUrl
    }=${encodeURI(window.location.href)}`;

    if (!ready) {
      return <div></div>;
    } else {
      const { component, ...rest } = this.props;
      const Component = component as React.ComponentClass;

      return (
        <Route
          {...rest}
          render={(props) => {
            if (authenticated) {
              return <Component {...props} />;
            } else {
              return <Redirect to={redirectUrl} />;
            }
          }}
        />
      );
    }
  }
}
