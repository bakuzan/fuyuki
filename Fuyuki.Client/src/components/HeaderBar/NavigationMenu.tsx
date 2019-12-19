import React from 'react';

import HeaderLink from './HeaderLink';
import { LoginMenu } from '../ApiAuthorisation/LoginMenu';
import authService from '../ApiAuthorisation/AuthoriseService';
import { useAsync } from '../../hooks/useAsync';

function NavigationMenu() {
  const isAuthenticated = useAsync(authService.isAuthenticated, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <React.Fragment>
      <HeaderLink to="/groups" aria-label="Manage subreddit groups">
        Groups
      </HeaderLink>
      <LoginMenu />
    </React.Fragment>
  );
}

export default NavigationMenu;
