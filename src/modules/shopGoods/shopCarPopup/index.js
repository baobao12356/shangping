/**
 * Created by lenovo on 2017/7/4.
 */
import React, { Component } from 'react';
import { Button, Toast } from 'antd-mobile';
import Env from 'rs-browser';
import './style.scss';
import QueryString from 'query-string';
import Http from './../../../common/js/http';
import getUserInfo from './../../../common/js/getUserInfo';
import getNativeInfo from './../../../common/js/getNativeInfo';
import Hybrid from '../../../common/js/hybrid';
import img from './../../../imgs/favicon.png';
import { getAddCart } from '../../../actions';
import Cookies from 'js-cookie';
import JudgeVersion from '../../../common/js/judgeVersion';
class ShopCarPopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shopCarCount: 1, /*待加入到购物车数量*/
      // goodsList : [], /*商品的颜色总分类*/
      // standardsList : [], /*商品种类*/
      // selGoods : [], /* 当前选中商品 */
      finalPayDate: null,
    };
    this.urlParam = QueryString.parse(location.href.split('?')[1]);
    this.sessionid = Cookies.get('sessionid');
    this.openid = Cookies.get('openid');
  }

  componentDidMount() {
    // 本组件重写 toLocaleString()方法
    Date.prototype.toLocaleString = function () {
      const month = this.getMonth() + 1;
      const day = this.getDate();
      let hours = this.getHours() + '';
      const year = this.getFullYear();
      if (hours.length < 2) {
        hours = '0' + hours
      }
      let minutes = this.getMinutes() + '';
      if (minutes.length < 2) {
        minutes = '0' + minutes
      }
      this.getHours();
      return year + '.' + month + '.' + day //+ hours + ":" + minutes
    };

    const t = this;

    document.querySelector('.am-popup-mask').addEventListener('click', () => {
      document.querySelector('#shopGoods').setAttribute('class', '');
      window.scroll(0, this.props.topSize)
    });

    if (t.props.goodsList) {
      let goodsList = t.props.goodsList, standardsList = [], selGoods = [];
      console.log('goodsList---------------', goodsList);
      // 遍历所有的商品颜色
      goodsList.forEach((colorItem, colorIndex) => {
        if (standardsList.length) {
          return false
        }
        // 遍历商品种类
        colorItem.standardsList.forEach((kindItem, kindIndex) => {
          // 如果是限时购商品默认选中
          /*if (kindItem.promotion.promotionType == 29 &&
           kindItem.promotion.nowDate > kindItem.promotion.startTime && //活动需处于开始状态
           kindItem.promotion.remainingStock > 0 //活动要有库存
           ) {
           goodsList[colorIndex].checked = true;
           standardsList = colorItem.standardsList;
           selGoods = kindItem
           } else */


          if (kindItem.pdtSku == t.urlParam.id) {
            goodsList[colorIndex].checked = true;
            standardsList = colorItem.standardsList;
            selGoods = kindItem;
          }
        })
      });

      // 如果没有限时购商品默认选中第一个
      // if (!standardsList.length) {
      //   goodsList[0].checked = true;
      //   standardsList = goodsList[0].standardsList;
      //   selGoods = goodsList[0].standardsList[0]
      // }

      t.setState({
        goodsList: goodsList,
        standardsList: standardsList.length && standardsList,
        selGoods: selGoods,
        shopCarCount://(selGoods.promotion.promotionType == 30 && selGoods.showOnly == 0)

          (selGoods.promotion.promotionType == 30 && t.props.payment)
            ? (selGoods.promotion.remainingStock > 0 ? 1 : (selGoods.showOnly == 0 ? 1 : 0))
            : (selGoods.userBuyCount > 0 ? 1 : 0)
        // 购车默认数量 如果是预订按钮进来的 取促销接口的活动库存判断 否则 取计算过的普通商品库存判断
      }, () => {
        console.log('t.props.payment', t.props.payment)
      });
      t.state.finalPayDate = new Date(selGoods.promotion.startTime).toLocaleString() + '-' + new Date(selGoods.promotion.endTime).toLocaleString()
      t.setState({
        finalPayDate: t.state.finalPayDate
      })
    }
  }

  // 改变颜色
  changeColor(e, i) {
    const t = this;
    t.setState({ standardsList: t.props.goodsList[i].standardsList })
  }

  // 改变种类
  changeKind(e, i) {
    console.log('enter change kind');
    const t = this;
    t.setState({
      selGoods: t.state.standardsList[i],
      shopCarCount: t.state.standardsList[i].userBuyCount > 0 ? 1 : 0
    })
  }


  addCartShop() {
    const { addCart } = this.props;
    const selGoods = this.state.selGoods;
    const cart = {
      category: selGoods.categoryId,
      colorCode: selGoods.colorId,
      number: this.state.shopCarCount,
      sizeCode: selGoods.colorId,
      sku: selGoods.pdtSku,
      source: "app",
      userId: this.openid,
    };
    addCart(cart, {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': this.sessionid
      }
    });
  }
  // 点击确定按钮
  submitShopCar(flag) {
    const t = this;
    let checkColor = false, checkKind = false, selGoods = t.state.selGoods;
    // 验证是否选择颜色及种类

    // alert(selGoods.promotion.promotionType);
    // alert(123)
    // alert( this.props.cityCode);
    [].forEach.call(document.querySelectorAll('[type=radio]'), (item) => {
      if (item.checked && item.getAttribute("name") == "color") {
        checkColor = true
      } else if (item.checked && item.getAttribute("name") == "kind") {
        checkKind = true
      }
    });

    if (checkColor && checkKind && t.state.shopCarCount) {
      // t.setState({
      //   loading: !t.state.loading
      // });

      if (this.sessionid) {
        if (selGoods.promotion.promotionType == 30 &&
          selGoods.promotion.bookingStartTime < selGoods.promotion.nowDate &&
          selGoods.promotion.bookingEndTime > selGoods.promotion.nowDate &&
          selGoods.promotion.remainingStock > 0) {
          // t.setState({
          //   loading: !t.state.loading
          // });
          console.log('付费预订');
          if (selGoods.promotion.userIsBooking) {
            Toast.offline('每个付费预订商品只能预订一次!', 2);
            return false
          }

          if (selGoods.promotion.bookingStatus == 0) {
            Toast.offline('未开始预订!', 2);
            return false
          } else if (selGoods.promotion.bookingStatus == 2) {
            Toast.offline('该促销商品的预订时间已过!', 2);
            return false
          }

          if (selGoods.promotion.bookingStartTime > selGoods.promotion.nowDate) {
            Toast.offline('预订时间未到!', 2);
            return false
          }

          let buyNowData;
          buyNowData = {
            tag: '15',
            shopCode: selGoods.shopId,
            shopName: this.props.shopName,
            productId: selGoods.psgId,
            sku: selGoods.pdtSku,
            productName: selGoods.pdtName,
            picture: selGoods.picUrl,
            nowPrice: (selGoods.promotion.bookingAmount * 10000000 + selGoods.promotion.skuPromotionPrice * 10000000) / 10000000,// selGoods.promotion.bookingAmount + selGoods.salePrice - selGoods.promotion.deductibleAmount,
            originalPrice: selGoods.salePrice,
            number: t.state.shopCarCount,
            color: selGoods.color,
            size: selGoods.standard,
            sizeUnit: selGoods.standardUnit,
            chargeUnit: selGoods.chargeUnit,
            chargeUnitName: selGoods.chargeUnitName,
            chargeUnitIsShow: this.props.showUnit,
            hotSale: '2',
            subPromotionId: selGoods.promotion.itemPromotionId,
            promotionType: selGoods.promotion.promotionType,
            inventory: selGoods.inventory,
            goodsType: selGoods.goodsType,
            saleOnly: selGoods.saleOnly,
            extendType: 1,
            firstStepPay: selGoods.promotion.bookingAmount,
            secondStepPay: selGoods.promotion.skuPromotionPrice,//selGoods.salePrice - selGoods.promotion.deductibleAmount,
            cityCode: this.props.cityCode
          }
          if (selGoods.promotion.bookingFavorType == 3) {
            buyNowData.bookingFavorType = selGoods.promotion.bookingFavorType;
            buyNowData.deductionPrice = selGoods.promotion.deductibleAmount;
          }
          let productShopGoodsAttrList = [];

          if (selGoods.goodsType == 1 && selGoods.saleOnly == 1) {
            productShopGoodsAttrList.push({
              id: null,
              psgId: null,
              attributeId: null,
              attributeName: '颜色分类',
              attrValueId: null,
              attrValueName: selGoods.color,
              isShopping: 1
            });

            productShopGoodsAttrList.push({
              id: null,
              psgId: null,
              attributeId: null,
              attributeName: '规格',
              attrValueId: null,
              attrValueName: selGoods.standard,
              isShopping: 1
            });

            buyNowData.productShopGoodsAttrList = productShopGoodsAttrList
          }

          Hybrid('buyNow', 'call_native', buyNowData).then((res) => {
            if (res.success == 'true') {
            }
          }).catch((e) => {
            console.log(e);
          });



        } else if (selGoods.promotion.promotionType == 31 &&
          selGoods.promotion.nowDate > selGoods.promotion.startTime &&
          selGoods.promotion.endTime > selGoods.promotion.nowDate &&
          (selGoods.promotion.remainingStock > 0)) {
          // const isBuyNow =   (selGoods.endTime -selGoods.nowDate > 0) && (selGoods.promotion.remainingStock > 0)
          //this.point.f('110.101.49.58.68.78.211', 'retail', 'page.product.detail', '商品详情页_立即购买', 'page.product.detail.buy');
          console.log('爆款');

          // console.log('ready -------------  ',selGoods.promotion.skuPromotionPrice)
          let buyNowData = {
            tag: '15',
            shopCode: selGoods.shopId,
            shopName: this.props.shopName,
            productId: selGoods.psgId,
            sku: selGoods.pdtSku,
            productName: selGoods.pdtName,
            picture: selGoods.picUrl,
            nowPrice: selGoods.promotion.bookingAmount || (selGoods.salePrice * 10000000 - selGoods.promotion.deductibleAmount * 10000000) / 10000000,
            originalPrice: selGoods.salePrice,
            number: t.state.shopCarCount,
            color: selGoods.color,
            chargeUnit: selGoods.chargeUnit,
            chargeUnitName: selGoods.chargeUnitName,
            chargeUnitIsShow: this.props.showUnit,
            size: selGoods.standard,
            sizeUnit: selGoods.standardUnit,
            hotSale: '1',
            subPromotionId: selGoods.promotion.itemPromotionId,
            promotionType: selGoods.promotion.promotionType,
            promotion: selGoods.promotion.skuPromotionPrice,
            inventory: selGoods.inventory,
            promotionTag: '限',
            cityCode: this.props.cityCode
          }
          if (selGoods.promotion.redstarSpecial == 1) {
            buyNowData.hotSale = '3'
          }
          // console.log('buyNowData--------------',buyNowData)
          // t.setState({
          //   loading: !t.state.loading
          // });
          Hybrid('buyNow', 'call_native', buyNowData).then((res) => {
            if (res.success == 'true') {
            }
          }).catch((e) => {
            console.log(e);
          });
        } else if (selGoods.promotion.promotionType == 28 &&
          selGoods.promotion.bookingStartTime < selGoods.promotion.nowDate &&
          selGoods.promotion.bookingEndTime > selGoods.promotion.nowDate &&
          selGoods.promotion.remainingStock > 0) {
          console.log('拼团');
          console.log('finalPayDate', this.state.finalPayDate);

          // t.setState({
          //   loading: !t.state.loading
          // });

          if (selGoods.promotion.userIsBooking) {
            Toast.offline('每个拼团商品只能预订一次!', 2);
            return false
          }

          if (selGoods.promotion.bookingStatus == 0) {
            Toast.offline('未开始拼团!', 2);
            return false
          } else if (selGoods.promotion.bookingStatus == 2) {
            Toast.offline('该促销商品的拼团时间已过!', 2);
            return false
          }

          if (selGoods.promotion.bookingStartTime > selGoods.promotion.nowDate) {
            Toast.offline('拼团时间未到!', 2);
            return false
          }

          let buyNowData = {
            tag: '15',
            shopCode: selGoods.shopId,
            shopName: this.props.shopName,
            productId: selGoods.psgId,
            sku: selGoods.pdtSku,
            productName: selGoods.pdtName,
            picture: selGoods.picUrl,
            nowPrice: (selGoods.promotion.bookingAmount * 10000000 + selGoods.promotion.skuPromotionPrice * 10000000) / 10000000,// selGoods.promotion.bookingAmount + selGoods.salePrice - selGoods.promotion.deductibleAmount,
            originalPrice: selGoods.salePrice,
            number: t.state.shopCarCount,
            color: selGoods.color,
            chargeUnit: selGoods.chargeUnit,
            chargeUnitName: selGoods.chargeUnitName,
            chargeUnitIsShow: this.props.showUnit,
            size: selGoods.standard,
            sizeUnit: selGoods.standardUnit,
            hotSale: '4',
            subPromotionId: selGoods.promotion.itemPromotionId,
            promotionType: selGoods.promotion.promotionType,
            inventory: selGoods.inventory,
            goodsType: selGoods.goodsType,
            saleOnly: selGoods.saleOnly,
            extendType: 4,
            firstStepPay: selGoods.promotion.bookingAmount,
            secondStepPay: selGoods.promotion.skuPromotionPrice,//selGoods.salePrice - selGoods.promotion.deductibleAmount,
            cityCode: this.props.cityCode,
            finalPayDate: this.state.finalPayDate
          }, productShopGoodsAttrList = [];

          if (selGoods.goodsType == 1 && selGoods.saleOnly == 1) {
            productShopGoodsAttrList.push({
              id: null,
              psgId: null,
              attributeId: null,
              attributeName: '颜色分类',
              attrValueId: null,
              attrValueName: selGoods.color,
              isShopping: 1
            });

            productShopGoodsAttrList.push({
              id: null,
              psgId: null,
              attributeId: null,
              attributeName: '规格',
              attrValueId: null,
              attrValueName: selGoods.standard,
              isShopping: 1
            });

            buyNowData.productShopGoodsAttrList = productShopGoodsAttrList
          }

          Hybrid('buyNow', 'call_native', buyNowData).then((res) => {
            if (res.success == 'true') {
            }
          }).catch((e) => {
            console.log(e);
          });
        } else {
          if (flag == 0) {
            //普通商品立即购买
            console.log('普通商品-立即购买');
            // t.setState({
            //   loading: !t.state.loading
            // });

            let buyNowData = {
              tag: '15',
              shopCode: selGoods.shopId,
              shopName: this.props.shopName,
              productId: selGoods.psgId,
              sku: selGoods.pdtSku,
              productName: selGoods.pdtName,
              picture: selGoods.picUrl,
              nowPrice: selGoods.salePrice,
              originalPrice: selGoods.salePrice,
              onLinePrice: selGoods.onlinePrice,
              number: t.state.shopCarCount,
              color: selGoods.color,
              chargeUnit: selGoods.chargeUnit,
              chargeUnitName: selGoods.chargeUnitName,
              chargeUnitIsShow: this.props.showUnit,
              size: selGoods.standard,
              sizeUnit: selGoods.standardUnit,
              hotSale: '0',
              subPromotionId: selGoods.promotion.itemPromotionId,
              promotionType: selGoods.promotion.promotionType,
              inventory: selGoods.inventory,
              goodsType: selGoods.goodsType,
              saleOnly: selGoods.saleOnly,
              cityCode: this.props.cityCode,
            };

            Hybrid('buyNow', 'call_native', buyNowData).then((res) => {
              console.log('ffffffffffffffff', res);
              if (res.success == 'true') {
                // this.setState({
                //   loading: !t.state.loading
                // })
              }
            }).catch((e) => {
              console.log(e);
            });
          } else {
            //普通商品加入购物车
            this.addCartShop();
            Hybrid('addcart', 'call_native', { tag: 34 }).then((res) => {
              if (res.success == 'true') { }
            }).catch((e) => {
              console.log(e);
            });
            //this.point.f('110.101.49.58.68.78.101', 'retail', 'page.product.detail', '商品详情页_加入购物车', 'page.product.detail.shoppingcart')
            Toast.success('加入购物车成功', 1);
            t.props.callback(t.state.shopCarCount);
            t.props.onClose();
            // t.setState({
            //   loading: !t.state.loading
            // });
          }
        }
      } else {
        console.log(JSON.stringify(e));
      }
    } else {
      if (!checkColor) {
        Toast.offline('请选择商品颜色!', 2);
      } else if (!checkKind) {
        Toast.offline('请选择商品规格!', 2);
      }
      else if (t.state.shopCarCount == 0) {
        Toast.offline('请输入购买数量!', 2);
      }

      return false
    }

  }

  clickCloseBt(e) {
    e.stopPropagation();
    this.props.onClose();
  }

  render() {
    const t = this;
    console.log('t.state.goodsList------', t.state.goodsList);
    let selGoods = t.state.selGoods,
      //计价单位DOM
      unitDom = (t.state.standardsList && t.state.standardsList[0]) ? <label>
        <input type="radio" name="unit"
          defaultChecked
          value={t.state.standardsList[0].chargeUnit} />
        <span className="unitItem">{t.state.standardsList[0].chargeUnitName}</span>
      </label> : '',
      // 颜色DOM
      colorDom = t.state.goodsList && t.state.goodsList.map((item, index) => {
        let _canbuy = 1;  //默认不可点
        item.standardsList.some((subItem) => {

          if (subItem.promotion.promotionType != 31 &&
            subItem.promotion.promotionType != 30 &&
            subItem.promotion.promotionType != 28 &&
            subItem.showOnly == 0 &&
            subItem.inventory > 0) {
            //普通商品，线上可售,有库存->可以点击
            _canbuy = 0;
            return true;
          } else if (subItem.promotion.promotionType == 31 &&
            subItem.promotion.endTime > subItem.promotion.nowDate &&
            subItem.promotion.nowDate > subItem.promotion.startTime &&
            subItem.promotion.remainingStock > 0) {
            //爆款，活动时间内，有库存->可以点击
            _canbuy = 0;
            return true;
          } else if (subItem.promotion.promotionType == 31 &&
            subItem.promotion.endTime > subItem.promotion.nowDate &&
            subItem.promotion.nowDate > subItem.promotion.startTime &&
            subItem.promotion.remainingStock == 0 &&
            subItem.showOnly == 0) {
            //爆款，活动时间内，库存0，线上可售->可以点击
            _canbuy = 0;
            return true;
          } else if (subItem.promotion.promotionType == 31 &&
            subItem.promotion.nowDate < subItem.promotion.startTime &&
            subItem.showOnly == 0) {
            //爆款，活动未开始，线上可售->可以点击
            _canbuy = 0;
            return true;
          } else if (subItem.promotion.promotionType == 30 &&
            subItem.promotion.bookingEndTime > subItem.promotion.nowDate &&
            subItem.promotion.nowDate > subItem.promotion.bookingStartTime &&
            subItem.promotion.remainingStock > 0) {
            //付费预定，预定时间内，有库存->可以点击
            _canbuy = 0;
            return true;
          } else if (subItem.promotion.promotionType == 30 &&
            subItem.promotion.bookingEndTime > subItem.promotion.nowDate &&
            subItem.promotion.nowDate > subItem.promotion.bookingStartTime &&
            subItem.promotion.remainingStock == 0 &&
            subItem.showOnly == 0) {
            //付费预定，预定时间内，库存0，线上可售->可以点击
            _canbuy = 0;
            return true;
          } else if (subItem.promotion.promotionType == 30 &&
            (subItem.promotion.bookingEndTime < subItem.promotion.nowDate || subItem.promotion.nowDate < subItem.promotion.bookingStartTime) &&
            subItem.showOnly == 0) {
            //付费预定，不在预定时间内，线上可售->可以点击
            _canbuy = 0;
            return true;
          } else if (subItem.promotion.promotionType == 28 &&
            subItem.promotion.bookingEndTime > subItem.promotion.nowDate &&
            subItem.promotion.nowDate > subItem.promotion.bookingStartTime &&
            subItem.promotion.remainingStock > 0) {
            // 拼团28 在预定时间内 有库存 ->可以点击
            _canbuy = 0;
            return true;
          } else if (subItem.promotion.promotionType == 28 &&
            (subItem.promotion.nowDate > subItem.promotion.endTime || subItem.promotion.nowDate < subItem.promotion.bookingStartTime) &&
            subItem.showOnly == 0) {
            // 拼团28 不在活动时间内 线上可售->可以点击
            _canbuy = 0;
            return true;
          } else {
            return false;
          }

        });

        return (
          item.checked
            ? ( //判断是否是默认选中
              <label key={index}>
                <input type="radio" name="color"
                  defaultChecked
                  value={item.standards}
                  onChange={t.changeColor.bind(t, item.standards, index)} />
                <span className="colorItem">{item.color}</span>
              </label>)
            : (
              <label key={index}>
                {_canbuy == 0 &&
                  <input type="radio" name="color"
                    value={item.standards}
                    onChange={t.changeColor.bind(t, item.standards, index)} />
                }
                {_canbuy == 1 &&
                  <input type="radio" name="color"
                    value={item.standards}
                    disabled />
                }
                <span className={_canbuy == 0 ? "colorItem" : "colorItem cannot"}>{item.color}</span>
              </label>)
        )
      }),
      // 规格DOM
      kindDom = t.state.standardsList ? (t.state.standardsList.map((item, index) => {
        let _canbuy = 1;

        if (item.promotion.promotionType != 31 &&
          item.promotion.promotionType != 30 &&
          item.promotion.promotionType != 28 &&
          item.showOnly == 0 &&
          item.inventory > 0) {
          //普通商品，线上可售,有库存->可以点击
          _canbuy = 0;
        } else if (item.promotion.promotionType == 31 &&
          item.promotion.endTime > item.promotion.nowDate &&
          item.promotion.nowDate > item.promotion.startTime &&
          item.promotion.remainingStock > 0) {
          //爆款，活动时间内，有库存->可以点击
          _canbuy = 0;
        } else if (item.promotion.promotionType == 31 &&
          item.promotion.endTime > item.promotion.nowDate &&
          item.promotion.nowDate > item.promotion.startTime &&
          item.promotion.remainingStock == 0 &&
          item.showOnly == 0) {
          //爆款，活动时间内，库存0，线上可售->可以点击
          _canbuy = 0;
        } else if (item.promotion.promotionType == 31 &&
          item.promotion.nowDate < item.promotion.startTime &&
          item.showOnly == 0) {
          //爆款，活动未开始，线上可售->可以点击
          _canbuy = 0;
        } else if (item.promotion.promotionType == 30 &&
          item.promotion.bookingEndTime > item.promotion.nowDate &&
          item.promotion.nowDate > item.promotion.bookingStartTime &&
          item.promotion.remainingStock > 0) {
          //付费预定，预定时间内，有库存->可以点击
          _canbuy = 0;
        } else if (item.promotion.promotionType == 30 &&
          item.promotion.bookingEndTime > item.promotion.nowDate &&
          item.promotion.nowDate > item.promotion.bookingStartTime &&
          item.promotion.remainingStock == 0 &&
          item.showOnly == 0) {
          //付费预定，预定时间内，库存0，线上可售->可以点击
          _canbuy = 0;
        } else if (item.promotion.promotionType == 30 &&
          (item.promotion.bookingEndTime < item.promotion.nowDate || item.promotion.nowDate < item.promotion.bookingStartTime) &&
          item.showOnly == 0) {
          //付费预定，不在预定时间内，线上可售->可以点击
          _canbuy = 0;
        } else if (item.promotion.promotionType == 28 &&
          item.promotion.bookingEndTime > item.promotion.nowDate &&
          item.promotion.nowDate > item.promotion.bookingStartTime &&
          item.promotion.remainingStock > 0) {
          // 拼团28 在预定时间内 有库存 ->可以点击
          _canbuy = 0;
        } else if (item.promotion.promotionType == 28 &&
          (item.promotion.nowDate > item.promotion.endTime || item.promotion.nowDate < item.promotion.bookingStartTime) &&
          item.showOnly == 0) {
          // 拼团28 不在活动时间内 线上可售->可以点击
          _canbuy = 0;
        }

        return (
          item.pdtSku == t.state.selGoods.pdtSku
            ? (
              <label key={item.pdtSku}>
                <input type="radio" name="kind"
                  defaultChecked
                  value={item.pdtSku}
                  onChange={t.changeKind.bind(t, item.pdtSku, index)} />
                <span className="kindItem">
                  {`${item.standard}${item.standardUnit != '无' ? '(' + item.standardUnit + ')' : ''}`}
                </span>
              </label>)
            : (
              <label key={item.pdtSku}>
                {_canbuy == 0 &&
                  <input type="radio" name="kind"
                    value={item.pdtSku}
                    onChange={t.changeKind.bind(t, item.pdtSku, index)} />
                }
                {_canbuy == 1 &&
                  <input type="radio" name="kind"
                    value={item.pdtSku}
                    disabled />
                }
                <span className={_canbuy == 0 ? "colorItem" : "colorItem cannot"}>
                  {`${item.standard}${item.standardUnit != '无' ? '(' + item.standardUnit + ')' : ''}`}
                </span>
              </label>)
        )
      })) : "",
      // 售价显示
      viewPrice = n => {
        if (!selGoods) {
          return
        }
        /**
         * 预付定金活动显示定金
         * 爆品和限时购显示促销价
         * 拼团活动显示定金
         * 其余显示原价
         */
        let actionStart = (
          selGoods.promotion.promotionType == 31 && /*限时购 或者爆品活动时*/
          selGoods.promotion.startTime < selGoods.promotion.nowDate &&
          selGoods.promotion.remainingStock > 0
        ) /* 当前时间是否大于活动开始时间 */ ||
          (
            selGoods.promotion.promotionType == 30 && /*限时购 或者爆品活动时*/
            selGoods.promotion.bookingStartTime < selGoods.promotion.nowDate &&
            selGoods.promotion.bookingEndTime > selGoods.promotion.nowDate &&
            selGoods.promotion.remainingStock > 0
          ) /* 当前时间是否大于活动开始时间 */ ||
          (
            selGoods.promotion.promotionType == 28 && /*限时购 或者爆品活动时*/
            selGoods.promotion.bookingStartTime < selGoods.promotion.nowDate &&
            selGoods.promotion.bookingEndTime > selGoods.promotion.nowDate &&
            selGoods.promotion.remainingStock > 0
          )
          // (
          //   selGoods.promotion.promotionType == 30 && /* 付费预订活动时 */
          //   selGoods.promotion.status == 2 /* 是否处于预订中 */
          // )
          ? 1 : 0,//活动时间未到显示原价

          num = actionStart  /* 活动未开始则显示原价 */
            ? (
              (selGoods.promotion.promotionType == 30 || selGoods.promotion.promotionType == 28  /* 付费预订活动,从预订按钮点进来 显示订金, */
                ? selGoods.promotion.bookingAmount
                : (selGoods.promotion.skuPromotionPrice && selGoods.promotion.promotionType != 30) ? selGoods.promotion.skuPromotionPrice : selGoods.salePrice) + ''
              /* 否则有促销价显示促销价,没有促销价显示原价 */
            )
            : ((selGoods.onlinePrice == 0 || !!selGoods.onlinePrice) ? selGoods.onlinePrice : selGoods.salePrice) + '';
        if (n == "number") {
          return num.indexOf('.') != -1 ? num.split('.')[0] : num
        } else {
          return num.indexOf('.') != -1 ? num.split('.')[1].length == 2 ? num.split('.')[1] : num.split('.')[1] + '0' : '00'
        }

      };
    console.log('kindDOM---', kindDom);
    console.log('colorDOM---', colorDom);
    let canBuy;
    let info;
    // showOnly  0 线上可售 1 线上不可售
    // |--普通商品
    // |  |------线上可售0
    // |         |--------提爆31
    // |         |--------预定30
    // |  |------线上不可售1
    // |         |--------提爆31
    // |         |--------预定30
    if (!!selGoods) {
      // todo 爆款31
      if (selGoods.promotion.promotionType == 31 && selGoods.promotion.endTime > selGoods.promotion.nowDate && selGoods.promotion.nowDate > selGoods.promotion.startTime && (selGoods.promotion.remainingStock > 0)) {
        // 促销状态为31 在促销时间内 库存大于0   确定按钮正常
        info = '促销状态为31 在促销时间内 库存大于0   -->确定按钮正常'
        canBuy = 1
      } else if (selGoods.promotion.promotionType == 31 && selGoods.promotion.endTime > selGoods.promotion.nowDate && selGoods.promotion.nowDate > selGoods.promotion.startTime && (selGoods.promotion.remainingStock == 0)) {
        // 促销状态为31 在促销时间内 库存为0　线上可售  -->确定按钮正常
        // 促销状态为31 在促销时间内 库存为0　线上不可售  -->确定按钮灰色
        if (selGoods.showOnly == 0) {
          info = '促销状态为31 在促销时间内 库存为0　线上可售  -->确定按钮正常'
          canBuy = 1
        } else if (selGoods.showOnly != 0) {
          info = '促销状态为31 在促销时间内 库存为0　线上不可售  -->确定按钮灰色'
          canBuy = 0
        }
      } else if (selGoods.promotion.promotionType == 31 && selGoods.promotion.nowDate < selGoods.promotion.startTime) {
        // 促销状态为31 未开始状态 库存大于0　线上可售  -->确定按钮正常
        // 促销状态为31 未开始状态 库存大于0　线上不可售  -->确定按钮灰色
        if (selGoods.showOnly == 0) {
          info = '促销状态为31 未开始状态 库存大于0　线上可售  -->确定按钮正常'
          canBuy = 1
        } else if (selGoods.showOnly != 0) {
          info = '促销状态为31 未开始状态 库存大于0　线上不可售  -->确定按钮灰色'
          canBuy = 0
        }
      }
      // todo 预定30
      else if (selGoods.promotion.promotionType == 30 && selGoods.promotion.bookingEndTime > selGoods.promotion.nowDate && selGoods.promotion.nowDate > selGoods.promotion.bookingStartTime && (selGoods.promotion.remainingStock > 0)) {
        // 预定状态30 在预定时间内 有库存 -->确定按钮正常
        info = '预定状态30 在预定进行中 有库存 -->确定按钮正常'
        canBuy = 1
      } else if (selGoods.promotion.promotionType == 30 && selGoods.promotion.bookingEndTime > selGoods.promotion.nowDate && selGoods.promotion.nowDate > selGoods.promotion.bookingStartTime && (selGoods.promotion.remainingStock == 0)) {
        // 预定状态30 在预定时间内 库存为0　线上可售  -->确定按钮正常
        // 预定状态30 在预定时间内 库存为0　线上不可售  -->确定按钮灰色
        if (selGoods.showOnly == 0) {
          info = '预定状态30 在预定时间内 库存为0　线上可售  -->确定按钮正常'
          canBuy = 1
        } else if (selGoods.showOnly != 0) {
          info = '预定状态30 在预定时间内 库存为0　线上不可售  -->确定按钮灰色'
          canBuy = 0
        }
      } else if (selGoods.promotion.promotionType == 30 && (selGoods.promotion.bookingEndTime < selGoods.promotion.nowDate || selGoods.promotion.nowDate < selGoods.promotion.bookingStartTime)) {
        // 预定状态30 不在预定时间内 线上可售  -->确定按钮正常
        // 预定状态30 不在预定时间内 线上不可售-->确定按钮灰色
        if (selGoods.showOnly == 0) {
          info = '预定状态30 不在预定时间内　线上可售  -->确定按钮正常'
          canBuy = 1
        } else if (selGoods.showOnly != 0) {
          info = '预定状态30 不在预定时间内　线上不可售  -->确定按钮灰色'
          canBuy = 0
        }
      }

      // todo 拼团28
      else if (selGoods.promotion.promotionType == 28 && selGoods.promotion.bookingEndTime > selGoods.promotion.nowDate && selGoods.promotion.nowDate > selGoods.promotion.bookingStartTime && selGoods.promotion.remainingStock > 0) {
        // 拼团28 在预定时间内 有库存 -->确定按钮正常
        info = '拼团28 在预定时间内 有库存 -->确定按钮正常'
        canBuy = 1
      } else if (selGoods.promotion.promotionType == 28 && selGoods.promotion.bookingEndTime > selGoods.promotion.nowDate && selGoods.promotion.nowDate > selGoods.promotion.bookingStartTime && selGoods.promotion.remainingStock == 0) {
        // 拼团28 在预定时间内 无库存 -->确定按钮灰色
        info = '拼团28 在预定时间内 无库存 -->确定按钮灰色'
        canBuy = 0
      } else if (selGoods.promotion.promotionType == 28 && selGoods.promotion.bookingEndTime < selGoods.promotion.nowDate && selGoods.promotion.nowDate < selGoods.promotion.endTime) {
        // 拼团28 在拼团预约时间之后(活动时间内) -->确定按钮灰色
        info = '拼团28 在拼团预约时间之后(活动时间内) -->确定按钮灰色'
        canBuy = 0
      } else if (selGoods.promotion.promotionType == 28 && (selGoods.promotion.nowDate > selGoods.promotion.endTime || selGoods.promotion.nowDate < selGoods.promotion.bookingStartTime)) {
        // 拼团28 不在活动时间内
        if (selGoods.showOnly == 0) {
          info = '拼团28 不在活动时间内 库存大于0　线上可售  -->确定按钮正常'
          canBuy = 1
        } else if (selGoods.showOnly != 0) {
          info = '拼团28 不在活动时间内 库存大于0　线上不可售  -->确定按钮灰色'
          canBuy = 0
        }
      }

      // todo 所有非促销状态下 有库存
      else if (selGoods.promotion.promotionType != 28 && selGoods.promotion.promotionType != 31 && selGoods.promotion.promotionType != 30 && selGoods.showOnly == 0 && selGoods.inventory > 0) {
        // 促销状态不为28/31/30  showOnly为0  -->确定按钮正常
        info = '促销状态不为28/31/30  有库存 showOnly为0  -->确定按钮正常'
        canBuy = 1
      } else if (selGoods.promotion.promotionType != 28 && selGoods.promotion.promotionType != 31 && selGoods.promotion.promotionType != 30 && selGoods.showOnly != 0 && selGoods.inventory > 0) {
        // 促销状态不为28/31/30  showOnly为1  -->确定按钮灰色
        info = '促销状态不为28/31/30  有库存 showOnly为1  -->确定按钮灰色'
        canBuy = 0

      }
      else {
        info = 'else'
        canBuy = 1
      }

    }
    console.log('canBuy', canBuy);
    console.log('selGoods', selGoods);
    console.log('info', info);

    //购物车弹层底部按钮
    let popupButton;
    let _version = t.props.appversion ? t.props.appversion : '0.0.0';
    console.log('app version---', _version);

    if (selGoods &&
      (selGoods.promotion.promotionType == 30 || selGoods.promotion.promotionType == 28) &&
      selGoods.promotion.bookingEndTime > selGoods.promotion.nowDate &&
      selGoods.promotion.nowDate > selGoods.promotion.bookingStartTime &&
      (selGoods.promotion.remainingStock > 0)) {
      popupButton = <Button type="primary" size="small" className={canBuy == 1 ? 'shopCarBtn' : 'shopCarBtn cannot'}
        onClick={canBuy == 1 ? t.submitShopCar.bind(t) : null}>
        支付定金
      </Button>;
    } else if (selGoods &&
      (selGoods.promotion.promotionType == 31 && selGoods.promotion.nowDate > selGoods.promotion.startTime && selGoods.promotion.endTime > selGoods.promotion.nowDate) &&
      (selGoods.promotion.remainingStock > 0)) {
      popupButton = <Button type="primary" size="small" className={canBuy == 1 ? 'shopCarBtn' : 'shopCarBtn cannot'}
        onClick={canBuy == 1 ? t.submitShopCar.bind(t) : null}>
        立即购买
      </Button>;
    } else if ((Env.android && JudgeVersion(_version, '3.2.7')) || (Env.ios && JudgeVersion(_version, '3.2.4'))) {
      popupButton = <div>
        <Button type="primary" inline size="small" className={canBuy == 1 ? 'shopCarBtn doubleBtn goldenColor' : 'shopCarBtn cannot doubleBtn goldenColor'}
          onClick={canBuy == 1 ? t.submitShopCar.bind(t, 0) : null}>
          立即购买
        </Button>
        <Button type="primary" inline size="small" className={canBuy == 1 ? 'shopCarBtn doubleBtn' : 'shopCarBtn cannot doubleBtn'}
          onClick={canBuy == 1 ? t.submitShopCar.bind(t) : null}>
          加入购物车
        </Button>
      </div>;
    } else {
      popupButton = <div>
        <Button type="primary" inline size="small" className={canBuy == 1 ? 'shopCarBtn' : 'shopCarBtn cannot'}
          onClick={canBuy == 1 ? t.submitShopCar.bind(t) : null}>
          加入购物车
        </Button>
      </div>
    }

    return (
      <div id="shopCarPopup">
        <ul>
          {/*售价*/}
          {/*<span*/}
          {/*// className={`priceType ${selGoods.promotion.promotionType == 29 ? 'pro-29' : selGoods.promotion.promotionType == 30 ? 'pro-30' : 'pro-31' }`}>*/}
          {/*className={`priceType pro-29`}>*/}
          {/*/!*{selGoods.promotion.promotionType == 29 ?*!/*/}
          {/*// '限时购' : (selGoods.promotion.promotionType == 30 ? (t.props.payment && selGoods.promotion.status == 2 ? '订金' : '售价') : '爆品')}*/}
          {/*'限时购'*/}
          {/*</span>*/}
          <li className="border-item goodsPrice">
            <div className="goodsImg">
              <img src={selGoods && selGoods.picUrl + '!'} alt="" />
            </div>
            <div className="goodsText">
              <p className="goodsPrice">
                <span className="priceNum">
                  {'¥ ' +
                    (viewPrice('number')) + '.'}
                </span>
                <span className="priceFloat">
                  {viewPrice('float')}
                </span>
                {
                  selGoods &&
                  selGoods.promotion.itemPromotion &&
                  selGoods.promotion.promotionType == 31 &&
                  selGoods.promotion.remainingStock > 0 &&
                  (selGoods.promotion.startTime < selGoods.promotion.nowDate) &&
                  <span className='priceType pro-31'>
                    限时价
                  </span>
                }
                {
                  selGoods &&
                  selGoods.promotion.itemPromotion &&
                  selGoods.promotion.promotionType == 30 &&
                  selGoods.promotion.remainingStock > 0 &&
                  (selGoods.promotion.promotionType == 30 && selGoods.promotion.bookingStatus == 1) &&
                  <span className='priceType pro-30'>
                    定金
                  </span>
                }
                {
                  selGoods &&
                  selGoods.promotion.itemPromotion &&
                  selGoods.promotion.promotionType == 28 &&
                  selGoods.promotion.remainingStock > 0 &&
                  selGoods.promotion.bookingStatus == 1 &&
                  //selGoods.promotion.bookingStatus == 1) &&
                  <span className='priceType pro-30'>
                    定金
                  </span>
                }
              </p>
              <p className="priceCount">
                库存
                {selGoods && ((selGoods.promotion.promotionType == 30 || selGoods.promotion.promotionType == 28) &&
                  selGoods.promotion.remainingStock > 0 &&
                  (selGoods.promotion.bookingStatus == 1) ? selGoods.promotion.remainingStock : selGoods.userBuyCount)}
                {/*件*/}
                {/*{selGoods && selGoods.chargeUnitName||'件'}*/}
              </p>
              <p className="priceColorKind">
                {/*{t.state.checkedColor ? (selGoods ? `您选择的是${t.state.checkedColor}和${selGoods.standard}${selGoods.standardUnit != '无' ? '(' + selGoods.standardUnit + ')' : ''}` : `请选择规格`) : '请选择颜色和规格'}*/}
                {t.state.standardsList ? (selGoods ? `您选择的是${t.state.standardsList[0].color}和${selGoods.standard}${selGoods.standardUnit != '无' ? '(' + selGoods.standardUnit + ')' : ''}` : `请选择规格`) : '请选择颜色和规格'}
              </p>
            </div>
            <div className="shopcar-icon-close" onClick={this.clickCloseBt.bind(this)}></div>
          </li>

          < div className="scroll-box">
            {/*发货城市*/}
            {
              t.props.addressCity && <li className="border-item goodsSite">
                <span className="siteTitle">发货城市</span>
                <span className="siteCity">{t.props.addressCity}</span>
                <span className="siteWay">平邮</span>
              </li>
            }

            {/*计价单位*/}
            {t.props.showUnit &&
              <li className="border-item goodsUnit">
                <p className="unitTitle">
                  计价单位
                </p>
                {unitDom}
              </li>
            }

            {/*颜色*/}
            <li className="border-item goodsColor">
              <p className="colorTitle">
                颜色分类
              </p>
              {colorDom}
            </li>

            {/*规格*/}
            <li className="border-item goodsKind">
              <p className="kindTitle">
                规格分类
              </p>
              {kindDom}
            </li>

            {/*购买数量*/}
            <li className="border-item goodsCount">
              <span className="countTitle">购买数量</span>

              <div className="countBox">
                {/*减少数量*/}
                <span className="countMinus"
                  onTouchStart={function () {
                    selGoods && t.setState({
                      shopCarCount: t.state.shopCarCount > 0 ? t.state.shopCarCount -= 1 : 0
                    })
                  }}>-</span>
                {/*数量*/}
                <input className="countInput" type="tel" value={t.state.shopCarCount} onChange={function (e) {
                  let val = e.target.value;
                  let reg = /^[0-9]\d*$/;
                  let alertMsg = (msg) => {
                    Toast.offline(msg, 2);
                  };

                  if ((selGoods.promotion.promotionType == 30 || selGoods.promotion.promotionType == 28) &&
                    selGoods.promotion.bookingEndTime > selGoods.promotion.nowDate &&
                    selGoods.promotion.nowDate > selGoods.promotion.bookingStartTime &&
                    val > 1) {
                    /*拼团与付费预定 数量最大为1*/
                    alertMsg("超过购买数量限制!");
                    t.setState({
                      shopCarCount: 1,
                    });
                    return t.state.shopCarCount;
                  } else if (selGoods.promotion.userLimitAmount > 0 && /*限购数量有值*/
                    selGoods.promotion.remainingStock > 0 && /*活动库存有值*/
                    selGoods.promotion.nowDate > selGoods.promotion.startTime && /*处于活动开始的时间*/
                    selGoods.promotion.promotionType != 30 && /* 预付订金除外 */
                    selGoods.promotion.userLimitAmount < selGoods.promotion.remainingStock &&
                    selGoods.promotion.userLimitAmount < selGoods.userBuyCount &&
                    val > selGoods.promotion.userLimitAmount) {
                    /*活动时间内，限购数小于库存，数量最大为限购数*/
                    alertMsg("超过购买数量限制!");
                    t.setState({
                      shopCarCount: selGoods.promotion.userLimitAmount,
                    })
                  } else if (selGoods.promotion.userLimitAmount > 0 &&
                    selGoods.promotion.remainingStock > 0 &&
                    selGoods.promotion.nowDate > selGoods.promotion.startTime &&
                    selGoods.promotion.promotionType != 30 &&
                    selGoods.promotion.userLimitAmount > selGoods.promotion.remainingStock &&
                    val > selGoods.promotion.remainingStock) {
                    /*活动时间内，库存小于限购数，数量最大为库存*/
                    alertMsg("商品库存不足!");
                    t.setState({
                      shopCarCount: selGoods.promotion.remainingStock,
                    })

                  } else if (selGoods.userBuyCount < 200 &&
                    val > selGoods.userBuyCount) {
                    /*没有限购，库存小于200，数量最大为库存*/
                    alertMsg("超过购买数量限制!");
                    t.setState({
                      shopCarCount: selGoods.userBuyCount,
                    })
                  } else if ((!selGoods.promotion.promotionType ||
                    ((selGoods.promotion.promotionType == 28 || selGoods.promotion.promotionType == 30) &&
                      (selGoods.promotion.bookingEndTime < selGoods.promotion.nowDate || selGoods.promotion.nowDate < selGoods.promotion.bookingStartTime)) ||
                    (selGoods.promotion.promotionType == 31 && (selGoods.promotion.nowDate < selGoods.promotion.startTime || selGoods.promotion.nowDate > selGoods.promotion.endTime))) &&
                    val > 200) {
                    alertMsg("超过购买数量限制!");
                    t.setState({
                      shopCarCount: 200,
                    })
                  } else if (val != "" && !reg.test(val)) {
                    alertMsg("请输入正确的数值!");
                    t.setState({
                      shopCarCount: 1,
                    })
                  } else {
                    t.setState({
                      shopCarCount: val ? parseInt(val) : val,
                    })
                  }
                  console.log('手动输入数量----', val);
                }} />
                {/*<span>{t.state.shopCarCount}</span>*/}
                {/*增加数量*/}
                <span className="countAdd" onTouchStart={function () {
                  let understock = () => {
                    Toast.offline('库存不足,或者已达到限购数量!', 2);
                    return t.state.shopCarCount
                  };
                  // 付费预定和拼团  数量最大为1
                  if (!t.state.shopCarCount) {
                    t.state.shopCarCount = 0;
                  } else if (t.state.shopCarCount > 0 && selGoods.promotion.promotionType == 30 &&
                    selGoods.promotion.bookingEndTime > selGoods.promotion.nowDate &&
                    selGoods.promotion.nowDate > selGoods.promotion.bookingStartTime) {
                    understock();
                    return false
                  }
                  if (t.state.shopCarCount > 0 && selGoods.promotion.promotionType == 28 &&
                    selGoods.promotion.bookingEndTime > selGoods.promotion.nowDate &&
                    selGoods.promotion.nowDate > selGoods.promotion.bookingStartTime) {
                    understock();
                    return false
                  }
                  selGoods && t.setState({
                    shopCarCount: t.state.shopCarCount < (
                      (selGoods.promotion.userLimitAmount > 0 && /*限购数量有值*/
                        selGoods.promotion.remainingStock > 0 && /*活动库存有值*/
                        selGoods.promotion.nowDate > selGoods.promotion.startTime && /*处于活动开始的时间*/
                        selGoods.promotion.promotionType != 30 && /* 预付订金除外 */
                        selGoods.promotion.userLimitAmount < selGoods.userBuyCount /* 限购数量小于用户可购买数量 */) ? selGoods.promotion.userLimitAmount : (selGoods.userBuyCount < 200 ? selGoods.userBuyCount : 200)
                    )
                      ? t.state.shopCarCount += 1
                      : understock()
                  })
                }}>+</span>
              </div>
            </li>
          </div>
        </ul>

        {/*购物车弹层按钮*/}
        {popupButton}

      </div>
    )
  }
}

export default ShopCarPopup;
