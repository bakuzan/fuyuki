import classNames from 'classnames';
import React, { useCallback, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router';

import generateUniqueId from 'ayaka/generateUniqueId';
import { useGlobalStyles } from 'meiko/hooks/useGlobalStyles';
import ScrollTopButton from 'meiko/ScrollTopButton';
import Alert from './components/Alert';
import HeaderBar from './components/HeaderBar';

import { ApplicationPaths } from './components/ApiAuthorisation/ApiAuthorisationConstants';
import ApiAuthorisationRoutes from './components/ApiAuthorisation/ApiAuthorisationRoutes';
import AuthoriseRoute from './components/ApiAuthorisation/AuthoriseRoute';

import CommentsPage from './pages/Comments';
import GroupManagement from './pages/GroupManagement';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import GroupPosts from './pages/Posts/GroupPosts';
import SubPosts from './pages/Posts/SubPosts';
import UserMessages from './pages/UserMessages';

import { useStorage } from 'src/hooks/useStorage';
import { HeaderContext, MainContext } from './context';

import './styles/index.scss';
import './styles/themes.scss';

const ONE_SECOND = 1000;

function App() {
  const timer = useRef(0);
  const [messageKey, setMessageKey] = useState('');
  const [withSearch, setWithSearch] = useState(false);
  const [isDarkTheme, setTheme] = useStorage('isDarkTheme');
  useGlobalStyles();

  const showAltTheme = isDarkTheme === true;
  const onMessageRefresh = useCallback(
    (secondsDelay = 0) => {
      clearTimeout(timer.current);

      timer.current = window.setTimeout(
        () => setMessageKey(generateUniqueId()),
        ONE_SECOND * secondsDelay
      );
    },
    [timer.current]
  );

  return (
    <div
      className={classNames('theme', {
        'theme--alt': showAltTheme,
        'theme--default': !showAltTheme
      })}
    >
      <Helmet defaultTitle="Fuyuki" titleTemplate="%s | Fuyuki" />
      <HeaderContext.Provider
        value={{
          isDarkTheme: isDarkTheme as boolean,
          messageKey,
          onMessageRefresh,
          onThemeToggle: setTheme as (newValue: boolean) => void
        }}
      >
        <HeaderBar fullShadow={!withSearch} />
      </HeaderContext.Provider>
      <Alert />
      <MainContext.Provider
        value={{
          onMessageRefresh,
          onSetSearch: setWithSearch
        }}
      >
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
              component={GroupManagement}
            />

            <AuthoriseRoute
              path="/messages/:mailbox"
              component={UserMessages}
            />

            <Route
              path={ApplicationPaths.ApiAuthorisationPrefix}
              component={ApiAuthorisationRoutes}
            />

            <Route path="*" component={NotFound} />
          </Switch>
        </main>
      </MainContext.Provider>
      <ScrollTopButton />
    </div>
  );
}

export default App;
