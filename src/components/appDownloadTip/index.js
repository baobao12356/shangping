import React, {Component} from 'react';
import onfire from 'onfire.js';
require('./style.scss');
import OpenApp from '../../common/js/openApp';
import Env from 'rs-browser';

/* appDownloadTip wap站及分享落地页头部app下载横栏
 * */
export default class AppDownloadTip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tip: 'hide' //'show'
    };

    this.handleClose = this.handleClose.bind(this);
    this.closeWxTip = this.closeWxTip.bind(this);
    this.scrollFn = this.scrollFn.bind(this);
  }

  scrollFn() {
    const doc = document;
    const sTop = doc.documentElement.scrollTop || window.pageYOffset || doc.body.scrollTop;
    const tipEle = doc.querySelectorAll('.com-app-download-tip')[0];
    const {tip} = this.state;
    if(Env.rsApp){
      tipEle.style.display = 'none !important';
      return false;
    }
    if (sTop <= 0 && tip != 'hide') {
      tipEle.style.display = 'flex';
    } else if (sTop > 100) {
      tipEle.style.display = 'none';
    }
  }

  componentDidMount() {
    const _this = this;
    window.addEventListener('scroll', _this.scrollFn, false);

    new OpenApp();

    onfire.on('appDownloadWxTipShow', ()=> {
      document.querySelectorAll('.com-app-download-tip .wx-tip')[0].style.display = 'block';
    });
  }

  componentWillUnmount() {
    const _this = this;
    window.removeEventListener('scroll', _this.scrollFn);
  }

  handleClose() {
    document.querySelector('.com-app-download-tip').style.display = 'none';
    this.setState({
      tip: 'hide'
    });
  }

  closeWxTip() {
    document.querySelectorAll('.com-app-download-tip .wx-tip')[0].style.display = 'none';
  }

  render() {
    return (
      <div className="com-app-download-tip">
        <div className="logo-container">
        </div>
        <div className="info-container">
          <h5>红星美凯龙</h5>
          <h2>让日常不寻常</h2>
        </div>
        <div className="btn-container">
          <a id="btnOpenApp">立即打开</a>
        </div>
        <div className="close-container" onClick={this.handleClose}>
        </div>
        <div className="wx-tip" onTouchStart={this.closeWxTip}></div>
      </div>
    )
  }
}
