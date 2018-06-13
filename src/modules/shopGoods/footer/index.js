/**
 * Created by xin.li on 2017/7/4.
 */
import React, { Component } from 'react';
import { Popup, Flex, Toast, Button } from 'antd-mobile';
import Http from '../../../common/js/http';
import HybridBridge from 'rs-hybrid-bridge';
import HybridLocation from 'rs-hybrid-location';
import HybridOpenPageLogin from 'rs-hybrid-open-page-login';
import Env from 'rs-browser';
import ShopCarPopup from './../shopCarPopup';
import Shopexperience from './../shopExperiencePopup'
import Hybrid from '../../../common/js/hybrid';
import GetUserInfo from '../../../common/js/getUserInfo';
import getNativeInfo from '../../../common/js/getNativeInfo';
import './style.scss';
import OpenApp from '../../../common/js/openApp';
import backOrient from '../../../common/js/backOrient';
import Collect from '../../../components/collect';
import CollectOld from '../../../components/collect/index-old';
import CollectAncient from '../../../components/collectAncient';
import { getMshop, getFlagShop, getAddCart } from '../../../actions';
import { connect } from 'react-redux';
import JudgeVersion from '../../../common/js/judgeVersion';
import Cookies from 'js-cookie';
import { isLogin } from '../../../common/js/AuthUtil';
import UrlParse from '../../../common/js/urlParse';
const FlexItem = Flex.Item;

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}
class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goodsList: [],
      specList: [],
      colorList: [],
      experience: 0, //到店体验按钮版本控制
      collectRequest: {
        sourceType: 14,
        channel: 'comm',
        title: props && props.goodsData.pdtName,
        picture: props && props.goodsData.picUrl,
        desc1: {},
        id: ''
      },
      initCollectData: true,
      pdtSku: props && props.goodsData.pdtSku,
      appver: 0,
      version: true,
      collectversion: true
    };
    this.hybridLocation = new HybridLocation();
    this.hybridOpenPageLogin = new HybridOpenPageLogin();
    this.getNativeInfo = new getNativeInfo();
    this.getShopInfo = this.getShopInfo.bind(this);
    this.popBefore = this.popBefore.bind(this);
    this.popAfter = this.popAfter.bind(this);
    this.fetchAddCart = this.fetchAddCart.bind(this);
    console.log(this.props, 'this.props.footer');
  }

  // 获取数据分别处理
  componentDidMount() {
    const t = this;
    this.getVersionAndJudge();
    if (t.props.goodsData) {
      const goodsData = t.props.goodsData;

      this.getNativeInfo.then(data => {
        //alert(data.version)
        data.version && (JudgeVersion(data.version + '', '2.1.1')) && t.setState({
          experience: 1
        });

        t.setState({
          appver: data.version + '',
        })
      }).catch(e => {
        console.log(e)
      });


      /**
       *  goodsType 判断商品类型
       *  0 品牌库商品 1 自采商品
       */
      //goodsData.goodsType == 0 ? t.setProduct() : t.setSelfServed();

      new HybridBridge(window).hybrid('getter', {}).then((res) => {
        if (res && res.version && +res.version.replace(/\./g, '') >= 310) {
          new HybridBridge(window).hybrid('getterDynamicData', {}).then((res) => {
            // this.state.location = res;
            this.setState({
              location: res
            }, () => {
              // alert(JSON.stringify(res))
              t.getShopInfo();
            })
          }).catch((error) => {
            t.getShopInfo();
            // console.log(error);
          });
        } else {
          // native获取地理位置接口
          t.hybridLocation.getLocation().then((res) => {
            // appLocation = res;
            // this.state.location = appLocation;
            // getShopInfo();
            console.log(res, '获取地理志...........')
            this.setState({
              location: res
            }, () => {
              // alert(JSON.stringify(res))
              t.getShopInfo();
            })
          }).catch((error) => {
            t.getShopInfo();
            // console.log(error);
          });
        }
      });

      // 如果预付定金活动的活动规则事件绑定
      // t.props.goodsData.promotion.promotionType == 30 && document.querySelector('#couponShop').addEventListener('click', function (e) {
      //   t.reserve();
      // }, false);
    }
    new OpenApp('#link-app');
  }

  componentWillReceiveProps(nextProps) {
    console.log('1111111111111111', nextProps)
    this.setState({
      collectRequest: {
        sourceType: 14,
        channel: 'comm',
        title: nextProps.goodsData.pdtName,
        picture: nextProps.goodsData.picUrl,
        desc1: {},
        id: nextProps.goodsData.pdtSku,
      },
    })
  }

  async fetchMshop(options) {
    const { dispatch } = this.props;
    dispatch(await getMshop(options));
  }

  async fetchFlagShop(options) {
    const { dispatch } = this.props;
    dispatch(await getFlagShop(options));
  }

  async fetchAddCart(data, options) {
    const { dispatch } = this.props;
    dispatch(await getAddCart(data, options));
  }

  getShopInfo() {
    const t = this;
    const getMshop = this.props.getMshop;
    const goodsData = t.props.goodsData;
    let appLocation = this.state.location;
    let locationShop = { longitude: 0, latitude: 0, shopId: t.props.goodsData.shopId };
    if (appLocation.longitude && appLocation.latitude) {
      locationShop.longitude = appLocation.longitude;
      locationShop.latitude = appLocation.latitude;
    }
    // alert('applocation')
    // alert(appLocation)
    // M店接口调用
    if (t.props.goodsData.shopType == 2) {
      this.fetchMshop(locationShop);
    }
    // 旗舰店接口调用
    else if (t.props.goodsData.shopType == 1 && t.props.goodsData.businessType == 4) {
      this.fetchFlagShop(locationShop);
    }
  }

  // 联系导购
  linkGuide = () => {
    const { salesAssistant } = this.props.goodsData;
    console.log('13213213213213', this.props.goodsData);
    const t = this;
    const { f } = this.props;
    f({
      id: 2879,
      p_action_id: `skuid=${UrlParse('id')}`
    });
    // t.point.f('110.101.49.58.68.78.216', 'retail', 'page.product.detail', '商品详情页_导购', 'page.product.detail.guide')
    GetUserInfo().then((result) => {
      if (salesAssistant) {
        let price = (t.props.goodsData.salePrice + '').indexOf('.') > -1 ? (t.props.goodsData.salePrice + '').split('.')[1].length == 2 ? t.props.goodsData.salePrice : t.props.goodsData.salePrice + '0' : t.props.goodsData.salePrice + '.00';
        // 跳转导购员聊天室
        Hybrid('im', 'call_native', {
          tag: '7',
          type: 2,
          targetOpenId: salesAssistant.openId,
          Merchandise: {
            imageUrl: t.props.goodsData.picUrl,
            merchandiseName: t.props.goodsData.pdtName,
            merchandisePrice: price,
            merchandiseID: t.props.goodsData.pdtSku,
            shopId: t.props.goodsData.shopId,
          }
        }).then((res) => {
          if (res.success == 'true') {

          }
        }).catch(e => {
          console.log(e);
        });
      } else {
        //todo 提示没有导购员
        Toast.info('未查询到导购员相关信息或者您尚未登录', 2);
      }

    }).catch(e => {
      console.log(e);
      t.hybridOpenPageLogin.open(() => {
        window.location.href = location.href
      }).then((result) => {
        console.log(result)
      }).catch((error) => {
      });
    })


  };

  //todo 跳转店铺
  skipStore() {
    const { f } = this.props;
    f({
      id: 2880,
      p_action_id: `skuid=${UrlParse('id')}`
    });
    //this.point.f('110.101.49.58.68.78.214', 'retail', 'page.product.detail', '商品详情页_底部店铺入口', 'page.product.detail.store2', this.props.goodsData.shopId)
    console.log('跳转店铺');
    window.location = `${window.__config_env ? window.__config_env.hostname : 'http://mkl.uat1.rs.com'}/shop/#/shopHome?id=${this.props.goodsData.shopId}&back=h5&status=black&__open=1`
  }

  //todo 预定
  reserve() {
    const t = this;
    if (!t.state.goodsList) {
      return false;
    }

    GetUserInfo().then((result) => {
      document.querySelector('#shopGoods').setAttribute('class', 'popupActive');
      Popup.show(<ShopCarPopup
        callback={t.props.shopCarCount}
        f={this.props.f}
        goodsList={t.state.goodsList}
        colorList={t.state.goodsList}
        standardList={t.state.goodsList}
        onClose={() => {
          document.querySelector('#shopGoods').setAttribute('class', '')
          Popup.hide()
        }}
        payment={true}
      />, {
          animationType: 'slide-up',
        }
      );
    }).catch(e => {
      t.hybridOpenPageLogin.open((data) => {
        window.location.href = location.href
      }).then((result) => {
        console.log(result)
      }).catch((error) => {
      });
    });
  }

  // 到店体验
  popBefore(topSize) {
    document.querySelector('#shopGoods').scrollTop
    document.querySelector('#shopGoods').style.top = '-' + topSize + 'px';
    document.querySelector('#shopGoods').setAttribute('class', 'popupActive');
  }
  popAfter(topSize) {
    console.log(topSize, 'topSize');
    document.querySelector('#shopGoods').setAttribute('class', '');
    window.scroll(0, topSize);
  }
  arriveExperience = () => {
    const { f } = this.props;
    f({
      id: 2882,
      p_action_id: `skuid=${UrlParse('id')}`
    });
    //this.point.f('110.101.49.58.68.78.212', 'retail', 'page.product.detail', '商品详情页_到店体验', 'page.product.detail.experience');
    console.log('进入到店体验方法');
    // 如果为M店,弹出弹窗
    // alert(JSON.stringify(this.state.shopInfo))
    console.log('this.state.shopInfo', this.props.shopInfo);
    console.log('this.props.goodsData.shopType', this.props.goodsData.shopType);
    const { shopInfo, flagship } = this.props;
    console.log('11111111111111', this.props);
    if (this.props.goodsData.shopType == 2 && !!shopInfo) {
      const topSize = document.documentElement.scrollTop || document.body.scrollTop;
      this.popBefore(topSize);
      Popup.show(
        <Shopexperience
          shopInfo={shopInfo}
          topSize={topSize}
          onClose={() => {
            Popup.hide();
            this.popAfter(topSize)
          }}
        />
        , {
          animationType: 'slide-up',
        })
    }
    // 如果为只有官旗舰店
    else if (this.props.goodsData.shopType == 1 && this.props.goodsData.businessType == 4) {
      // 判断是否有值
      if (flagship instanceof Array) {
        // 如果只有一个官方旗舰店则跳转店铺详情否则跳转店铺列表页
        if (flagship.length == 1) {
          //跳转店铺详情页面  否则跳转native店铺列表页面
          location = `${window.__config_env ? window.__config_env.hostname : 'http://mkl.uat1.rs.com'}/shop/index.html#/shopHome?id=${flagship[0].shopId}&back=h5`;
        } else {
          let data = {
            'tag': '55',
            'flagshipId': this.props.goodsData.shopId,
            'Merchandise': {
              'merchandisePrice': this.props.goodsData.salePrice,
              'imageUrl': this.props.goodsData.picUrl,
              'merchandiseName': this.props.goodsData.pdtName,
              'merchandiseID': this.props.goodsData.pdtSku,
            },
          };
          Hybrid('gotoMshopList', 'call_native', data).then((res) => {
            if (res.success == 'true') {

            }
          }).catch((e) => {
            console.log(e)
          });
        }
      } else {
        return false;
      }

    } else {
      Toast.offline('获取定位信息失败!', 2);
    }

  };

  // 加入购物车
  addShopCar(type) {
    const { f } = this.props;
    switch (type) {
      case 1:
        f({
          id: 2883,
          p_action_id: `skuid=${UrlParse('id')}`
        });
        break;
      case 2:
        f({
          id: 2884,
          p_action_id: `skuid=${UrlParse('id')}`
        });
        break;
      case 3:
        f({
          id: 2885,
          p_action_id: `skuid=${UrlParse('id')}`
        });
        break;
    }
    const { addressCity, goodsList } = this.props.goodsData;
    const userInfo = this.props.userInfo;
    const t = this;
    if (!t.state.goodsList) {
      return false;
    }
    console.log('1111111', userInfo)
    if (isLogin()) {
      const topSize = document.documentElement.scrollTop || document.body.scrollTop;
      this.popBefore(topSize);
      Popup.show(<ShopCarPopup
        callback={t.props.shopCarCount}
        addCart={t.fetchAddCart}
        goodsList={goodsList}
        appversion={t.state.appver}
        showUnit={t.props.goodsData.showChargeUnit}
        //addressCity={addressCity}
        cityCode={t.props.goodsData.shopInfoBrief.city_id}
        shopName={t.props.goodsData.shopName}
        payment={t.props.goodsData.promotion.bookingAmount}
        topSize={topSize}
        onClose={() => {
          Popup.hide();
          this.popAfter(topSize)
        }} />, {
          animationType: 'slide-up'
        });
    } else {
      t.hybridOpenPageLogin.open((data) => {
        Cookies.set('SESSION.user', data.data.sessionid);
        Cookies.set('sessionid', data.data.sessionid);
        Cookies.set('openid', data.data.openid);
        sessionStorage.userInfo = JSON.stringify(data.data);
        window.location.href = location.href;
      }).then((result) => {
        console.log(result)
      }).catch((error) => {
      });
    }
  }

  //打开地图
  onOpenMapView = () => {
    const { shopInfo } = this.props;
    Hybrid('mapView', 'call_native', {
      tag: '1',
      longitude: shopInfo.marketLon,
      latitude: shopInfo.marketLat,
      shopName: shopInfo.shopName,
    }).then((res) => {
      if (res.success == 'true') {

      }
    }).catch((e) => {
      console.log(e);
    });
  };

  rerender(time) {
    setTimeout(() => {
      location = location
    }, time)
  }

  //获取app版本号，并判断  新功能版本 安卓 3.2.11  ios 3.2.8
  getVersionAndJudge() {
    if (Env.rsApp) {
      getNativeInfo().then((data) => {
        if (data && data.version) {
          if ((Env.ios && !this.judgeVersion(data.version, '3.3.0')) || (Env.android && !this.judgeVersion(data.version, '3.3.0', 0))) {
            this.setState({
              version: false,
            });
          }
          if ((Env.ios && !this.judgeVersion(data.version, '3.4.0')) || (Env.android && !this.judgeVersion(data.version, '3.4.0', 0))) {
            this.setState({
              collectversion: false,
            });
          }
        }
      });
    }
  }

  judgeVersion(appVersion, comparedVersion) {  //返回true表示appVersion>=comparedVersion, 返回false appVersion<comparedVersion
    const appVersionArr = appVersion.split('.');
    const compareVersionArr = comparedVersion.split('.');

    for (let i = 0; i < 3; i++) {
      if (parseInt(appVersionArr[i]) < parseInt(compareVersionArr[i])) {
        return false;
      }
    }
    return true;
  }


  render() {
    const { goodsData } = this.props;
    console.log('goodsData---footer', this.props.goodsData);
    console.log('this.state.collectRequest', this.state.collectRequest)
    const t = this;
    console.log('12345', this.state.collectversion);
    const wishComp = this.state.collectversion
      ? <Collect
        f={this.props.f}
        id={this.state.collectRequest.id}
        collect={this.state.collectRequest}
        initCollectData={this.state.initCollectData} />
      : <CollectOld
        f={this.props.f}
        id={this.state.collectRequest.id}
        collect={this.state.collectRequest}
        initCollectData={this.state.initCollectData} />
    const CollectComp = this.state.version ? <div>
      <div className='wish-hint'><div className='wish-text' >喜欢就加入心愿单吧~</div></div>
      {wishComp}
    </div> :
      <CollectAncient
        id={this.state.collectRequest.id}
        collect={this.state.collectRequest}
        initCollectData={this.state.initCollectData} />
    return (
      <a href="javascript:;" id={Env.rsApp ? 'goods-footer' : 'link-app'}>
        {/*左边按钮*/}
        {Env.rsApp && <div className="footerLeft">
          <Flex justify="center" align="center">
            {/*导购员*/}
            <FlexItem onClick={t.linkGuide.bind(t)}>
              <img src={require('./img/guide@2x.png')} />
            </FlexItem>
            {/*店铺*/}
            <FlexItem onClick={t.skipStore.bind(t)}>
              <img src={require('./img/store@2x.png')} />
            </FlexItem>
            {/*收藏&&心愿单*/}
            <FlexItem>
              {
                this.state.collectRequest &&
                this.state.initCollectData &&
                CollectComp
              }
            </FlexItem>
          </Flex>
        </div>}

        <div className="flexTab">
          {/*到店体验按钮*/}
          {Env.rsApp && !!t.state.experience &&
            (
              (t.props.goodsData.shopType == 1 &&
                t.props.goodsData.businessType == 4 &&
                t.state.flagship &&
                t.state.flagship.length != 0) || t.props.goodsData.shopType == 2) &&
            <span className="arriveExperience goodsBtn" onClick={function (e) {
              e.preventDefault();
              t.arriveExperience();
            }}>
              到店体验
          </span>}


          {/*立即购买*/}
          {Env.rsApp &&
            goodsData.footerStatus.isBuyNow &&
            <span className="addShopCar goodsBtn" onClick={function (e) {
              e.preventDefault();
              t.addShopCar(2);
            }}>
              立即购买
          </span>
          }

          {/*未开始 爆款*/}
          {Env.rsApp &&
            goodsData.footerStatus.nostart &&
            <span className="addShopCar nostart" onClick={function (e) {
              e.preventDefault();
              // t.addShopCar();
            }}>
              未开始
          </span>
          }

          {/*已售罄 爆款*/}
          {Env.rsApp &&
            goodsData.footerStatus.noStock &&
            <span className="addShopCar nostart" onClick={function (e) {
              e.preventDefault();
              // t.addShopCar();
            }}>
              已售罄
          </span>
          }

          {/*支付定金 付费预定*/}
          {Env.rsApp &&
            goodsData.footerStatus.canBook &&
            <span className="addShopCar goodsBtn" onClick={function (e) {
              e.preventDefault();
              t.addShopCar(3);
            }}>
              支付定金
          </span>
          }

          {/*已售完 付费预定*/}
          {Env.rsApp &&
            goodsData.footerStatus.noBook &&
            <span className="addShopCar nostart" onClick={function (e) {
              e.preventDefault();
              // t.addShopCar();
            }}>
              已售完
          </span>
          }

          {/*已结束 拼团*/}
          {Env.rsApp &&
            goodsData.footerStatus.groupEnd &&
            <span className="addShopCar nostart" onClick={function (e) {
              e.preventDefault();
              // t.addShopCar();
            }}>
              已结束
          </span>
          }

          {/*已抢完 拼团*/}
          {Env.rsApp &&
            goodsData.footerStatus.groupNoStock &&
            <span className="addShopCar nostart" onClick={function (e) {
              e.preventDefault();
              // t.addShopCar();
            }}>
              已抢完
          </span>
          }

          {/*支付定金 拼团*/}
          {Env.rsApp &&
            goodsData.footerStatus.groupBook &&
            <span className="addShopCar goodsBtn" onClick={function (e) {
              e.preventDefault();
              t.addShopCar(3);
            }}>
              支付定金
          </span>
          }

          {/*购物车按钮*/}
          {Env.rsApp &&
            goodsData.footerStatus.addCart &&
            <span className="addShopCar goodsBtn" onClick={function (e) {
              e.preventDefault();
              t.addShopCar(1);
            }}>
              加入购物车
          </span>
          }

        </div>
        {!Env.rsApp && <span>
          使用APP购买此商品
        </span>}
      </a>
    );
  }
}

const select = (store) => {
  console.log('select store', store);
  return {
    shopGoods: store.shopGoods.shopGoodsData || {},
    shopInfo: store.shopGoods.mShopData || {},
    flagship: store.shopGoods.flagShopData || {},
    addCart: store.shopGoods.addCartData || {}
  };
};

export default connect(select)(Footer);
