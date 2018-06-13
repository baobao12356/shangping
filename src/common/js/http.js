import Env from 'rs-browser';
import QueryString from 'query-string';
import 'whatwg-fetch';
// if (navigator.appVersion.indexOf('CPU iPhone OS') > -1 && parseInt(navigator.appVersion.split('CPU iPhone OS')[1]) < 9) {
//   require('rs-hybrid-http');
// } else {
//   require('rs-hybrid-bs-http');
// }


/*使用文档参考whatwg-fetch
 *strData: post请求中是否将参数转换为json字符串，默认为true
 * */
const host = window.__config_env || {
  path: '',//!Env.rsApp ? '' : 'http://mkl.uat1.rs.com'
  // path: !Env.rsApp ? '' : 'https://merchant-h5.mmall.com'
};


export default class Http {
  static send(url, option, resolve, reject, errorCallback) {
    const param = {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      requestSerializerType: '1',
      body: null
    };
    Object.assign(param, option);

    if (param.body) {
      if (param.method == 'GET') {
        param.body = QueryString.stringify(param.body);
        url += (url.indexOf('?') > -1 ? '&' + param.body : '?' + param.body);
        param.body = null;
      } else if (param.method == 'POST') {
        if (param.headers['Content-Type'] == 'application/json') {
          param.body = JSON.stringify(param.body);
        } else {
          if (param.type == 0) {
            param.body = QueryString.stringify(param.body);
          } else {
            param.body = JSON.stringify(param.body);
          }
        }
      }
    }

    const start = Date.now();
    const hostUrl = host.path + url;
    if (param.flag) {
      return fetch(hostUrl, param)
        .then((response) => {
          try {
            const end = Date.now() - start;
            window.data && window.data.exposureData({
              page: '110.101.49.58.68.78.99',
              service: 'miaokai.api.sepc',
              p_channel: 'home',
              p_type: 'miaokai.api.sepc',
              p_item: 'api.time',
              p_domain: 'mmall.com',
              p_action: JSON.stringify({
                'api-mark': hostUrl,
                'time': end
              })
            });
          } catch (e) {

          }

          if (response.status >= 200 && response.status < 300) {
            return response;
          } else {
            let error = new Error(response.statusText);
            error.response = response;
            throw error;
          }
        })
        .then((res) => {
          res.json().then((data) => {
            resolve({ data, res });
          }).catch((e) => {
            reject(new Error('数据无法解析'));
          });
        })
        .catch((e) => {
          console.log(e);
          if (errorCallback && typeof errorCallback == 'function') {
            console.log(e, ' errorCallback');
            errorCallback();
          }
        });
    } else {
      return fetch(hostUrl, param)
        .then((response) => {
          try {
            const end = Date.now() - start;
            window.data && window.data.exposureData({
              page: '110.101.49.58.68.78.99',
              service: 'miaokai.api.sepc',
              p_channel: 'home',
              p_type: 'miaokai.api.sepc',
              p_item: 'api.time',
              p_domain: 'mmall.com',
              p_action: JSON.stringify({
                'api-mark': hostUrl,
                'time': end
              })
            });
          } catch (e) {

          }

          if (response.status >= 200 && response.status < 300) {
            return response;
          } else {
            let error = new Error(response.statusText);
            error.response = response;
            throw error;
          }
        })
        .then((res) => {
          res.json().then((data) => {
            resolve(data, res);
          }).catch((e) => {
            reject(new Error('数据无法解析'));
          });
        })
        .catch((e) => {
          console.log(e);
          if (errorCallback && typeof errorCallback == 'function') {
            console.log(e, ' errorCallback');
            errorCallback();
          }
        });
    }


  }

  static get(url, option = {}, errorCallback) {
    return new Promise((resolve, reject) => {
      Http.send(url, option, resolve, reject, errorCallback);
    });
  }

  static post(url, option = {}, errorCallback) {
    Object.assign(option, {
      method: 'POST'
    });
    return new Promise((resolve, reject) => {
      Http.send(url, option, resolve, reject, errorCallback);
    });
  }
}
