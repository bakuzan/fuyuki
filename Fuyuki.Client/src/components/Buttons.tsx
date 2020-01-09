import React from 'react';
import classNames from 'classnames';

import { Button, withButtonisation, ButtonProps } from 'meiko/Button';
import FYKLink, { FYKLinkProps } from './FYKLink';
import NewTabLink from 'meiko/NewTabLink';

export const LinkAsButton = withButtonisation<FYKLinkProps>(FYKLink);

export const NewTabLinkAsButton = withButtonisation<
  React.HTMLProps<HTMLAnchorElement>
>(NewTabLink);

interface SeeMoreButtonProps extends ButtonProps {}

export function SeeMoreButton({ className, ...props }: SeeMoreButtonProps) {
  return (
    <Button
      className={classNames('see-more-button', className)}
      btnStyle="accent"
      {...props}
    >
      <span aria-hidden={true}>See more...</span>
    </Button>
  );
}
