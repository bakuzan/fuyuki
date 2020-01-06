import React from 'react';

import { nano } from 'meiko/styles/nano';

import FYKLink from 'src/components/FYKLink';

nano.put('.not-found', {
  display: 'flex',
  flexDirection: 'column',
  margin: `25px 0`,
  minHeight: `200px`
});

nano.put('.not-found__content', {
  display: 'flex',
  fontSize: `1.25rem`
});

nano.put('.not-found__text', {
  display: `flex`,
  alignItems: 'center',
  padding: `0 5px`
});
nano.put('.not-found__status', {
  borderRight: `1px solid var(--primary-colour)`,
  fontSize: `1.5rem`,
  padding: `5px`
});

nano.put('.not-found__action', {
  margin: `10px 0`
});

function NotFoundPage() {
  return (
    <div className="page">
      <div className="not-found">
        <div className="not-found__content">
          <div className="not-found__text not-found__status">404</div>
          <div className="not-found__text">
            The page you are looking for could not be found
          </div>
        </div>
        <div className="not-found__action">
          <FYKLink to="/">Return to home</FYKLink>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
