import React, { Component } from 'react';
import Env from 'rs-browser';
import Back from 'rs-hybrid-back';
import Share from 'rs-hybrid-share';
import cs from 'classnames';
import backOrient from '../../common/js/backOrient';
import './style.scss';

/* nav 参考文章详情页
 *props: title, shareIcon, share,scroll
 * shareIcon - 是否显示分享按钮
 * title - string，标题
 * share - object, 分享所需的参数
 * initShareData - 分享所需数据是否初始化完成
 * scroll - Bool 滚动时导航切换样式，默认false
 * */
export default class Nav extends Component {

  constructor(props) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleShop = this.handleShop.bind(this);
    this.state = {
      navTop: true
    }
  }

  static defaultProps = {
    shareIcon: true
  };

  handleShop() {
    const config = window.__config_env || {
      hostname: 'http://mkl.uat1.rs.com'
    };
    let { shopId } = this.props;
    if (shopId.indexOf('flagship') > -1) {
      shopId = shopId.replace('flagship', '');
      location = config.hostname + '/flagshipShop?id=' + shopId + '&back=h5';
    } else {
      location = config.hostname + '/shopDetail?id=' + shopId + '&back=h5';
    }
  }

  handleBack() {
    if (location.href.indexOf('back=h5') > -1 || !Env.rsApp) {
      history.go(-1);
    } else if (Env.rsApp) {
      new Back().back();
    }
  }

  handleShare() {
    if (!this.props.initShareData) {
      console.log('收藏数据未初始化完成');
      return;
    }
    let temp = Object.assign({}, {
      title: '标题',
      text: '立即查看详情，悦享红星美凯龙高端品质服务-为中国设计而生',
      img: require('./img/logo.png'),
      record: false
    }, this.props.share);
    const { title, text, img, link, record, objectId, objectType } = temp;
    new Share().open(title, text, img, link, record, objectId, objectType);
  }

  navScroll(elm) {
    let _this = this;
    let btnHeight = parseFloat(window.getComputedStyle(elm).height);
    window.onscroll = function () {
      let sTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      if (sTop >= btnHeight) {
        _this.setState({
          navTop: false
        });
      }
      if (!sTop || sTop < btnHeight) {
        _this.setState({
          navTop: true
        });
      }
    }
  };

  componentDidMount() {
    let $nav = this.refs.nav;
    if (this.props.scroll) {
      this.navScroll($nav);
    }
  }

  render() {
    let { shareIcon, title, shopId } = this.props;
    let className = cs({
      'com-page-nav': true,
      'ios-nav': Env.rsApp && Env.ios ? true : false,
      'fixed': this.props.scroll ? this.state.navTop : false
    });

    if (!Env.rsApp && shareIcon) {
      shareIcon = false;
    }

    return (
      <nav className={className} ref="nav">
        <span className="back" onTouchStart={this.handleBack}></span>
        {shopId && <span className="shop" onTouchStart={this.handleShop}></span>}
        {shareIcon && <span className="share" onTouchStart={this.handleShare}></span>}
        {title && <div>{title}</div>}
      </nav>
    )
  }
}
