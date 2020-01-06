import React from 'react';

import { nano } from 'meiko/styles/nano';

nano.put('.fyk-request-message', {
  fontSize: `1.25rem`,
  margin: `10px 0`
});

function RequestMessage({ text }: { text: string }) {
  return <div className="fyk-request-message">{text}</div>;
}

export default React.memo(RequestMessage);
