import 'babel-polyfill';
import { Toast } from 'antd-mobile';
import { connect } from 'react-redux';
import { ImgMark } from 'rs-react-components';
import QueryString from 'query-string';
import Env from 'rs-browser';
import { pointConnect } from 'rs-point';
import HybridBridge from 'rs-hybrid-bridge';
import onfire from 'onfire.js';
import Cookies from 'js-cookie';
import Header from '../../components/header';
import LoopBanner from '../../components/loopBanner';
import RecommandProduct from '../../components/recommandProduct';
import ProductShortInfo from '../../components/productShortInfo';
import ShopDetail from './shopDetail';//商品详情
import ShopParameter from './shopParameter';//商品参数
import LimitedTimeUrchase from './limited-time-urchase';//限时购倒计时
import Footer from './footer';//底部
import ShopModule from './ShopModule';
import { getShopGoods, getShopCartNum, getServerTime } from '../../actions';
import UrlParse from '../../common/js/urlParse';
import './style.scss';

const tabs = [
  { tabName: '商品', id: 1 },
  { tabName: '参数', id: 2 },
  { tabName: '详情', id: 3 },
  { tabName: '推荐', id: 4 }
];
class GoodsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.urlParam = QueryString.parse(location.href.split('?')[1]);
    this.hybridBridge = new HybridBridge(window);
    console.log('urlParam', this.urlParam);
    this.sessionid = Cookies.get('sessionid');
    this.openid = Cookies.get('openid');
    this.state = {
      // 限时购活动是否开始
      limitedStart: false,
      priceType: false,
      promotionData: {},
      data: {},
      goodsPromotion: [],
      goodsCoupon: [],
      acPreview: [],
      serverTime: '',  //从后台获取的系统时间
      // showpop: false,
      // groupshowpop: false,
    };

    onfire.on('changeCouponStatus', (res) => {
      const _this = this;
      const status = res.status;
      const index = res.index;
      const perPersonRemainingCount = res.perPersonRemainingCount;
      let temp = _this.state.goodsCoupon;
      temp[index].status = status;
      temp[index].perPersonRemainingCount = perPersonRemainingCount;
      console.log('状态改变');
      _this.setState({
        goodsCoupon: temp
      });
    });
  }

  async fetchData() {
    const id = this.urlParam.id;
    const userInfo = this.userInfo;
    const { dispatch } = this.props;
    dispatch(await getShopGoods(id, userInfo));
    Toast.hide();
    const { shopGoods } = this.props;
    const { pdtName, pdtSku } = shopGoods;
    //this.point.p('9d88493e-ecaa-4e8b-af3f-95ea86a7ae68', 'retail', 'page_product_detail', pdtName, pdtSku, 'mmall.com');
  }

  async getShopCartNum() {
    const userInfo = this.userInfo;
    const { dispatch } = this.props;
    dispatch(await getShopCartNum(userInfo));
    const { shopCartNum } = this.props;
    this.setState({ shopCarCount: shopCartNum.count });
  }

  async getServerTime() {
    const { dispatch } = this.props;
    dispatch(await getServerTime());
  }

  componentDidMount() {
    // this.props.p({
    //   id: '2354',
    //   p_id: `skuid=${UrlParse('id')}`
    // });
    // this.props.z({
    //   id: '2355 '
    // });
    Toast.loading('Loading...', 6);

    this.userInfo = {
      sessionid: this.sessionid,
      openid: this.openid
    };

    this.fetchData();
    this.getShopCartNum();
    this.getServerTime();
    this.hybridBridge.hybrid('call_native', {
      colorType: 'black', //'black' 'white'
      tag: '58'
    }).then((result) => {
      // ...
      console.log('执行58成功');
    }).catch((error) => {
      // ...
      console.log('执行58失败');
    });

    window.didAppear = () => {
      this.getServerTime();
      this.getShopCartNum();
      this.props.p({
        id: '2354',
        p_id: `skuid=${UrlParse('id')}`
      });
      this.props.z({
        id: '2355 '
      });
    };
  }

  topnav() {
    const top = document.querySelector('.com-app-download-tip');
    if (top) {
      if (top.style.display == 'none') {
        document.querySelector('#hmHeders header').style.top = 0;
        document.querySelector('#hmHeders .backArrowCon').style.top = 0;
        document.querySelector('#hmHeders .middleShopName').style.top = 0;
      } else {
      }
    }
  }

  render() {
    setTimeout(() => {
      if (!Env.rsApp && document.querySelector('#hmHeders header')) {
        window.addEventListener('scroll', () => {
          this.topnav()
        })
      }
    }, 0);
    const { shopGoods, shopCartNum, serverTime } = this.props;
    const subScript = shopGoods.goodsActivitySubscript
      ? { iconSign: shopGoods.goodsActivitySubscript.iconSign, icon: shopGoods.goodsActivitySubscript.icon }
      : {};
    let goodsData = shopGoods;
    //goodsData.promotion = promotion;
    let t = this;
    console.log('newData', this.props);
    // console.log('oldData', this.state.data.dataMap);
    // let t = this, goodsData = this.state.data.dataMap;
    return (
      <div id="shopGoods">
        {/*{!Env.rsApp && <AppDownloadTip/>}*/}
        {goodsData && goodsData.promotion && shopCartNum && <Header
          f={this.props.f}
          dataTabs={tabs}
          isShowBack={true}
          shopCarCount={this.state.shopCarCount ? this.state.shopCarCount : 0}
          data={goodsData}
          shopName={goodsData.shopInfoBrief ? goodsData.shopInfoBrief.shop_name : ''}>
          <div id="product">
            <div className="banner">
              <ImgMark
                markInfo={subScript}
              >
                <LoopBanner {...goodsData.config} f={this.props.f} />
              </ImgMark>
            </div>
            {/*首页轮播图*/}

            {/*promotionType 字段用于判断促销活动类型 29限时购 30付费预定 31爆品*/}
            {/*系统当前时间大于开始时间小于结束时间*/}




            {
              // 爆款倒计时
              goodsData.promotion &&
              goodsData.promotion.promotionType == 31 &&
              goodsData.promotion.redstarSpecial != 1 &&
              goodsData.customPromotion &&
              goodsData.customPromotion.limitedTimeType &&
              serverTime.Date &&
              <LimitedTimeUrchase
                startTime={serverTime.Date > goodsData.promotion.startTime ? serverTime.Date : serverTime.Date}
                endTime={serverTime.Date > goodsData.promotion.startTime ? goodsData.promotion.endTime : goodsData.promotion.startTime}
                actionStart={serverTime.Date > goodsData.promotion.startTime ? 1 : 0}
                price={goodsData.promotion.skuPromotionPrice}
                callBack={function (timeStart = false) {
                  t.setState({
                    limitedStart: timeStart ? true : false,
                  });
                }}
              // type={goodsData.promotion.nowDate > goodsData.promotion.startTime ? 0 : 1}
              />}




            {
              // 预订付费倒计时
              goodsData.promotion &&
              goodsData.promotion.promotionType == 30 &&
              goodsData.customPromotion &&
              goodsData.customPromotion.limitedTimeType &&
              serverTime.Date &&
              <LimitedTimeUrchase
                startTime={serverTime.Date}
                endTime={goodsData.promotion.bookingEndTime}
                actionStart={2}
                price={goodsData.promotion.bookingAmount}
                retainage={goodsData.promotion.skuPromotionPrice}
                bookingFavorType={goodsData.promotion.bookingFavorType}
                bookingFavorValue={goodsData.promotion.bookingFavorValue}
                callBack={function (timeStart = false) {
                  t.setState({
                    limitedStart: timeStart ? true : false,
                  });
                }}
              // type={goodsData.promotion.nowDate > goodsData.promotion.startTime ? 0 : 1}
              />}

            {
              // 拼团倒计时
              goodsData.promotion &&
              goodsData.promotion.promotionType == 28 &&
              goodsData.customPromotion &&
              goodsData.customPromotion.limitedTimeType &&
              serverTime.Date &&
              <LimitedTimeUrchase
                startTime={serverTime.Date}
                endTime={goodsData.promotion.bookingEndTime}
                actionStart={3}
                price={goodsData.promotion.bookingAmount}
                retainage={goodsData.promotion.skuPromotionPrice}
                remainingStock={goodsData.promotion.remainingStock}
                callBack={function (timeStart = false) {
                  t.setState({
                    limitedStart: timeStart ? true : false,
                  });
                }}
              // type={goodsData.promotion.nowDate > goodsData.promotion.startTime ? 0 : 1}
              />}




            {/*商品价格*/}
            {
              goodsData &&
              goodsData.promotion &&
              goodsData.customPromotion &&
              goodsData.goodsPromotion &&
              goodsData.goodsCoupon &&
              goodsData.acPreview &&
              <ProductShortInfo
                data={goodsData}
                goodsPromotion={goodsData.goodsPromotion}
                goodsCoupon={goodsData.goodsCoupon}
                acPreview={goodsData.acPreview}
                isShowPadding={true}
                isShowLimitPrice={goodsData.customPromotion.priceShowType}
                id={this.state.data.dataMap}
                f={this.props.f}
              // changepop={this.changeShowPop.bind(this)}
              />
            }

          </div>

          <div className="split"></div>

          {/*店铺信息*/}
          {goodsData &&
            goodsData.shopInfoBrief &&
            <ShopModule
              f={this.props.f}
              data={goodsData.shopInfoBrief}
              shopAddress={goodsData.shopAddress}
            />
          }

          <div className="split"></div>

          {/*商品参数*/}
          <ShopParameter data={goodsData} />

          <div className="split"></div>

          <div id="detail">
            {/*商品详情*/}
            <ShopDetail detailData={goodsData.productTextVo} />
          </div>

          <div id='element' style={{ marginBottom: '1.3333rem' }}>

            {/*推荐商品*/}
            <RecommandProduct recommand={goodsData.recommand} f={this.props.f} />

          </div>
        </Header>}

        {
          goodsData && goodsData.promotion && goodsData.footerStatus && goodsData.pdtSku &&
          <Footer f={this.props.f} goodsData={goodsData} shopCarCount={(count) => {
            t.setState({ shopCarCount: (this.state.shopCarCount ? parseInt(this.state.shopCarCount) : 0) + parseInt(count), })
          }} userInfo={this.userInfo} />
        }

      </div>
    );
  }
}

const select = (store) => {
  console.log('select store', store);
  return {
    shopGoods: store.shopGoods.shopGoodsData || {},
    shopInfo: store.shopGoods.mShopData || {},
    flagship: store.shopGoods.flagShopData || {},
    addCart: store.shopGoods.addCartData || {},
    shopCartNum: store.shopGoods.shopCartNumData || {},
    serverTime: store.shopGoods.serverTimeData || {},
  };
};

export default connect(select)(pointConnect({
  p: '2354',
  z: '2355 ',
  p_id: `skuid=${UrlParse('id')}`,
  p_action_id: `skuid=${UrlParse('id')}`
})(GoodsDetail));
