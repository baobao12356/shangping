import React, { Component } from 'react';
import classnames from 'classnames';
import Pop from '../../modules/shopGoods/pop' // 文案弹层
import BannerShowTime from '../bannerShowTime';
import BigData from '../../common/js/bigData';
import './style.scss';
import { Popup } from 'antd-mobile';
import PopServiceRule from './popServiceRule';
import PopPromotionRule from './popPromotionRule';
import PopCouponRule from './popCouponRule';
import CountTime from '../countTime';
import UrlParse from '../../common/js/urlParse';
/*
 * isShowPadding:是否上下左右留白(废弃)
 * isShowLimitPrice:是否显示限时购原价,即组件del标签内的内容 1-->爆款 0-->普通  -1-->null(废弃)
 * 商品product对象
 * */
export default class ProductShortInfo extends Component {
  constructor(props) {
    super(props);
    console.log(this, 'ProductShortInfo');
    this.state = {
      pdtSku: this.props.data.pdtSku,
      collectRequest: {
        sourceType: 14,
        channel: 'comm',
        title: this.props.data.pdtName,
        picture: this.props.data.picUrl,
        desc1: {},
      },
      initCollectData: (this.props.data.promotion.promotionType == 29 || this.props.data.promotion.promotionType == 31) && true,
      timeShow: null,
      chargeUnit: '',// (this.props.data.chargeUnitName+'')||'件'
      showpop: false,
      data: this.props.data,
      goodsPromotion: this.props.goodsPromotion,
      goodsCoupon: this.props.goodsCoupon,
      acPreview: this.props.acPreview,
    };
    this.parseService = this.parseService.bind(this);
    this.parseCouponName = this.parseCouponName.bind(this);
    this.isPreviewData = this.isPreviewData.bind(this);
    this.handlePreviewData = this.handlePreviewData.bind(this);
    this.point = new BigData();
  }

