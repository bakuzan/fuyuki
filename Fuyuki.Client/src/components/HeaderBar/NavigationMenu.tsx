import React from 'react';
import { NavLink } from 'react-router-dom';

function NavigationMenu() {
  return (
    <React.Fragment>
      <NavLink
        className="header__nav-button"
        to="/groups"
        aria-label="Manage subreddit groups"
      >
        <span aria-hidden={true}>Groups</span>
      </NavLink>
    </React.Fragment>
  );
}

export default NavigationMenu;
