import Cookies from 'js-cookie';

function getOpenId() {
  return Cookies.get('openid');
}

function isLogin() {
  return !!getOpenId();
}

function getSessionid() {
  return Cookies.get('sessionid') ? Cookies.get('sessionid') : Cookies.get('SESSION.user');
}


export default {
  isLogin,
  getOpenId,
  getSessionid
};
