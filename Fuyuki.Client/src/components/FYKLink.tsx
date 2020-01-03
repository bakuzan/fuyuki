import classNames from 'classnames';
import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

export interface FYKLinkProps extends NavLinkProps {
  noShadow?: boolean;
}

function FYKLink({ className, noShadow = false, ...props }: FYKLinkProps) {
  return (
    <NavLink
      className={classNames(
        'fyk-link',
        { 'fyk-link--shadowless': noShadow },
        className
      )}
      {...props}
    />
  );
}

export default FYKLink;
