import React from 'react';
import { NavLink } from 'react-router-dom';

import Header from 'meiko/Header';
import NavigationMenu from './NavigationMenu';

import './HeaderBar.scss';

function HeaderBar() {
  return (
    <Header
      id="fuyuki-header"
      navLeft={
        <NavLink className="header__nav-button" to="/" aria-label="Home">
          <span aria-hidden={true}>Fuyuki</span>
        </NavLink>
      }
      navRight={<NavigationMenu />}
    />
  );
}

export default HeaderBar;
