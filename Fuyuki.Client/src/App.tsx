import React from 'react';
import { Route } from 'react-router';

import { useGlobalStyles } from 'meiko/hooks/useGlobalStyles';
import HeaderBar from './components/HeaderBar';

import ApiAuthorisationRoutes from './components/ApiAuthorisation/ApiAuthorisationRoutes';
import AuthoriseRoute from './components/ApiAuthorisation/AuthoriseRoute';
import { ApplicationPaths } from './components/ApiAuthorisation/ApiAuthorisationConstants';

import Home from './pages/Home';
import GroupList from './pages/GroupManagement';

import './styles/index.scss';
import './styles/themes.scss';

function App() {
  useGlobalStyles();

  return (
    <div className="theme theme--default">
      <HeaderBar />
      <main>
        <AuthoriseRoute exact path="/" component={Home} />
        <AuthoriseRoute path="/groups" component={GroupList} />
        <Route
          path={ApplicationPaths.ApiAuthorisationPrefix}
          component={ApiAuthorisationRoutes}
        />
      </main>
    </div>
  );
}

export default App;
