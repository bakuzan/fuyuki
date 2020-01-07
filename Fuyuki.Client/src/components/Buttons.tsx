import { withButtonisation } from 'meiko/Button';
import FYKLink, { FYKLinkProps } from './FYKLink';
import NewTabLink from 'meiko/NewTabLink';

export const LinkAsButton = withButtonisation<FYKLinkProps>(FYKLink);

export const NewTabLinkAsButton = withButtonisation<
  React.HTMLProps<HTMLAnchorElement>
>(NewTabLink);
