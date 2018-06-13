require('../../common/js/flexible');
import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';
import Env from 'rs-browser';
if (Env.rsApp) {
  window.__native_init = function () {
    ReactDOM.render(<Main/>, document.getElementById('application'));
  }
} else {
  ReactDOM.render(<Main/>, document.getElementById('application'));
}
