import React, { Component, Fragment } from 'react';

import DropdownMenu from 'meiko/DropdownMenu';
import authService from './AuthoriseService';
import { ApplicationPaths } from './ApiAuthorisationConstants';
import { LinkAsButton, NewTabLinkAsButton } from '../Buttons';

import './LoginMenu.scss';

interface LoginMenuProps {}

interface RedditUser {
  name: string;
  inboxCount: number;
  hasMail: boolean;
  hasNewModmail: boolean;
}

interface LoginMenuState {
  isAuthenticated: boolean;
  user: RedditUser | null;
}

interface LogoutPath {
  pathname: string;
  state: { local: boolean };
}

export class LoginMenu extends Component<LoginMenuProps, LoginMenuState> {
  private _subscription: number = 0;
  private _mounted: boolean = true;

  constructor(props: LoginMenuProps) {
    super(props);

    this.state = {
      isAuthenticated: false,
      user: null
    };
  }

  componentDidMount() {
    this._subscription = authService.subscribe(() => this.populateState());
    this.populateState();
  }

  componentWillUnmount() {
    this._mounted = false;
    authService.unsubscribe(this._subscription);
  }

  async populateState() {
    let user = null;
    const isAuthenticated = await authService.isAuthenticated();

    if (isAuthenticated) {
      user = await authService.getUserObject();
    }

    if (this._mounted) {
      this.setState({
        isAuthenticated: !!isAuthenticated,
        user
      });
    }
  }

  render() {
    const { isAuthenticated, user } = this.state;
    let DropdownView: React.FunctionComponent;

    if (!isAuthenticated) {
      const loginPath = `${ApplicationPaths.Login}`;

      DropdownView = () => this.anonymousView(loginPath);
    } else {
      const logoutPath = {
        pathname: `${ApplicationPaths.LogOut}`,
        state: { local: true }
      };

      DropdownView = () => this.authenticatedView(user, logoutPath);
    }

    return (
      <Fragment>
        <div className="account-mail">
          {(user?.hasMail || user?.hasNewModmail) && (
            <div className="account-mail__icon">{user.inboxCount}</div>
          )}
        </div>
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
      </Fragment>
    );
  }

  authenticatedView(user: RedditUser | null, logoutPath: LogoutPath) {
    const clickableAccount = user && user.name;
    const userName = user?.name ?? 'Loading...';

    return (
      <Fragment>
        <div>
          {clickableAccount ? (
            <NewTabLinkAsButton
              className="account-action"
              btnStyle="accent"
              href={`https://www.reddit.com/user/${userName}/`}
            >
              {userName}
            </NewTabLinkAsButton>
          ) : (
            <div className="account-placeholder">{userName}</div>
          )}
        </div>
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

  anonymousView(loginPath: string) {
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
