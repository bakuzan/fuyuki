import React from 'react';

import Header from 'meiko/Header';
import NavigationMenu from './NavigationMenu';
import HeaderLink from './HeaderLink';

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
            Fuyuki
          </HeaderLink>
        </h1>
      }
      navRight={<NavigationMenu />}
    />
  );
}

export default HeaderBar;
