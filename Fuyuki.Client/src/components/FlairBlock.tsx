import classNames from 'classnames';
import React from 'react';

import { nano } from 'meiko/styles/nano';

interface FlairProps extends React.HTMLProps<HTMLDivElement> {
  text?: string;
}

nano.put('.flair', {
  backgroundColor: `#ddd`,
  padding: `1px 3px`,
  margin: `0 5px`,
  fontSize: `0.8rem`,
  fontWeight: 'normal'
});

function Flair({ className, text, ...props }: FlairProps) {
  if (!text) {
    return null;
  }

  return (
    <span className={classNames('flair', className)} {...props}>
      {text}
    </span>
  );
}

export default Flair;
