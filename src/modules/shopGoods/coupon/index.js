import React, {Component} from 'react';
import './style.scss';
import qPng from './img/q.png';
import yPng from './img/y.png';
import {List} from 'antd-mobile';
import Footer from './../footer'
const Item = List.Item;
export default class Coupon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.footer = new Footer();
  }
  render() {
    const t = this, promotion = t.props.promotion;
    return (
      <div id="couponShop">
        <List>
          {/*<Item thumb={qPng}*/}
          {/*arrow="horizontal"*/}
          {/*onTouchStart={() => {*/}
          {/*window.location.href = `${location.origin}/couponsList`*/}
          {/*}}>*/}
          {/*<span className="desc">9.5折抵用券 满200元可抵用</span></Item>*/}
          {/*付费预订活动*/}
          {t.props.promotion.promotionType == 30 &&
          <Item
            thumb={yPng} arrow="horizontal"
            onTouchStart={() => {
              t.footer.reserve();
            }}>
            <span className="desc">
              {`预付订金${promotion.bookingAmount}元，
              ${promotion.bookingFavorType == 3 ?
                `享受订金翻${promotion.bookingFavorValue}倍` : (promotion.bookingFavorType == 1 ?
                `享受${promotion.bookingFavorValue}元优惠` : `享受${parseInt(promotion.bookingFavorValue) * 100 }折优惠`)}`}
            </span>
          </Item>
          }
        </List>
      </div>
    );
  }
}