  componentDidMount() {

    this.setState({
      initCollectData: true,
      // chargeUnit: (this.props.data.chargeUnitName+'')||'件'
    });

    // 本组件重写 toLocaleString()方法
    Date.prototype.toLocaleString = function () {
      const month = this.getMonth() + 1
      const day = this.getDate()
      let hours = this.getHours() + ''
      if (hours.length < 2) {
        hours = '0' + hours
      }
      let minutes = this.getMinutes() + ''
      if (minutes.length < 2) {
        minutes = '0' + minutes
      }
      this.getHours()
      return month + "月" + day + "日" + hours + ":" + minutes
    };
    // 爆款31
    if (this.props.data && this.props.data.promotion.promotionType == 30) {
      this.state.timeShow = '付尾款：' + new Date(this.props.data.promotion.startTime).toLocaleString() + ' 至 ' + new Date(this.props.data.promotion.endTime).toLocaleString() + ''
    } else if (this.props.data && this.props.data.promotion.promotionType == 31) {
      this.state.timeShow = '(' + new Date(this.props.data.promotion.startTime).toLocaleString() + ' 至 ' + new Date(this.props.data.promotion.endTime).toLocaleString() + ')'
    } else if (this.props.data && this.props.data.promotion.promotionType == 28) {
      this.state.timeShow = '付尾款：' + new Date(this.props.data.promotion.startTime).toLocaleString() + ' 至 ' + new Date(this.props.data.promotion.endTime).toLocaleString() + ''
    }

  }
  // popBefore(topSize) {
  //   document.querySelector('#shopGoods').scrollTop
  //   document.querySelector('#shopGoods').style.top = '-' + topSize + 'px'
  //   document.querySelector('#shopGoods').setAttribute('class', 'popupActive');
  // }
  changeShowPop() {
    this.setState({
      showpop: !this.state.showpop,
      topSize: document.documentElement.scrollTop || document.body.scrollTop
    }, () => {
      if (this.state.showpop) {
        this.popBefore(this.state.topSize)
      }
    })
  }
  popBefore(topSize) {
    document.querySelector('#shopGoods').scrollTop
    document.querySelector('#shopGoods').style.top = '-' + topSize + 'px';
    document.querySelector('#shopGoods').setAttribute('class', 'popupActive');
  }
  popAfter(topSize) {
    console.log(topSize, 'topSize')
    document.querySelector('#shopGoods').setAttribute('class', '')
    window.scroll(0, topSize)
  }
  popCouponRule(data) {
    const { f } = this.props;
    f({
      id: 2872,
      p_action_id: `skuid=${UrlParse('id')}`
    });
    //this.point.f('110.101.49.58.68.78.171', 'retail', 'page.product.detail', '商品详情页_领券', 'page.product.detail.tickets');
    const topSize = document.documentElement.scrollTop || document.body.scrollTop;
    this.popBefore(topSize);
    Popup.show(<PopCouponRule
      couponData={data}
      topSize={topSize}
      onClose={() => {
        Popup.hide();
        this.popAfter(topSize);
      }} />, {
        animationType: 'slide-up'
      })
  }
  popPromotionRule(data) {
    const { f } = this.props;
    f({
      id: 2871,
      p_action_id: `skuid=${UrlParse('id')}`
    });
    //this.point.f('110.101.49.58.68.78.170', 'retail', 'page.product.detail', '商品详情页_促销', 'page.product.detail.promotion');
    const topSize = document.documentElement.scrollTop || document.body.scrollTop;
    this.popBefore(topSize);
    Popup.show(<PopPromotionRule
      promotionData={data}
      topSize={topSize}
      onClose={() => {
        Popup.hide();
        this.popAfter(topSize);
      }} />, {
        animationType: 'slide-up'
      })
  }
  popServiceRule(data) {
    const { f } = this.props;
    f({
      id: 2876,
      p_action_id: `skuid=${UrlParse('id')}`
    });
    //this.point.f('110.101.49.58.68.78.172', 'retail', 'page.product.detail', '商品详情页_服务保障', 'page.product.detail.service');
    const topSize = document.documentElement.scrollTop || document.body.scrollTop;
    this.popBefore(topSize);
    Popup.show(<PopServiceRule
      serviceData={data}
      topSize={topSize}
      onClose={() => {
        Popup.hide()
        this.popAfter(topSize)
      }} />, {
        animationType: 'slide-up'
      })
  }
  //处理服务保障模块数据
  parseService(data) {
    let str = '';
    data.map((item, index) => {
      if (index < data.length - 1) {
        str += item.tagName + ' · ';
      } else {
        str += item.tagName;
      }
    })

    return str;
  }
  //处理优惠券展示数据
  parseCouponName(data) {
    let str = '';
    data.map((item, index) => {
      if (index > 2) {
        return;
      } else {
        str += item.couponShortName + ',';
      }
    });
    return str.substr(0, str.length - 1);
  }

  //判断是否有活动预告数据
  isPreviewData(promotionType) {
    //promotionType: 1 爆款 2 付费预定 3 拼团购
    const { data } = this.props;
    if (promotionType == 1) {
      if (data.promotion.remainingStock < 0 || data.promotion.nowDate > data.promotion.endTime) {
        return true;
      }
    } else if (promotionType == 2 || promotionType == 3) {
      if (data.promotion.remainingStock < 0 || data.promotion.nowDate > data.promotion.bookingEndTime) {
        return true;
      }
    }

    return false;
  }

