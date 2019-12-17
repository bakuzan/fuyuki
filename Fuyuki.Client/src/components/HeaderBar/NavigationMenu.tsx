import React from 'react';

import HeaderLink from './HeaderLink';

function NavigationMenu() {
  return (
    <React.Fragment>
      <HeaderLink to="/groups" aria-label="Manage subreddit groups">
        Groups
      </HeaderLink>
    </React.Fragment>
  );
}

export default NavigationMenu;
