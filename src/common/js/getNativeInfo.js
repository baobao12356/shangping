import HybridBridge from 'rs-hybrid-bridge';
import Env from 'rs-browser';

export default function getNativeInfo() {
  return new Promise((resolve, reject) => {
    console.log('get native info');
    if (Env.rsApp) {
      if (sessionStorage.nativeInfo && sessionStorage.nativeInfo != '') {
        resolve(JSON.parse(sessionStorage.nativeInfo));
      } else {
        new HybridBridge(window).hybrid('getter', {}).then((res) => {
          if (res && res.hxiphoneUUID && res.appFrom) {
            sessionStorage.nativeInfo = JSON.stringify(res);
            resolve(res);
          } else {
            reject(new Error('未返回native数据'));
          }
          return res;
        });
      }
    } else {
      console.log('wap中仅支持获取hxiphoneUUID');
      if (localStorage.nativeInfo && sessionStorage.nativeInfo != '') {
        resolve(JSON.parse(localStorage.nativeInfo));
      } else {
        const userNum = {
          hxiphoneUUID: 'a_' + Date.now() + '_' + (Math.random() * Math.random()).toString(15).substr(2, 32)
        };
        localStorage.nativeInfo = JSON.stringify(userNum);
        resolve(userNum);
      }
    }
  });
}
