import classNames from 'classnames';
import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

export interface HeaderLinkProps extends NavLinkProps {}

function HeaderLink({ className, children, ...props }: HeaderLinkProps) {
  return (
    <NavLink
      className={classNames('application-header__nav-link', className)}
      activeClassName="application-header__nav-link--active"
      {...props}
    >
      <span aria-hidden={true}>{children}</span>
    </NavLink>
  );
}

export default HeaderLink;
