import React, { Component } from 'react';
import classnames from 'classnames';
import './style.scss';
import Hybrid from '../../common/js/hybrid';
import WxShare from '../../common/js/wxShare';
import ShopCarIcon from '../../components/shopCarIcon';
import backPng from './img/back-hui@3x.png';
import sharePng from './img/share.png';
import HybridShare from 'rs-hybrid-share';
import Version from 'rs-browser';
import Back from '../../common/js/back';
import Env from 'rs-browser';
import UrlParse from '../../common/js/urlParse';

let prodcutHeight = '', detailHeight = '', eleHeight = '', recHeight = '', headerTop = '', navHeight = '';
export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    currentIndex: 0,
    showItemIndex: 1,
    opacity: 0,
  };

  componentDidMount() {
    // document.querySelector('#hmHeders header').style.display='none'
    // document.querySelector('#hmHeders .middleShopName').style.display='none'
    document.querySelector('#hmHeders header').style.opacity = 0
    document.querySelector('#hmHeders .middleShopName').style.opacity = 0
    const t = this
    window.addEventListener('scroll', function () {
      // sessionStorage.setItem('shopGoods_topsize',document.documentElement.scrollTop || document.body.scrollTop)
      // console.log(sessionStorage.getItem('shopGoods_topsize'))
      // window.shopGoods_topsize = document.documentElement.scrollTop || document.body.scrollTop
      // console.log(window.shopGoods_topsize)
      let scTop = t.getScrollTop();
      if (scTop <= (prodcutHeight)) {
        t.changeTab(0);
      } else if (scTop <= (recHeight)) {
        t.changeTab(1);
      } else if (scTop <= (detailHeight)) {
        t.changeTab(2);
      } else if (scTop <= (eleHeight)) {
        t.changeTab(3);
      }

      if (scTop > 0 && document.querySelector('#shopGoods').className.indexOf('popupActive') < 0) {
        t.setState({
          opacity: (scTop / document.documentElement.clientWidth) > 1 ? 1 : (scTop / document.documentElement.clientWidth)
        })
      }
      if (document.querySelector('#shopGoods').className.indexOf('popupActive') > -1) {
        // document.querySelector('#hmHeders header').style.display = 'block'
        document.querySelector('#hmHeders header').style.opacity = t.state.opacity

        // document.querySelector('#hmHeders .middleShopName').style.display = 'block'
        document.querySelector('#hmHeders .middleShopName').style.opacity = t.state.opacity
      } else if (scTop > 0) {
        let opacity = (scTop / document.documentElement.clientWidth) > 1 ? 1 : (scTop / document.documentElement.clientWidth)
        // document.querySelector('#hmHeders header').style.display = 'block'
        document.querySelector('#hmHeders header').style.opacity = opacity

        // document.querySelector('#hmHeders .middleShopName').style.display = 'block'
        document.querySelector('#hmHeders .middleShopName').style.opacity = opacity
      } else if (scTop <= 0) {
        // document.querySelector('#hmHeders header').style.display = 'none'
        // document.querySelector('#hmHeders .middleShopName').style.display = 'none'
        document.querySelector('#hmHeders header').style.opacity = 0
        document.querySelector('#hmHeders .middleShopName').style.opacity = 0

      }
    });
    const { data } = t.props;
    new WxShare(data.pdtName, data.picUrl, data.productSecondName);



  };

  componentDidUpdate() {
    navHeight = document.querySelector('.headerCon').offsetHeight * 2
    headerTop = document.querySelector('#hmHeders header').offsetHeight
    prodcutHeight = document.getElementById('product').offsetTop + document.getElementById('product').offsetHeight;
    recHeight = document.getElementById('shopParameter').offsetTop + document.getElementById('shopParameter').offsetHeight - navHeight;
    detailHeight = document.getElementById('detail').offsetTop + document.getElementById('detail').offsetHeight - navHeight;
    eleHeight = document.getElementById('element').offsetTop + document.getElementById('element').offsetHeight - navHeight;
    //console.log(prodcutHeight, detailHeight, eleHeight);
  }

  getScrollTop = () => {
    let scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
      scrollTop = document.body.scrollTop;
    }
    return scrollTop;
  };

  changeTab = (index) => {
    this.setState({
      currentIndex: index,
    });
    return index === this.state.currentIndex ? classnames({ 'hmTab': true, 'hmActive': true }) : classnames(
      { 'hmTab': true });
  };

  changeTabClassName(index) {
    return index === this.state.currentIndex ? classnames({ 'hmTab': true, 'hmActive': true }) : classnames(
      { 'hmTab': true });
  }

  //动态生成tab导航
  createTabs = () => {
    const { dataTabs } = this.props;
    return dataTabs.map((element, index) => {
      return (
        <a key={index} onClick={() => this.scrollToAnchor(index, element.id)}>
          <li onClick={() => this.changeTab(index)}
            className={this.changeTabClassName(index)}>{element.tabName}</li>
        </a>
      );
    });
  };
  scrollToAnchor = (index, id) => {
    const { f } = this.props;
    let md = '';
    switch (index) {
      case 0:
        md = 'product';
        break;
      case 1:
        md = 'shopParameter';
        break;
      case 2:
        md = 'detail';
        break;
      case 3:
        md = 'element'
        break;
      default:
        md = 'product';
        break;
    }
    if (md) {
      // 找到锚点
      let anchorElement = document.getElementById(md);
      // 如果对应id的锚点存在，就跳转到锚点
      if (anchorElement) {
        // anchorElement.scrollIntoView(true);
        window.scroll(0, anchorElement.offsetTop - headerTop)
      }
    }
    f({
      id: 2878,
      p_action_id: `skuid=${UrlParse('id')}&tag=${id}`
    });
  };

  backToRouter = () => {
    console.log('alert');
    Back();
  };

  //分享页面
  shareProduct = () => {
    const { data } = this.props;
    var hybridShare = new HybridShare();
    hybridShare.open(data.pdtName, data.productSecondName, data.picUrl,
      // `${window.__config_env ? window.__config_env.hostname : 'http://mkl.uat1.rs.com'}/shopGoods/?id=${data.pdtSku}`, false, data.pdtSku, 'share_case');
      `${window.__config_env ? window.__config_env.wap : 'http://m.uat1.rs.com'}/item/${data.pdtSku}.html`, false, data.pdtSku, 'share_case');
  };

  //跳转到购物车页面
  toShopCart = () => {
    Hybrid('cart', 'call_native', { tag: '5' }).then((res) => {
      if (res.success == 'true') {
      }
    }).catch((e) => {
      console.log(e);
    });
  };

  render() {
    // console.log(!Env.ios&&Env.rsApp || !Env.rsApp,'Env.ios')
    if (!Env.ios && Env.rsApp || !Env.rsApp) {
      // android || web
      // console.log(99999999999999999999)

      // document.querySelector('#hmHeders .header').style.height = '1.17333333rem'
      // this.refs.header.style.height = '1.17333333rem'
    }
    return (
      <div id="hmHeders">
        <header ref="header" style={(!Env.ios && Env.rsApp || !Env.rsApp) ? { height: '1.173333rem', top: 0 } : { height: '1.7066666rem', top: 0 }}>
          <ul className="headerCon" style={(!Env.ios && Env.rsApp || !Env.rsApp) ? { marginTop: '1.173333rem' } : { marginTop: '1.7066666rem' }}>
            {
              this.createTabs()
            }
          </ul>
        </header>
        {/*是否显示返回按钮*/}
        {this.props.isShowBack &&
          <div className="backArrowCon" onClick={this.backToRouter.bind(this)} style={(!Env.ios && Env.rsApp || !Env.rsApp) ? { height: '1.173333rem', top: 0 } : { height: '1.7066666rem', top: 0 }}>
            <img src={backPng} className="backArrow" />
          </div>
        }
        <div className="middleShopName" style={(!Env.ios && Env.rsApp || !Env.rsApp) ? { height: '1.173333rem', top: 0 } : { height: '1.7066666rem', paddingTop: '0.53333rem', top: 0 }}>
          <div>
            {this.props.shopName}
          </div>
        </div>
        {
          Version.rsApp &&
          <div className="rightExport" style={(!Env.ios && Env.rsApp || !Env.rsApp) ? { height: '1.173333rem', top: 0 } : { height: '1.7066666rem', paddingTop: '0.853333rem', top: 0 }}>
            <ShopCarIcon count={this.props.shopCarCount} toShopCart={this.toShopCart} />
            <div className="share" onClick={this.shareProduct.bind(this)}>
              <img src={sharePng} />
            </div>
          </div>
        }
        <div className="content">
          {
            React.Children.map(this.props.children, function (child) {
              return <div>{child}</div>;
            })
          }
        </div>
      </div>
    );
  }
}
