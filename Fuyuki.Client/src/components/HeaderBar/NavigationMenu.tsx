import React, { useEffect } from 'react';

import HeaderLink from './HeaderLink';
import { LoginMenu } from '../ApiAuthorisation/LoginMenu';
import authService from '../ApiAuthorisation/AuthoriseService';
import { useAsyncFn } from 'src/hooks/useAsyncFn';

function NavigationMenu() {
  const [state, refreshAuthState] = useAsyncFn(
    () => authService.isAuthenticated(),
    []
  );

  useEffect(() => {
    authService.subscribe(() => refreshAuthState());
    refreshAuthState();
  }, [refreshAuthState]);

  if (!state.value) {
    return <LoginMenu />;
  }

  return (
    <React.Fragment>
      <HeaderLink to="/posts/rall" aria-label="View posts on r/all">
        r/all
      </HeaderLink>
      <HeaderLink to="/groups" aria-label="Manage subreddit groups">
        Groups
      </HeaderLink>
      <LoginMenu />
    </React.Fragment>
  );
}

export default NavigationMenu;
