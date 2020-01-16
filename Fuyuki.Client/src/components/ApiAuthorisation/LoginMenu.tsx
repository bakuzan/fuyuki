import React, { Component, Fragment } from 'react';

import DropdownMenu from 'meiko/DropdownMenu';
import ThemeToggler from '../ThemeToggler';
import authService from './AuthoriseService';
import { ApplicationPaths } from './ApiAuthorisationConstants';
import { LinkAsButton, NewTabLinkAsButton } from '../Buttons';

import './LoginMenu.scss';
import NewTabLink from 'meiko/NewTabLink';

const TEN_MINUTES = 1000 * 60 * 10;

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
  private _interval: number = 0;

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
    this.pollingUserState(true);
  }

  componentWillUnmount() {
    this._mounted = false;
    authService.unsubscribe(this._subscription);
    this.pollingUserState(false);
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

  pollingUserState(init: boolean) {
    clearInterval(this._interval);

    if (init) {
      this._interval = window.setInterval(
        () => this.populateState(),
        TEN_MINUTES
      );
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
            <div className="account-mail__icon">
              <NewTabLink
                href={
                  user.hasMail
                    ? 'https://www.reddit.com/message/unread/'
                    : user.hasNewModmail
                    ? 'https://mod.reddit.com/mail/all'
                    : '#'
                }
              >
                {user.inboxCount || '!'}
              </NewTabLink>
            </div>
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
          <ThemeToggler />
        </div>
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
          <ThemeToggler />
        </div>
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
