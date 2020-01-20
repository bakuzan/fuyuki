import React from 'react';
import { Component } from 'react';

import Image from 'meiko/Image';
import LoadingBouncer from 'meiko/LoadingBouncer';

import RequestMessage from '../RequestMessage';
import {
  ApplicationPaths,
  LogoutActions,
  QueryParameterNames
} from './ApiAuthorisationConstants';
import authService, { AuthState } from './AuthoriseService';
import { AuthenticationResultStatus } from './AuthoriseService';

import logoutImage from 'src/assets/logout-page-image.jpg';
import './Logout.scss';

interface LogoutProps {
  action: string;
}

interface LogoutState {
  authenticated: boolean;
  isReady: boolean;
  message: undefined | null | string | Error;
}

// The main responsibility of this component is to handle the user's logout process.
// This is the starting point for the logout process, which is usually initiated when a
// user clicks on the logout button on the LoginMenu component.
export class Logout extends Component<LogoutProps, LogoutState> {
  private unsubAuthService = 0;

  constructor(props: LogoutProps) {
    super(props);

    this.state = {
      authenticated: false,
      isReady: false,
      message: undefined
    };
  }

  public componentDidMount() {
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

  public componentWillUnmount() {
    authService.unsubscribe(this.unsubAuthService);
  }

  public render() {
    const { isReady, message } = this.state;

    if (!isReady) {
      return <div></div>;
    }

    const errorMessage =
      typeof message === 'string'
        ? message
        : message?.message ?? 'Logout error.';

    const action = this.props.action;
    switch (action) {
      case LogoutActions.Logout:
      case LogoutActions.LogoutCallback:
        return <LoadingBouncer />;
      case LogoutActions.LoggedOut:
        return (
          <RequestMessage text={errorMessage}>
            <div className="logout-image">
              <Image
                id="fuyuki-logout-image"
                className="logout-image__image"
                src={logoutImage}
                alt={`Minami Fuyuki lying in the snow`}
              />
            </div>
          </RequestMessage>
        );
      default:
        throw new Error(`Invalid action '${action}'`);
    }
  }

  public async logout(returnUrl: string) {
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

  public async processLogoutCallback() {
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

  public async populateAuthenticationState() {
    const authenticated = await authService.isAuthenticated();

    this.setState({ isReady: true, authenticated }, () => {
      const isLoggedOutPage = this.props.action === LogoutActions.LoggedOut;
      if (isLoggedOutPage && this.state.authenticated) {
        this.navigateToReturnUrl(`${window.location.origin}/`);
      } else if (isLoggedOutPage) {
        authService.clearStaleState();
      }
    });
  }

  public getReturnUrl(state?: AuthState) {
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

  public navigateToReturnUrl(returnUrl: string) {
    return window.location.replace(returnUrl);
  }
}
