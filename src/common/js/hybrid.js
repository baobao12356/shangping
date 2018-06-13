import Env from 'rs-browser';

var callbackMap = new Map();

if (!window._app_callback) {
  window._app_callback = (uuid, res) => {
    let temp = callbackMap.get(uuid);
    try {
      if (res === '') {
        res = '{}';
      }
      if (typeof(res) == 'string') {
        res = JSON.parse(res);
      }
      if (temp) {
        delete callbackMap[uuid];
        temp.resolve(res);
      }
    } catch (e) {
      temp && temp.reject(new Error('_app_callback发生异常'));
    }
  }
}

export default function Hybrid(uuid, action, param = {}, needCallback = true) {
  return new Promise((resolve, reject) => {
    needCallback && callbackMap.set(uuid, {
      resolve,
      reject
    });
    if (!uuid) {
      reject(new Error('uuid缺失'));
      return;
    }
    if (!Env.rsApp) {
      reject(new Error('_app_call只能在app中调用'));
      return;
    }
    if (window._app_call) {
      window._app_call(uuid, action, JSON.stringify(param));
    } else if (window.hybrid && window.hybrid._app_call) {
      window.hybrid._app_call(uuid, action, JSON.stringify(param));
    }
  })
}
