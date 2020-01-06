import React from 'react';
import { Component } from 'react';
import authService, { AuthState } from './AuthoriseService';
import { AuthenticationResultStatus } from './AuthoriseService';
import {
  QueryParameterNames,
  LogoutActions,
  ApplicationPaths
} from './ApiAuthorisationConstants';
import RequestMessage from '../RequestMessage';

interface LogoutProps {
  action: string;
}

interface LogoutState {
  message: undefined | null | string | Error;
  isReady: boolean;
  authenticated: boolean;
}

// The main responsibility of this component is to handle the user's logout process.
// This is the starting point for the logout process, which is usually initiated when a
// user clicks on the logout button on the LoginMenu component.
export class Logout extends Component<LogoutProps, LogoutState> {
  private unsubAuthService = 0;

  constructor(props: LogoutProps) {
    super(props);

    this.state = {
      message: undefined,
      isReady: false,
      authenticated: false
    };
  }

  componentDidMount() {
    const action = this.props.action;
    switch (action) {
      case LogoutActions.Logout:
        if (!!window.history.state.state.local) {
          this.logout(this.getReturnUrl());
        } else {
          // This prevents regular links to <app>/authentication/logout from triggering a logout
          this.setState({
            isReady: true,
            message: 'The logout was not initiated from within the page.'
          });
        }
        break;
      case LogoutActions.LogoutCallback:
        this.processLogoutCallback();
        break;
      case LogoutActions.LoggedOut:
        this.setState({
          isReady: true,
          message: 'You successfully logged out!'
        });
        break;
      default:
        throw new Error(`Invalid action '${action}'`);
    }

    this.populateAuthenticationState();
    this.unsubAuthService = authService.subscribe(() =>
      this.populateAuthenticationState()
    );
  }

  componentWillUnmount() {
    authService.unsubscribe(this.unsubAuthService);
  }

  render() {
    const { isReady, message } = this.state;
    console.log('logout page...', this.state, this.props);
    if (!isReady) {
      return <div></div>;
    }

    const errorMessage =
      typeof message === 'string'
        ? message
        : message?.message ?? 'Logout error.';

    if (!!message) {
      return <RequestMessage text={errorMessage} />;
    } else {
      const action = this.props.action;
      switch (action) {
        case LogoutActions.Logout:
          return <RequestMessage text="Processing logout" />;
        case LogoutActions.LogoutCallback:
          return <RequestMessage text="Processing logout callback" />;
        case LogoutActions.LoggedOut:
          return <RequestMessage text={errorMessage} />;
        default:
          throw new Error(`Invalid action '${action}'`);
      }
    }
  }

  async logout(returnUrl: string) {
    const state = { returnUrl };
    const isauthenticated = await authService.isAuthenticated();

    if (isauthenticated) {
      const result = await authService.signOut(state);

      switch (result.status) {
        case AuthenticationResultStatus.Redirect:
          break;
        case AuthenticationResultStatus.Success:
          await this.navigateToReturnUrl(returnUrl);
          break;
        case AuthenticationResultStatus.Fail:
          this.setState({ message: result.message });
          break;
        default:
          throw new Error('Invalid authentication result status.');
      }
    } else {
      this.setState({ message: 'You successfully logged out!' });
    }
  }

  async processLogoutCallback() {
    const url = window.location.href;
    const result = await authService.completeSignOut(url);
    switch (result.status) {
      case AuthenticationResultStatus.Redirect:
        // There should not be any redirects as the only time completeAuthentication finishes
        // is when we are doing a redirect sign in flow.
        throw new Error('Should not redirect.');
      case AuthenticationResultStatus.Success:
        await this.navigateToReturnUrl(this.getReturnUrl(result.state));
        break;
      case AuthenticationResultStatus.Fail:
        this.setState({ message: result.message });
        break;
      default:
        throw new Error('Invalid authentication result status.');
    }
  }

  async populateAuthenticationState() {
    console.log('Pop');
    const authenticated = await authService.isAuthenticated();
    this.setState({ isReady: true, authenticated }, () => {
      const isLoggedOutPage = this.props.action === LogoutActions.LoggedOut;
      if (isLoggedOutPage && this.state.authenticated) {
        this.navigateToReturnUrl(`${window.location.origin}/`);
      }
    });
  }

  getReturnUrl(state?: AuthState) {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get(QueryParameterNames.ReturnUrl);
    if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
      // This is an extra check to prevent open redirects.
      throw new Error(
        'Invalid return url. The return url needs to have the same origin as the current page.'
      );
    }
    return (
      (state && state.returnUrl) ||
      fromQuery ||
      `${window.location.origin}${ApplicationPaths.LoggedOut}`
    );
  }

  navigateToReturnUrl(returnUrl: string) {
    return window.location.replace(returnUrl);
  }
}
