import React from 'react';
import { Route } from 'react-router';
import { Helmet } from 'react-helmet';

import { useGlobalStyles } from 'meiko/hooks/useGlobalStyles';
import HeaderBar from './components/HeaderBar';

import ApiAuthorisationRoutes from './components/ApiAuthorisation/ApiAuthorisationRoutes';
import AuthoriseRoute from './components/ApiAuthorisation/AuthoriseRoute';
import { ApplicationPaths } from './components/ApiAuthorisation/ApiAuthorisationConstants';

import Home from './pages/Home';
import Posts from './pages/Posts';
import GroupManagement from './pages/GroupManagement';
import GroupManagementCreateUpdate from './pages/GroupManagement/CreateUpdate';

import './styles/index.scss';
import './styles/themes.scss';

function App() {
  useGlobalStyles();

  return (
    <div className="theme theme--default">
      <Helmet defaultTitle="Fuyuki" titleTemplate="%s | Fuyuki" />
      <HeaderBar />
      <main>
        <AuthoriseRoute exact path="/" component={Home} />
        <AuthoriseRoute path="/posts/rall" component={Posts} />
        <AuthoriseRoute path="/posts/:groupId(\d*)" component={Posts} />
        <AuthoriseRoute path="/groups" component={GroupManagement} />
        <AuthoriseRoute
          path="/group/:id(\d*)?"
          component={GroupManagementCreateUpdate}
        />

        <Route
          path={ApplicationPaths.ApiAuthorisationPrefix}
          component={ApiAuthorisationRoutes}
        />
      </main>
    </div>
  );
}

export default App;