  //处理活动预告数据
  handlePreviewData(nowType, data, nowDate, promotion) {
    // 31爆款 28拼团 30付费预定
    const bookingFavorType = promotion ? promotion.bookingFavorType : '';
    const bookingAmount = promotion ? promotion.bookingAmount : '';
    const bookingFavorValue = promotion ? promotion.bookingFavorValue : '';
    const deductibleAmount = promotion ? promotion.deductibleAmount : '';
    const amount = deductibleAmount;
    console.log('promotion111111111', promotion);
    const appiontPrice = (data.skuPromotionPrice * 1000000 + bookingAmount * 1000000) / 1000000;
    console.log('appiontPrice', data.skuPromotionPrice);
    console.log('appiontPrice', bookingAmount);
    if (nowType == 0 && promotion.promotionType == 31 && Math.floor((parseFloat(data.startTime) - parseFloat(nowDate)) / (1000 * 3600 * 24)) <= 15) {
      return (
        <div className="preview_module">
          {bookingFavorType == 3 ? <span className="icon_preview">活动预告</span> : <span className="icon_preview">{data.promotionType == 31 ? '活动预告' : (data.promotionType == 28 ? '拼团预告' : '活动预告')}</span>}
          <span className="preview_desc">{(data.promotionType == 31 ? new Date(data.startTime).toLocaleString() + ` 爆款限时价 ¥${data.skuPromotionPrice}` :
            new Date(data.bookingStartTime).toLocaleString() + (data.promotionType == 28 ? ` ${data.numberConditions ? data.numberConditions : 0}人拼团价 ¥${(data.bookingAmount * 1000000 + data.skuPromotionPrice * 1000000) / 1000000}` : ` 预约售价¥${appiontPrice}`))}</span>
          {bookingFavorType == 3 && <span className="preview_desc">{` 定金¥${bookingAmount}可抵扣¥${amount}`}</span>}
        </div>
      )
    } else if (nowType == 0 && promotion.promotionType != 31 && Math.floor((parseFloat(data.bookingStartTime) - parseFloat(nowDate)) / (1000 * 3600 * 24)) <= 15) {
      return (
        <div className="preview_module">
          {bookingFavorType == 3 ? <span className="icon_preview">活动预告</span> : <span className="icon_preview">{data.promotionType == 31 ? '活动预告' : (data.promotionType == 28 ? '拼团预告' : '活动预告')}</span>}
          <span className="preview_desc">{(data.promotionType == 31 ? new Date(data.startTime).toLocaleString() + ` 爆款限时价 ¥${data.skuPromotionPrice}` :
            new Date(data.bookingStartTime).toLocaleString() + (data.promotionType == 28 ? ` ${data.numberConditions ? data.numberConditions : 0}人拼团价 ¥${(data.bookingAmount * 1000000 + data.skuPromotionPrice * 1000000) / 1000000}` : ` 预约售价¥${appiontPrice}`))}</span>
          {bookingFavorType == 3 && <span className="preview_desc">{` 定金¥${bookingAmount}可抵扣¥${amount}`}</span>}
        </div>
      )
    } else if (nowType != 0) {
      const dj = bookingFavorType == 3 ? ` 预约售价¥${appiontPrice}` : ` 定金¥${bookingAmount} 预约售价¥${appiontPrice}`
      return (
        <div className="preview_module">
          {bookingFavorType == 3 ? <span className="icon_preview">活动预告</span> : <span className="icon_preview">{data.promotionType == 31 ? '活动预告' : (data.promotionType == 28 ? '拼团预告' : '活动预告')}</span>}
          <span className="preview_desc ding">
            {
              (data.promotionType == 31 ? new Date(data.startTime).toLocaleString() + ` 爆款限时价 ¥${data.skuPromotionPrice}` :
                new Date(data.bookingStartTime).toLocaleString() + (data.promotionType == 28 ? ` ${data.numberConditions ? data.numberConditions : 0}人拼团价 ¥${(data.bookingAmount * 1000000 + data.skuPromotionPrice * 1000000) / 1000000}` : dj))
            }
          </span>
          {bookingFavorType == 3 && <span className="preview_desc">{` 定金¥${bookingAmount}可抵扣¥${amount}`}</span>}
        </div>
      )
    }

    return '';
  }

