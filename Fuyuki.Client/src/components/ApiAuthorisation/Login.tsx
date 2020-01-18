import LoadingBouncer from 'meiko/LoadingBouncer';
import React from 'react';
import { Component } from 'react';
import RequestMessage from '../RequestMessage';
import {
  ApplicationPaths,
  LoginActions,
  QueryParameterNames
} from './ApiAuthorisationConstants';
import authService, { AuthState } from './AuthoriseService';
import { AuthenticationResultStatus } from './AuthoriseService';

interface LoginProps {
  action: string;
}

interface LoginState {
  error: undefined | null | string;
  message: undefined | null | string | Error;
}

// The main responsibility of this component is to handle the user's login process.
// This is the starting point for the login process. Any component that needs to authenticate
// a user can simply perform a redirect to this component with a returnUrl query parameter and
// let the component perform the login and return back to the return url.
export class Login extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);

    this.state = {
      error: undefined,
      message: undefined
    };
  }

  public componentDidMount() {
    const action = this.props.action;
    switch (action) {
      case LoginActions.Login:
        this.login(this.getReturnUrl());
        break;
      case LoginActions.LoginCallback:
        this.processLoginCallback();
        break;
      case LoginActions.LoginFailed:
        const params = new URLSearchParams(window.location.search);
        const error = params.get(QueryParameterNames.Message);
        this.setState({ message: error });
        break;
      case LoginActions.Profile:
        this.redirectToProfile();
        break;
      case LoginActions.Register:
        this.redirectToRegister();
        break;
      default:
        throw new Error(`Invalid action '${action}'`);
    }
  }

  public render() {
    const action = this.props.action;
    const { message } = this.state;

    const errorMessage = message
      ? typeof message === 'string'
        ? message
        : message?.message ?? 'Login error.'
      : '';

    switch (action) {
      case LoginActions.Login:
      case LoginActions.LoginCallback:
        return (
          <RequestMessage text={errorMessage}>
            <LoadingBouncer />
          </RequestMessage>
        );
      default:
        throw new Error(`Invalid action '${action}'`);
    }
  }

  public async login(returnUrl: string) {
    const state = { returnUrl };
    const result = await authService.signIn(state);

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
        throw new Error(`Invalid status result ${result.status}.`);
    }
  }

  public async processLoginCallback() {
    const url = window.location.href;
    const result = await authService.completeSignIn(url);

    switch (result.status) {
      case AuthenticationResultStatus.Redirect:
        // There should not be any redirects as the only time completeSignIn finishes
        // is when we are doing a redirect sign in flow.
        throw new Error('Should not redirect.');
      case AuthenticationResultStatus.Success:
        await this.navigateToReturnUrl(this.getReturnUrl(result.state));
        break;
      case AuthenticationResultStatus.Fail:
        this.setState({ message: result.message });
        break;
      default:
        throw new Error(
          `Invalid authentication result status '${result.status}'.`
        );
    }
  }

  public getReturnUrl(state?: AuthState) {
    const params = new URLSearchParams(window.location.search);
    let fromQuery = params.get(QueryParameterNames.ReturnUrl);

    if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
      // This is an extra check to prevent open redirects.
      throw new Error(
        'Invalid return url. The return url needs to have the same origin as the current page.'
      );
    } else if (fromQuery === ApplicationPaths.LoggedOut) {
      fromQuery = '';
    }

    return (
      (state && state.returnUrl) || fromQuery || `${window.location.origin}/`
    );
  }

  public redirectToRegister() {
    this.redirectToApiAuthorizationPath(
      `${ApplicationPaths.IdentityRegisterPath}?${
        QueryParameterNames.ReturnUrl
      }=${encodeURI(ApplicationPaths.Login)}`
    );
  }

  public redirectToProfile() {
    this.redirectToApiAuthorizationPath(ApplicationPaths.IdentityManagePath);
  }

  public redirectToApiAuthorizationPath(apiAuthorizationPath: string) {
    const redirectUrl = `${window.location.origin}${apiAuthorizationPath}`;
    // It's important that we do a replace here so that when the user hits the back arrow on the
    // browser he gets sent back to where it was on the app instead of to an endpoint on this
    // component.
    window.location.replace(redirectUrl);
  }

  public navigateToReturnUrl(returnUrl: string) {
    // It's important that we do a replace here so that we remove the callback uri with the
    // fragment containing the tokens from the browser history.
    window.location.replace(returnUrl);
  }
}
