import React from 'react';
import { Route } from 'react-router';

import { useGlobalStyles } from 'meiko/hooks/useGlobalStyles';
import HeaderBar from './components/HeaderBar';

import Home from './pages/Home';
import GroupList from './pages/GroupList';

import './styles/index.scss';
import './styles/themes.scss';

function App() {
  useGlobalStyles();

  return (
    <div className="theme theme--default">
      <HeaderBar />
      <main>
        <Route exact path="/" component={Home} />
        <Route path="/groups" component={GroupList} />
      </main>
    </div>
  );
}

export default App;
