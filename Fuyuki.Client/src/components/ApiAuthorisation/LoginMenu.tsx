import React, { Component, Fragment } from 'react';

import DropdownMenu from 'meiko/DropdownMenu';
import authService from './AuthoriseService';
import { ApplicationPaths } from './ApiAuthorisationConstants';
import { LinkAsButton } from '../Buttons';

import './LoginMenu.scss';

interface LoginMenuProps {}

interface LoginMenuState {
  isAuthenticated: boolean;
  userName: string | null;
}

interface LogoutPath {
  pathname: string;
  state: { local: boolean };
}

export class LoginMenu extends Component<LoginMenuProps, LoginMenuState> {
  private _subscription: number = 0;

  constructor(props: LoginMenuProps) {
    super(props);

    this.state = {
      isAuthenticated: false,
      userName: null
    };
  }

  componentDidMount() {
    this._subscription = authService.subscribe(() => this.populateState());
    this.populateState();
  }

  componentWillUnmount() {
    authService.unsubscribe(this._subscription);
  }

  async populateState() {
    const [isAuthenticated, user] = await Promise.all([
      authService.isAuthenticated(),
      authService.getUser()
    ]);

    this.setState({
      isAuthenticated: !!isAuthenticated,
      userName: (user && user.name) ?? null
    });
  }

  render() {
    const { isAuthenticated, userName } = this.state;
    let DropdownView: React.FunctionComponent;

    if (!isAuthenticated) {
      const registerPath = `${ApplicationPaths.Register}`;
      const loginPath = `${ApplicationPaths.Login}`;

      DropdownView = () => this.anonymousView(registerPath, loginPath);
    } else {
      const profilePath = `${ApplicationPaths.Profile}`;
      const logoutPath = {
        pathname: `${ApplicationPaths.LogOut}`,
        state: { local: true }
      };

      DropdownView = () =>
        this.authenticatedView(userName, profilePath, logoutPath);
    }

    return (
      <DropdownMenu
        className="account-menu"
        btnStyle="primary"
        align="right"
        icon={'\uD83D\uDC64\uFE0E'}
        aria-label={'Account action menu'}
        title={'Account action menu'}
      >
        {DropdownView}
      </DropdownMenu>
    );
  }

  authenticatedView(
    userName: string | null,
    profilePath: string,
    logoutPath: LogoutPath
  ) {
    return (
      <Fragment>
        <div>
          <LinkAsButton
            className="account-action"
            btnStyle="accent"
            to={logoutPath}
          >
            Logout
          </LinkAsButton>
        </div>
      </Fragment>
    );
  }

  anonymousView(registerPath: string, loginPath: string) {
    return (
      <Fragment>
        <div>
          <LinkAsButton
            className="account-action"
            btnStyle="accent"
            to={loginPath}
          >
            Login
          </LinkAsButton>
        </div>
      </Fragment>
    );
  }
}
