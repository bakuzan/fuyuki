import classNames from 'classnames';
import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

interface FYKLinkProps extends NavLinkProps {}

function FYKLink({ className, ...props }: FYKLinkProps) {
  return <NavLink className={classNames('fyk-link', className)} {...props} />;
}

export default FYKLink;
