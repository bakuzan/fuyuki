import classNames from 'classnames';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router';

import { useGlobalStyles } from 'meiko/hooks/useGlobalStyles';
import ScrollTopButton from 'meiko/ScrollTopButton';
import Alert from './components/Alert';
import HeaderBar from './components/HeaderBar';

import { ApplicationPaths } from './components/ApiAuthorisation/ApiAuthorisationConstants';
import ApiAuthorisationRoutes from './components/ApiAuthorisation/ApiAuthorisationRoutes';
import AuthoriseRoute from './components/ApiAuthorisation/AuthoriseRoute';

import CommentsPage from './pages/Comments';
import GroupManagementCreateUpdate from './pages/GroupManagement/CreateUpdate';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import GroupPosts from './pages/Posts/GroupPosts';
import SubPosts from './pages/Posts/SubPosts';

import { useStorage } from 'src/hooks/useStorage';
import { ThemeContext, WidgetContext } from './context';

import './styles/index.scss';
import './styles/themes.scss';

function App() {
  const [withSearch, setWithSearch] = useState(false);
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
        'theme--alt': showAltTheme,
        'theme--default': !showAltTheme
      })}
    >
      <Helmet defaultTitle="Fuyuki" titleTemplate="%s | Fuyuki" />
      <ThemeContext.Provider value={themeState}>
        <HeaderBar fullShadow={!withSearch} />
      </ThemeContext.Provider>
      <Alert />
      <WidgetContext.Provider value={setWithSearch}>
        <main>
          <Switch>
            <AuthoriseRoute exact path="/" component={Home} />
            <AuthoriseRoute
              key="sub"
              path="/r/posts/:subName(.*)"
              component={SubPosts}
            />
            <AuthoriseRoute
              key="sublink"
              path="/r/:subName(.*)"
              component={SubPosts}
            />
            <AuthoriseRoute
              key="group"
              path="/fyk/posts/:groupId(\d*)"
              component={GroupPosts}
            />
            <AuthoriseRoute
              path="/post/:postId/comments"
              component={CommentsPage}
            />

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
      </WidgetContext.Provider>
      <ScrollTopButton />
    </div>
  );
}

export default App;
