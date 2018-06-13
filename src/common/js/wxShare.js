import Env from 'rs-browser';
import Http from './http';

export default class WxShare {
  constructor(title='分享标题', img=require('./logo.png'), text='立即查看详情，悦享红星美凯龙高端品质服务-为中国设计而生') {
    console.log('wxShare constructor');
    if ( Env.weiXin ) {
      sessionStorage.wxShareTitle = title;
      sessionStorage.wxShareText = text;
      sessionStorage.wxShareImg = img;
      WxShare.loadData().then(() => {
        this.config();
      }).catch((e) => {
        console.log(e);
      })
    }
  }

  static loadData() {
    return new Promise((resolve, reject) => {
      if (!window.wx) {
        const headObj = document.querySelector('head');
        const scriptObj = document.createElement('script');
        scriptObj.onload = () => {
          resolve();
        };
        scriptObj.onerror = () => {
          reject(new Error('微信js加载失败'));
        };
        scriptObj.src = 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js';
        headObj.appendChild(scriptObj);
      } else {
        resolve();
      }
    });
  }

  config() {
    console.log('wxShare config');
    this.share();
    Http.post('/api-longguo/weixin/jssdkConfig', {
      body: {
        'url': window.location.href
      }
    }).then( data => { console.log('wxShare api-longguo/weixin/jssdkConfig', data);
      let wx = window.wx || {};
      let {dataMap} = data;
      wx.config({
        debug: false,
        appId: dataMap.appId,
        timestamp: dataMap.timestamp,
        nonceStr: dataMap.nonceStr,
        signature: dataMap.signature,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
      });
    }).catch(e=> {
      console.log(e);
    });
  }

  share() {
    console.log('wxshare share');
    let wx = window.wx || {};
    wx.ready(() => {
      console.log('wx config ready');
      wx.onMenuShareTimeline({
        title: sessionStorage.wxShareTitle,
        link: window.location.href, // 分享链接
        imgUrl: sessionStorage.wxShareImg, // 分享图标
        success: function () {
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      });

      wx.onMenuShareAppMessage({
        title: sessionStorage.wxShareTitle, // 分享标题
        desc: sessionStorage.wxShareText, // 分享描述
        link: window.location.href, // 分享链接
        imgUrl: sessionStorage.wxShareImg, // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      });

      wx.onMenuShareQQ({
        title: sessionStorage.wxShareTitle, // 分享标题
        desc: sessionStorage.wxShareText, // 分享描述
        link: window.location.href, // 分享链接
        imgUrl: sessionStorage.wxShareImg, // 分享图标
        success: function () {
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      });

      wx.onMenuShareWeibo({
        title: sessionStorage.wxShareTitle, // 分享标题
        desc: sessionStorage.wxShareText, // 分享描述
        link: window.location.href, // 分享链接
        imgUrl: sessionStorage.wxShareImg, // 分享图标
        success: function () {
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      });

      wx.onMenuShareQZone({
        title: sessionStorage.wxShareTitle, // 分享标题
        desc: sessionStorage.wxShareText, // 分享描述
        link: window.location.href, // 分享链接
        imgUrl: sessionStorage.wxShareImg, // 分享图标
        success: function () {
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      });
    });
  }
}
