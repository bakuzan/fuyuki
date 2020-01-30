import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Button } from 'meiko/Button';
import Icons from 'meiko/constants/icons';
import HeaderLink from './HeaderLink';

import { useAsyncFn } from 'src/hooks/useAsyncFn';
import authService from '../ApiAuthorisation/AuthoriseService';
import { LoginMenu } from '../ApiAuthorisation/LoginMenu';

function NavigationMenu() {
  const history = useHistory();
  const [state, refreshAuthState] = useAsyncFn(
    () => authService.isAuthenticated(),
    []
  );

  useEffect(() => {
    const unsubId = authService.subscribe(() => refreshAuthState());
    refreshAuthState();

    return () => authService.unsubscribe(unsubId);
  }, [refreshAuthState]);

  if (!state.value) {
    return <LoginMenu />;
  }

  return (
    <React.Fragment>
      <div className="navigation-button-group">
        <Button
          className="navigation-button"
          btnStyle="accent"
          icon={Icons.left}
          title="Go to previous page"
          aria-label="Go to previous page"
          onClick={history.goBack}
        />
        <Button
          className="navigation-button"
          btnStyle="accent"
          icon={Icons.right}
          title="Go to next page"
          aria-label="Go to next page"
          onClick={history.goForward}
        />
      </div>

      <HeaderLink to="/r/all" aria-label="View posts on r/all">
        r/all
      </HeaderLink>

      <LoginMenu />
    </React.Fragment>
  );
}

export default NavigationMenu;
