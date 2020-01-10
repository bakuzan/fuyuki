import classNames from 'classnames';
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
import PostsPage from './pages/Posts';
import CommentsPage from './pages/Comments';
import GroupManagement from './pages/GroupManagement';
import GroupManagementCreateUpdate from './pages/GroupManagement/CreateUpdate';

import { ThemeContext } from './context';
import { useStorage } from 'src/hooks/useStorage';

import './styles/index.scss';
import './styles/themes.scss';

function App() {
  const [isDarkTheme, setTheme] = useStorage('isDarkTheme');
  useGlobalStyles();

  const themeState: [boolean, (newValue: boolean) => void] = [
    isDarkTheme as boolean,
    setTheme as (newValue: boolean) => void
  ];
  const showAltTheme = themeState[0];

  return (
    <div
      className={classNames('theme', {
        'theme--default': !showAltTheme,
        'theme--alt': showAltTheme
      })}
    >
      <Helmet defaultTitle="Fuyuki" titleTemplate="%s | Fuyuki" />
      <ThemeContext.Provider value={themeState}>
        <HeaderBar />
      </ThemeContext.Provider>
      <main>
        <Switch>
          <AuthoriseRoute exact path="/" component={Home} />
          <AuthoriseRoute
            key="sub"
            path="/r/posts/:subName(.*)"
            component={PostsPage}
          />
          <AuthoriseRoute
            key="sublink"
            path="/r/:subName(.*)"
            component={PostsPage}
          />
          <AuthoriseRoute
            key="group"
            path="/fyk/posts/:groupId(\d*)"
            component={PostsPage}
          />
          <AuthoriseRoute
            path="/post/:postId/comments"
            component={CommentsPage}
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
