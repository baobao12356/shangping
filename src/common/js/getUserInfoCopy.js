import HybridUserInfo from 'rs-hybrid-user-info';
import Env from 'rs-browser';

export default function getUserInfo() {
    console.log('get user info');
    let userInfo;
    if (Env.rsApp) {
      if (sessionStorage.userInfo && sessionStorage.userInfo != '') {
        console.log('wapUserInfo',sessionStorage.userInfo);
        userInfo =  JSON.parse(sessionStorage.userInfo)
      } else {
        new HybridUserInfo().getUserInfo().then((res) => {
          console.log('hybriduserinfo',res);
          if (res && res.sessionid && res.openid) {
            sessionStorage.userInfo = JSON.stringify(res);
            userInfo = res
            console.log(22222,userInfo)
          } else {
            console.log('app-未返回用户信息');
          }
        })
      }
    } else {
      if (localStorage.userInfo) {
        userInfo = JSON.parse(localStorage.userInfo);
      } else {
        console.log('wap-用户未登录');
      }
    }
    return userInfo;
}
