import React, { Component, Fragment } from 'react';

import DropdownMenu from 'meiko/DropdownMenu';
import NewTabLink from 'meiko/NewTabLink';
import { LinkAsButton, NewTabLinkAsButton } from '../Buttons';
import FYKLink from '../FYKLink';
import ThemeToggler from '../ThemeToggler';
import { ApplicationPaths } from './ApiAuthorisationConstants';
import authService from './AuthoriseService';

import './LoginMenu.scss';

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
  private subscription: number = 0;
  private mounted: boolean = true;
  private interval: number = 0;

  constructor(props: LoginMenuProps) {
    super(props);

    this.state = {
      isAuthenticated: false,
      user: null
    };
  }

  public componentDidMount() {
    this.subscription = authService.subscribe(() => this.populateState());
    this.populateState();
    this.pollingUserState(true);
  }

  public componentWillUnmount() {
    this.mounted = false;
    authService.unsubscribe(this.subscription);
    this.pollingUserState(false);
  }

  public async populateState() {
    let user = null;
    const isAuthenticated = await authService.isAuthenticated();

    if (isAuthenticated) {
      user = await authService.getUserObject();
    }

    if (this.mounted) {
      this.setState({
        isAuthenticated: !!isAuthenticated,
        user
      });
    }
  }

  public pollingUserState(init: boolean) {
    clearInterval(this.interval);

    if (init) {
      this.interval = window.setInterval(
        () => this.populateState(),
        TEN_MINUTES
      );
    }
  }

  public render() {
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
              {user.hasMail && (
                <FYKLink to={'/messages/unread'}>{user.inboxCount}</FYKLink>
              )}
              {!user.hasMail && user.hasNewModmail && (
                <NewTabLink href={'https://mod.reddit.com/mail/all'}>
                  !
                </NewTabLink>
              )}
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

  public authenticatedView(user: RedditUser | null, logoutPath: LogoutPath) {
    const clickableAccount = user && user.name;
    const userName = user?.name ?? 'Loading...';

    return (
      <Fragment>
        <div>
          <ThemeToggler />
        </div>
        <div>
          {clickableAccount ? (
            <React.Fragment>
              <LinkAsButton
                className="account-action"
                btnStyle="accent"
                to="/messages/inbox"
              >
                Messages
              </LinkAsButton>
              <NewTabLinkAsButton
                className="account-action"
                btnStyle="accent"
                href={`https://www.reddit.com/user/${userName}/`}
              >
                {userName}
              </NewTabLinkAsButton>
            </React.Fragment>
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

  public anonymousView(loginPath: string) {
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