  render() {
    // let {data} = this.state
    let { isShowPadding, isShowLimitPrice, data, goodsPromotion, goodsCoupon, acPreview } = this.props,
      productShortCss = classnames({
        'productShortInfo': true,
        'setPaddingCon': isShowPadding,
      }),
      salePrice = data && (data.onlinePrice == 0 || !!data.onlinePrice ? data.onlinePrice + '' : data.salePrice);
    console.log('1111111111ffffffffff', this.props)
    const { promotion } = data;
    let chargeUnit = this.state.chargeUnit
    // 预付费 尾款(skuPromotionPrice) Retainage(尾款+定金)
    let Retainage
    if (data && data.promotion.promotionType == 30 || data.promotion.promotionType == 28) {
      Retainage = (data.promotion.skuPromotionPrice * 1000000 + data.promotion.bookingAmount * 1000000) / 1000000//(data.salePrice*100 - data.promotion.deductibleAmount*100)/100
    }
    // let groupStatus
    // if(data && data.promotion.promotionType == 28){
    //   if(data.promotion.promotionType > data.promotion.offeredNumber ){
    //     //
    //   }
    // }
    console.log(this.state.showpop);
    console.log('isshowlimitprice', isShowLimitPrice);
    //isShowLimitPrice  1 爆款31   0 普通商品   -1 不显示    2 付费预定   3 拼团购
    return (
      <div>
        <div className={productShortCss}>
          <div className="title">
            <div className="desc">
              {data && data.pdtName}
            </div>
            {/*<div className="star">*/}
            {/*<Collect id={this.state.pdtSku}*/}
            {/*collect={this.state.collectRequest}*/}
            {/*initCollectData={this.state.initCollectData}/>*/}
            {/*</div>*/}
          </div>
          <p className={isShowLimitPrice == -1 ? 'desc desc_bottom' : 'desc'}>{data && data.productSecondName}</p>
          {
            isShowLimitPrice == 1 &&
            (
              <div>
                <div className="price_modules">
                  <div className="price_modules_now">
                    <span
                      className="price_modules_now_price">¥ {data && (data.promotion.skuPromotionPrice + '').indexOf('.') != -1 ? data.promotion.skuPromotionPrice : data.promotion.skuPromotionPrice + ''}
                    </span>
                    {/*<span className="price_modules_now_icon">限时价</span>*/}
                    {data.promotion.redstarSpecial == 1 ?
                      <span className="price_modules_now_icon1">红星专供</span>
                      :
                      <span className="price_modules_now_icon1">限时价</span>
                    }
                    {data.promotion.userLimitAmount == '999999999' &&
                      <span className="price_modules_stock">{data.promotion.itemPromotion && data.promotion.remainingStock > 0
                        ? `活动库存:${data.promotion.remainingStock}${chargeUnit}`
                        : `库存:${data.inventory} ${chargeUnit} `}</span>
                    }
                    {data.promotion.userLimitAmount != '999999999' &&
                      <span className="price_modules_stock">{data.promotion.itemPromotion && data.promotion.remainingStock > 0
                        ? `活动库存:${data.promotion.remainingStock}${chargeUnit}   限购:${data.promotion.userLimitAmount}${chargeUnit}`
                        : `库存:${data.inventory} ${chargeUnit} `}</span>
                    }
                  </div>
                  <div className="price_modules_market">
                    <span
                      className="price_modules_market_price">¥ <del>{data && (data.salePrice + '').indexOf('.') != -1 ? data.salePrice : data.salePrice + ''}</del></span>

                  </div>
                  {acPreview && acPreview[0] && this.isPreviewData(isShowLimitPrice) && this.handlePreviewData(isShowLimitPrice, acPreview[0], '', promotion)}
                  <div className="price_modules_city">
                    配送：仅支持{data.shopInfoBrief.city_name}同城配送
                  </div>
                  <div className="price_modules_wrap">
                    {data.goodsServiceTags && data.goodsServiceTags.length > 0 &&
                      <BannerShowTime>
                        <div className="price_modules_rules" onClick={this.popServiceRule.bind(this, data.goodsServiceTags)}>
                          {/*<span className="price_modules_rules_detail">拼团流程</span>*/}
                          <span className="rule_wrap">{this.parseService(data.goodsServiceTags)}</span>
                          <span className="price_modules_rules_icon" ></span>
                        </div>
                      </BannerShowTime>
                    }
                  </div>
                </div>
              </div>
            )
          }
          {/*普通商品*/
            isShowLimitPrice == 0 && (
              <div>
                <div className="price_modules">
                  <div className="price_modules_now">
                    <span
                      className="price_modules_now_price">¥ {data && (salePrice + '').indexOf('.') != -1 ? salePrice : salePrice + ''}</span>
                    {/*<span className="price_modules_now_icon1">促销价</span>*/}
                    {data.promotion.userLimitAmount == '999999999' &&
                      <span className="price_modules_stock">{data.promotion.itemPromotion && data.promotion.remainingStock > 0 && data.showOnly == 3
                        ? `活动库存：${data.promotion.remainingStock} ${chargeUnit}`
                        : `库存：${data.inventory} ${chargeUnit} `}</span>
                    }
                    {data.promotion.userLimitAmount != '999999999' &&
                      <span className="price_modules_stock">{data.promotion.itemPromotion && data.promotion.remainingStock > 0 && data.showOnly == 3
                        ? `活动库存：${data.promotion.remainingStock} ${chargeUnit}   限购：${data.promotion.userLimitAmount} ${chargeUnit}`
                        : `库存：${data.inventory} ${chargeUnit} `}</span>
                    }
                  </div>
                  <div className="price_modules_market">
                    <span className="price_modules_market_price"><del>¥ {data.onlinePrice == 0 || !!data.onlinePrice
                      ? `${data && (data.salePrice + '').indexOf('.') != -1 ? data.salePrice : data.salePrice + ''}`
                      : ``}</del></span>
                  </div>
                  {acPreview && acPreview[0] && this.handlePreviewData(isShowLimitPrice, acPreview[0], data.promotion.nowDate, promotion)}
                  <div className="price_modules_city">
                    配送：仅支持{data.shopInfoBrief.city_name}同城配送
                  </div>
                  <div className="price_modules_wrap">
                    {/*促*/
                      goodsPromotion && goodsPromotion.length > 0 &&
                      <BannerShowTime>
                        <div className="price_modules_rules price_modules_rules_ac" onClick={this.popPromotionRule.bind(this, goodsPromotion)}>
                          <span className="rule_wrap">
                            <span className="rule_icon rule_icon_promotion">促</span>
                            <span className="rule_txt">{goodsPromotion[0].displayName}</span>
                          </span>
                          <span className="price_modules_rules_icon" ></span>
                        </div>
                      </BannerShowTime>
                    }
                    {/*券*/
                      goodsCoupon && goodsCoupon.length > 0 &&
                      <BannerShowTime>
                        <div className="price_modules_rules price_modules_rules_ac" onClick={this.popCouponRule.bind(this, goodsCoupon)}>
                          <span className="rule_wrap">
                            <span className="rule_icon rule_icon_coupon">券</span>
                            <span className="rule_txt">{this.parseCouponName(goodsCoupon)}</span>
                          </span>
                          <span className="price_modules_rules_icon" ></span>
                        </div>
                      </BannerShowTime>
                    }
                    {data.goodsServiceTags && data.goodsServiceTags.length > 0 &&
                      <BannerShowTime>
                        <div className="price_modules_rules" onClick={this.popServiceRule.bind(this, data.goodsServiceTags)}>
                          {/*<span className="price_modules_rules_detail">拼团流程</span>*/}
                          <span className="rule_wrap">{this.parseService(data.goodsServiceTags)}</span>
                          <span className="price_modules_rules_icon" ></span>
                        </div>
                      </BannerShowTime>
                    }
                  </div>
                </div>
              </div>
            )
          }
          {
            isShowLimitPrice == 2 &&
            (
              <div>
                <div className="price_modules">
                  <div className="price_modules_now">
                    {/*<span className="price_modules_now_title">尾款</span>*/}
                    {data.promotion.bookingFavorType == 3
                      ? <span
                        className="price_modules_now_price">

                        <span className="price_ding">定金</span>¥ {data.promotion.bookingAmount}
                      </span>
                      : <span
                        className="price_modules_now_price">¥ {data && (Retainage + '').indexOf('.') != -1 ? Retainage : Retainage + ''}</span>
                    }
                    {data.promotion.bookingFavorType == 3
                      ? <span className="price_modules_now_icon1">{data.promotion.bookingAmount}元可抵{(data.promotion.bookingFavorValue * data.promotion.bookingAmount).toFixed(2)}元</span>
                      : <span className="price_modules_now_icon1">限时价</span>
                    }
                    {data.promotion.userLimitAmount == '999999999' &&
                      <span className="price_modules_stock">{data.promotion.itemPromotion && data.promotion.remainingStock > 0
                        ? `活动库存：${data.promotion.remainingStock} ${chargeUnit}`
                        : `库存：${data.inventory} ${chargeUnit} `}</span>
                    }
                    {data.promotion.userLimitAmount != '999999999' &&
                      <span className="price_modules_stock">{data.promotion.itemPromotion && data.promotion.remainingStock > 0
                        ? `活动库存：${data.promotion.remainingStock} ${chargeUnit}   限购：${data.promotion.userLimitAmount} ${chargeUnit}`
                        : `库存：${data.inventory} ${chargeUnit} `}</span>
                    }

                  </div>

                  {data.promotion.bookingFavorType == 3
                    ? <div className="price_modules_market price_teding">
                      <span className="text">尾款</span>
                      <span className="weikuan">¥ {data && data.promotion.skuPromotionPrice}</span>
                      {/*<span className="price_modules_market_title">标价</span>*/}
                      <span className="text">售价</span>
                      <span className="price_modules_market_price">{data.onlinePrice}</span>
                      {/*<span className="price_modules_now_time">*/}

                      {/*</span>*/}
                    </div>
                    : <div className="price_modules_market">
                      <span className="price_modules_market_price"><del>{(data.onlinePrice == 0 || !!data.onlinePrice)
                        ? (`¥ ${data && (data.salePrice + '').indexOf('.') != -1 ? data.salePrice : data.salePrice + ''}`)
                        : ``}</del></span>
                    </div>
                  }

                  <div className="price_modules_actime">
                    {this.state.timeShow}
                  </div>
                  {acPreview && acPreview[0] && this.isPreviewData(isShowLimitPrice) && this.handlePreviewData(isShowLimitPrice, acPreview[0], '', promotion)}
                  <div className="price_modules_city">
                    配送：仅支持{data.shopInfoBrief.city_name}同城配送
                  </div>
                  <div className="price_modules_wrap">
                    {data.goodsServiceTags && data.goodsServiceTags.length > 0 &&
                      <BannerShowTime>
                        <div className="price_modules_rules" onClick={this.popServiceRule.bind(this, data.goodsServiceTags)}>
                          {/*<span className="price_modules_rules_detail">拼团流程</span>*/}
                          <span className="rule_wrap">{this.parseService(data.goodsServiceTags)}</span>
                          <span className="price_modules_rules_icon" ></span>
                        </div>
                      </BannerShowTime>
                    }
                    <BannerShowTime>
                      <div className="price_modules_rules" onClick={this.changeShowPop.bind(this)}
                        style={data && data.promotion.promotionType == 30 &&
                          data.promotion.nowDate > data.promotion.bookingStartTime &&
                          data.promotion.nowDate < data.promotion.bookingEndTime &&
                          data.promotion.remainingStock > 0 ? { display: 'block' } : { display: 'none' }}>
                        <span className="price_modules_rules_detail">预定流程</span>
                        <span className="price_modules_rules_title" data-title="1">付定金</span>
                        <span className="price_modules_rules_line"></span>
                        <span className="price_modules_rules_title" data-title="2">付尾款</span>
                        <span className="price_modules_rules_line"></span>
                        <span className="price_modules_rules_title" data-title="3">发货</span>
                        <span className="price_modules_rules_icon" ></span>
                      </div>
                    </BannerShowTime>
                  </div>
                </div>
              </div>
            )
          }
          {
            isShowLimitPrice == 3 &&
            <div>
              <div className="price_modules">
                <div className="price_modules_now">
                  <span className="price_modules_now_title">拼团价</span>
                  <span
                    className="price_modules_now_price">¥ {data && (data.customPromotion.booktotalPrice + '').indexOf('.') != -1 ? data.customPromotion.booktotalPrice : data.customPromotion.booktotalPrice + ''}</span>
                  {/*<span className="price_modules_now_icon1">促销价</span>*/}
                  {/*拼团中一直显示活动库存*/}
                  {data.promotion.userLimitAmount == '999999999' &&
                    <span className="price_modules_stock">{data.promotion.itemPromotion && data.promotion.remainingStock > -1
                      ? `活动库存:${data.promotion.remainingStock} ${chargeUnit}`
                      : `库存：${data.inventory} ${chargeUnit} `}</span>
                  }
                  {data.promotion.userLimitAmount != '999999999' &&
                    <span className="price_modules_stock">{data.promotion.itemPromotion && data.promotion.remainingStock > -1
                      ? `活动库存:${data.promotion.remainingStock} ${chargeUnit}   限购:${data.promotion.userLimitAmount} ${chargeUnit}`
                      : `库存：${data.inventory} ${chargeUnit} `}</span>
                  }
                </div>
                <div className="price_modules_market">
                  <span className="price_modules_now_title1">原价</span>
                  <span className="price_modules_market_price"><del>¥ {data.onlinePrice == 0 || !!data.onlinePrice
                    ? `${data && (data.salePrice + '').indexOf('.') != -1 ? data.salePrice : data.salePrice + ''}`
                    : `${data && (data.salePrice + '').indexOf('.') != -1 ? data.salePrice : data.salePrice + ''}`}</del></span>
                </div>
                <div className="price_modules_group">
                  <div className="price_modules_group_status">
                    <div className="price_modules_group_status_pic">
                      <div style={{ width: data.customPromotion.groupDivPercentage + '%' }}></div>
                    </div>
                    <div className="price_modules_group_status_number">{data.promotion.numberConditions}人成团 已有{data.promotion.offeredNumber || 0}人参团</div>
                  </div>
                  <div className="price_modules_group_title" style={{ color: data.customPromotion.groupStatusColor && data.customPromotion.groupStatusColor }}>
                    {data.customPromotion.groupStatus}
                  </div>
                </div>
                <div className="price_modules_actime">
                  {this.state.timeShow}
                </div>
                {acPreview && acPreview[0] && this.isPreviewData(isShowLimitPrice) && this.handlePreviewData(isShowLimitPrice, acPreview[0], '', promotion)}
                <div className="price_modules_city">
                  配送：仅支持{data.shopInfoBrief.city_name}同城配送
                </div>
                <div className="price_modules_wrap">
                  {data.goodsServiceTags && data.goodsServiceTags.length > 0 &&
                    <BannerShowTime>
                      <div className="price_modules_rules" onClick={this.popServiceRule.bind(this, data.goodsServiceTags)}>
                        {/*<span className="price_modules_rules_detail">拼团流程</span>*/}
                        <span className="rule_wrap">{this.parseService(data.goodsServiceTags)}</span>
                        <span className="price_modules_rules_icon" ></span>
                      </div>
                    </BannerShowTime>
                  }
                  <BannerShowTime>
                    <div className="price_modules_rules" onClick={this.changeShowPop.bind(this)}>
                      <span className="price_modules_rules_detail">拼团流程</span>
                      <span className="price_modules_rules_title" data-title="1">付定金</span>
                      <span className="price_modules_rules_line"></span>
                      <span className="price_modules_rules_title" data-title="2">成团</span>
                      <span className="price_modules_rules_line"></span>
                      <span className="price_modules_rules_title" data-title="2">付尾款</span>
                      <span className="price_modules_rules_line"></span>
                      <span className="price_modules_rules_title" data-title="3">发货</span>
                      <span className="price_modules_rules_icon" ></span>
                    </div>
                  </BannerShowTime>
                </div>
              </div>
            </div>
          }
          {
            isShowLimitPrice == -1 && acPreview && acPreview[0] &&
            <div>
              <div className="price_modules">
                {this.handlePreviewData(isShowLimitPrice, acPreview[0], data.promotion.nowDate, promotion)}
              </div>
            </div>
          }
        </div>
        {/*<div className="price-border-bottom"></div>*/}
        {
          <Pop
            type={data.promotion.promotionType}
            showpop={this.state.showpop}
            changeShowPop={this.changeShowPop.bind(this)}
            topSize={this.state.topSize}
          />
        }
      </div>
    );
  }
}
