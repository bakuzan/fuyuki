import classNames from 'classnames';
import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

export interface HeaderLinkProps extends NavLinkProps {}

function HeaderLink({ className, children, ...props }: HeaderLinkProps) {
  return (
    <NavLink
      className={classNames('application-header__nav-link', className)}
      {...props}
    >
      <span aria-hidden={true}>{children}</span>
    </NavLink>
  );
}

export default HeaderLink;
