import React from 'react';
import { Route, Switch } from 'react-router';
import { Helmet } from 'react-helmet';

import { useGlobalStyles } from 'meiko/hooks/useGlobalStyles';
import HeaderBar from './components/HeaderBar';

import ApiAuthorisationRoutes from './components/ApiAuthorisation/ApiAuthorisationRoutes';
import AuthoriseRoute from './components/ApiAuthorisation/AuthoriseRoute';
import { ApplicationPaths } from './components/ApiAuthorisation/ApiAuthorisationConstants';

import NotFound from './pages/NotFound';
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
        <Switch>
          <AuthoriseRoute exact path="/" component={Home} />
          <AuthoriseRoute key="all" exact path="/rall" component={Posts} />
          <AuthoriseRoute
            key="sub"
            path="/r/posts/:subName(.*)"
            component={Posts}
          />
          <AuthoriseRoute
            key="group"
            path="/fyk/posts/:groupId(\d*)"
            component={Posts}
          />
          <AuthoriseRoute path="/groups" component={GroupManagement} />
          <AuthoriseRoute
            path="/group/:id(\d*)?"
            component={GroupManagementCreateUpdate}
          />

          <Route
            path={ApplicationPaths.ApiAuthorisationPrefix}
            component={ApiAuthorisationRoutes}
          />

          <Route path="*" component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

export default App;
