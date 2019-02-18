import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import { createBrowserHistory } from 'history';
import { configureStore } from 'app/store';
// import { Router } from 'react-router';
// import { createBrowserHistory } from "history";
import { BrowserRouter } from "react-router-dom";
import { App } from './app';

// prepare store
// const history = createBrowserHistory({ basename: "/" });
const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename="/">
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
