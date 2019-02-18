import * as React from 'react';
import { Route, Switch } from 'react-router';
// import { App as TodoApp } from 'app/containers/App';
import { Home } from "app/containers/Home";
import { Vote } from "app/containers/Vote";
import { hot } from 'react-hot-loader';

export const App = hot(module)(() => (
  <Switch>
    <Route path="/:userToken/election/:electionId" component={Vote} />
    <Route path="/:userToken" component={Home} />
  </Switch>
));
