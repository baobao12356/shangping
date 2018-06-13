import HybridUserInfo from 'rs-hybrid-user-info';
import Env from 'rs-browser';

export default function getUserInfo() {
  return new Promise((resolve, reject) => {
    console.log('get user info');
    if (Env.rsApp) {
      if (sessionStorage.userInfo && sessionStorage.userInfo != '') {
        resolve(JSON.parse(sessionStorage.userInfo));
      } else {
        new HybridUserInfo().getUserInfo().then((res) => {
          console.log('hybriduserinfo',res);
          if (res && res.sessionid && res.openid) {
            sessionStorage.userInfo = JSON.stringify(res);
            resolve(res);
          } else {
            reject(new Error('app-未返回用户信息'));
          }
          return res;
        });
      }
    } else {
      if (localStorage.userInfo) {
        resolve(JSON.parse(localStorage.userInfo));
      } else {
        reject(new Error('wap-用户未登录'));
      }
    }
  })/*.catch((e) => {
    console.log(e);
  })*/;
}
