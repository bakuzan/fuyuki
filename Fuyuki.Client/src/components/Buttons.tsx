import { withButtonisation, ButtonProps } from 'meiko/Button';
import FYKLink, { FYKLinkProps } from './FYKLink';

type LinkAsButtonProps = ButtonProps & FYKLinkProps;

export const LinkAsButton: React.FC<LinkAsButtonProps> = withButtonisation(
  FYKLink
);
