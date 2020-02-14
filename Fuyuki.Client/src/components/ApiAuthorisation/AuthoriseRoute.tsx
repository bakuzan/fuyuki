import React from 'react';
import { Component } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
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
  private subscription: number = 0;

  constructor(props: AuthoriseRouteProps) {
    super(props);

    this.state = {
      authenticated: false,
      ready: false
    };
  }

  public componentDidMount() {
    this.subscription = authService.subscribe(() =>
      this.authenticationChanged()
    );

    this.populateAuthenticationState();
  }

  public componentWillUnmount() {
    authService.unsubscribe(this.subscription);
  }

  public async populateAuthenticationState() {
    const authenticated = await authService.isAuthenticated();
    this.setState({ ready: true, authenticated });
  }

  public async authenticationChanged() {
    this.setState({ ready: false, authenticated: false });
    await this.populateAuthenticationState();
  }

  public render() {
    const { ready, authenticated } = this.state;
    const redirectUrl = `${ApplicationPaths.Login}?${
      QueryParameterNames.ReturnUrl
    }=${encodeURI(window.location.href)}`;

    if (!ready) {
      return <div></div>;
    } else {
      const { component, ...rest } = this.props;
      const PageComponent = component as React.ComponentClass;
      const routeKey = rest.location?.key;

      return (
        <Route
          {...rest}
          render={(props) => {
            if (authenticated) {
              return <PageComponent key={routeKey} {...props} />;
            } else {
              return <Redirect to={redirectUrl} />;
            }
          }}
        />
      );
    }
  }
}
