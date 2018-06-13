/**
 * Created by chunhua.yang on 2017/7/6.
 */
import Env from 'rs-browser';
import Back from 'rs-hybrid-back';
import Os from 'rs-os';
import urlParse from './urlParse';
import HybridBridge from 'rs-hybrid-bridge';

export default function back() {
  if (Env.rsApp) {
    // status 非必须
    // 控制顶部状态栏颜色
    if (window.location.href.indexOf('status=') > -1 && Env.ios) {
      let hybridBridge = new HybridBridge(window);
      let color = urlParse('status');
      console.log('修改状态栏', color)
      hybridBridge.hybrid('call_native', {
        colorType: color, //'black' 'white'
        tag: '58'
      }).then((result) => {
        // ...
        console.log('执行58成功,这里是back方法！！！');
      }).catch((error) => {
        // ...
        console.log('执行58失败');
      });
    }
    if (Env.ios && parseInt(Os.version) > 8 && ((window.location.href.indexOf('back=h5') > -1 && window.location.protocol != 'file:') || (window.location.href.indexOf('back=file') > -1 && window.location.protocol == 'file:'))) {
      //app内,目标页为file协议，当前页为file协议
      window.history.go(-1);
    } else if ((Env.android || parseInt(Os.version) <= 8) && window.location.href.indexOf('back=') > -1) {
      window.history.go(-1);
    } else {
      new Back().back();
    }
  } else {
    window.history.go(-1);
  }

  return false;
}


