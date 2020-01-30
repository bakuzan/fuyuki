import React from 'react';

import Header from 'meiko/Header';
import HeaderLink from './HeaderLink';
import NavigationMenu from './NavigationMenu';

import './HeaderBar.scss';

function HeaderBar() {
  return (
    <Header
      id="fuyuki-header"
      navLeft={
        <h1 className="application-header__title">
          <HeaderLink
            className="application-header__brand"
            to="/"
            aria-label="Home"
          >
            <span aria-hidden={true}>Fuyuki</span>
          </HeaderLink>
        </h1>
      }
      navRight={<NavigationMenu />}
    />
  );
}

export default HeaderBar;
