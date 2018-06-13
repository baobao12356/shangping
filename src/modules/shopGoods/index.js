import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import Env from 'rs-browser';
import Cookies from 'js-cookie';
import HybridUserInfo from 'rs-hybrid-user-info';
import Routes from '../../routes/Routers';
import Os from 'rs-os';

window.__native_init = function () {
  if (Env.rsApp) {
    new HybridUserInfo().getUserInfo().then((res) => {
      if (res && res.sessionid && res.openid) {
        // save cookie
        Cookies.set('SESSION.user', res.sessionid);
        Cookies.set('sessionid', res.sessionid);
        Cookies.set('openid', res.openid);
        Cookies.set('is_login', 1);
        Cookies.set('SESSION.plus', 0);
      } else {
        Cookies.remove('SESSION.user');
        Cookies.remove('sessionid');
        Cookies.remove('openid');
        Cookies.remove('is_login');
        Cookies.remove('SESSION.plus');
      }
      ReactDOM.render(<Routes />, document.getElementById('application'));
    }).catch((e) => {
      console.log(e);
      ReactDOM.render(<Routes />, document.getElementById('application'));
    });
  } else {
    ReactDOM.render(<Routes />, document.getElementById('application'));
  }
};
if (Env.rsApp) {
  if (parseInt(Os.version) <= 8) {
    setTimeout(function () {
      window.__native_init();
    }, 300);
  }
} else {
  window.__native_init();
}
