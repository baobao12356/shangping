import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
import Main from '../modules/shopGoods/main';
import store from '../store';

export default class Routers extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}
