import HybridOpenPageLogin from 'rs-hybrid-open-page-login';
import Env from 'rs-browser';
import Cookies from 'js-cookie';
import Config from './config_host';

export default function login() {

  return new Promise((resolve, reject) => {
    if (Env.rsApp) {
      new HybridOpenPageLogin().open((data) => {
        if (data && data.data && data.data.sessionid && data.data.openid) {
          Cookies.set('SESSION.user', data.data.sessionid);
          Cookies.set('sessionid', data.data.sessionid);
          Cookies.set('openid', data.data.openid);
          sessionStorage.userInfo = JSON.stringify(data.data);
          window.location.href = location.href;
          resolve(data.data);
        }
      }).catch((e) => {
        console.log(e);
        reject(new Error('登录失败'));
      })
    } else {
      window.location.href = `${Config.hostname}/login`;
      reject(new Error('wap端不支持链式调用'));
    }

  }).catch((e) => {
    console.log(e);
  });

}
