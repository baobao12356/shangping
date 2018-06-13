import Env from 'rs-browser';
import Host from './config_host';
import GetUserInfo from './getUserInfo';
import GetNativeInfo from './getNativeInfo';
import urlParse from './urlParse';

export default class BigData {
  constructor() {
    console.log('bigData');
    this.params = BigData.param();
    this.loadData = BigData.loadData();
    this.count = new Map();

    this.p = this.p.bind(this);
    this.z = this.z.bind(this);
    this.pz = this.pz.bind(this);
    this.f = this.f.bind(this);
  }

  static loadData() {
    return new Promise((resolve, reject) => {
      if (!window.data) {
        const headObj = document.querySelector('head');
        const scriptObj = document.createElement('script');
        scriptObj.onload = () => {
          resolve();
        };
        scriptObj.onerror = () => {
          reject(new Error('大数据方法加载失败'));
        };
        scriptObj.src = `${Host.aureuma}/js/aureuma.data.min.js`;
        headObj.appendChild(scriptObj);
      } else {
        resolve();
      }
    });
  }

  static param() {
    return new Promise((resolve, reject) => {   //resolve({});
      //p z f 点公用参数
      const param = {
        p_url: window.location.href,
        u_id: '',
        u_guid: '',
        app_v: '',
        u_mid: ''
      };

      GetUserInfo().catch((e) => {
        console.log(e);
      }).then((res) => {
        GetNativeInfo().catch((e) => {
          console.log(e);
        }).then((data) => {
          //native数据
          if (data) {
            if ( data.ShowCityName ) {
              param.u_city = data.ShowCityName;
            }
            if (data.hxiphoneUUID) {
              param.u_guid = param.u_mid = data.hxiphoneUUID;
            }
            if (data.version) {
              param.app_v = data.version;
            }
            if (data.appFrom) {
              param.app_b = data.appFrom;
            }
            if (!Env.rsApp) {
              param.r_url = sessionStorage.h5_rurl ? sessionStorage.h5_rurl : window.location.href;
            } else {
              param.r_url = data.nativeRUrl;
            }
          }

          //用户信息
          if (res && res.openid) {
            param.u_guid = param.u_id = res.openid;
          }
          resolve(param);
        });
      }).catch((e) => {
        console.log(e);
        reject();
      });
    });
  }

  p(page, channel, type, title = '', id = urlParse('id'), domain = 'mmall.com') {
    const _this = this;
    Promise.all([_this.loadData, _this.params]).then((res) => {
      const params = res[1];
      const temp = {
        p_domain: domain,
        p_channel: channel,
        p_type: type,
        p_id: id,
        p_title: title,
        page,
        service: 'h5.pvuv'
      };
      Object.assign(temp, params);
      window.data.pageAndUserView(temp);
      console.log('p', temp);
    }).catch((e) => {
      console.log(e);
    }).then(() => {
      sessionStorage.h5_rurl = window.location.href;
    });
  }

  z(page, channel, type, title = '', id = urlParse('id'), domain = 'mmall.com') {
    console.log('enter z');
    const _this = this;
    const start = Date.now();

    Promise.all([_this.loadData, _this.params]).then((res) => {
      const params = res[1];
      const temp = {
        p_domain: domain,
        p_channel: channel,
        p_type: type,
        p_id: id,
        p_title: title,
        page,
        service: 'h5.staytime'
      };
      Object.assign(temp, params);

      function viewTime() {
        temp.p_stay_time = Date.now() - start;
        window.data.pageViewTime(temp);
        console.log('z', temp);
      }

      if (/\.html#\//.test(window.location.href) && window.location.href.indexOf('?') > 0 && !window.location.search) {
        window.onpopstate = viewTime;
      } else {
        window.onunload = viewTime;
      }
    }).catch((e) => {
      console.log(e);
    });
  }

  pz(page, channel, type, title, id, domain) {
    this.p(page, channel, type, title, id, domain);
    this.z(page, channel, type, title, id, domain);
  }

  f(page, channel, type, title, item, actionId = '', action = '', actionPos = '', actionTol = '', id = urlParse('id'), domain = 'mmall.com') {
    const _this = this;
    Promise.all([_this.loadData, _this.params]).then((res) => {
      const params = res[1];
      const temp = {
        p_domain: domain,
        p_channel: channel,
        p_type: type,
        p_id: id,
        p_title: title,
        page,
        p_item: item,
        p_action_id: actionId,
        p_action: action,
        p_action_pos: actionPos,
        p_action_total: actionTol,
        service: 'h5.click'
      };
      Object.assign(temp, params);
      window.data.clickEvent(temp);
      console.log('f', temp);
    }).catch((e) => {
      console.log(e);
    });
  }

}
