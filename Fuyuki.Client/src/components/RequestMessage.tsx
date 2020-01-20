import React from 'react';

import { nano } from 'meiko/styles/nano';

nano.put('.fyk-request-message', {
  fontSize: `1.25rem`,
  margin: `10px 0`
});

nano.put('.fyk-request-message__text', {
  margin: `10px 0`
});

interface RequestMessageProps {
  text: string;
  children?: React.ReactNode;
}

function RequestMessage({ text, children }: RequestMessageProps) {
  return (
    <div className="fyk-request-message">
      <div className="fyk-request-message__text">{text}</div>
      {children}
    </div>
  );
}

export default React.memo(RequestMessage);
