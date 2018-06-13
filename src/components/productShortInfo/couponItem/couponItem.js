import React, { Component } from 'react';
import cs from 'classnames';
import Http from '../../../common/js/http';
import dateFormat from '../../../common/js/dateFormat';
import GetUserInfo from '../../../common/js/getUserInfo';
import HybridOpenPageLogin from 'rs-hybrid-open-page-login';
import onfire from 'onfire.js';
import { Toast } from 'antd-mobile';
import Env from 'rs-browser';
import Cookies from 'js-cookie';
import HybridBridge from 'rs-hybrid-bridge';
import { isLogin, getSessionid } from '../../../common/js/AuthUtil';
import getNativeInfo from '../../../common/js/getNativeInfo';
import './couponItem.scss';

export default class CouponItem extends Component {
  constructor(props) {
    super(props);
    console.log('this.props.couponData', this.props.info);
    this.state = {
      status: this.props.info.status,
      remainingTimes: this.props.info.perPersonRemainingCount,
      plusVersion: true
    };
    dateFormat.dateFormatPro();
    this.clickCouponGet = this.clickCouponGet.bind(this);
    this.displayCouponTitle = this.displayCouponTitle.bind(this);
    this.hybridOpenPageLogin = new HybridOpenPageLogin();
    this.hybridBridge = new HybridBridge(window);
  }

  componentDidMount() {
    getNativeInfo().then((data) => {
      //alert(data.version)
      if (data && data.version) {
        if (this.judgeVersion(data.version, '3.3.2')) {
          this.setState({
            plusVersion: true,
          });
        } else {
          this.setState({
            plusVersion: false,
          });
        }
      }
    });
  }

  componentWillReceiveProps(next) {
    this.setState({
      status: next.info.status,
      remainingTimes: next.info.perPersonRemainingCount
    });
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

  displayCouponTitle(data) {
    if (data.couponType == 56) {//赠品券
      return <div className="coupon-item-price text">{data.title}</div>
    } else if (data.couponType == 57) {//礼品券
      return <div className="coupon-item-price text">{data.title}</div>
    } else {
      let dataTitle = data.title;
      let textUnit = '';
      if (dataTitle.indexOf("元") != -1) {
        let range = dataTitle.toString().split('元')[1];
        if (range) {
          dataTitle = dataTitle.toString().split('元')[0].replace(/[^\d|\.]/ig, "") + '-' + range.replace(/[^\d|\.]/ig, "");
          textUnit = '元';
        }
        else {
          dataTitle = dataTitle.toString().split('元')[0];
          textUnit = '元'
        }
      }
      else if (dataTitle.indexOf("折") != -1) {
        dataTitle = dataTitle.toString().split('折')[0];
        textUnit = '折';
      }
      return <div className='coupon-item-price'>{dataTitle}
        <span className="coupon-item-unit">{textUnit}</span>
      </div>
    }
  }

  //点击领取优惠券
  clickCouponGet(couponId, status, index, receiveType) {
    const t = this;
    if (!status || status != 1) return;
    if (isLogin()) {
      const sessionid = getSessionid();
      Http.post(`/api-coupon/channel/20/name/1/subChannel/9/user/cupon/${couponId}`, {
        headers: {
          'x-auth-token': sessionid
        }
      }).then((res) => {
        console.log('商品优惠券领取结果', res);
        // let tip = '领取成功';
        let tempStatus = 2;
        if (res.code == 200) {
          if (res.dataMap.remainingTimes == 0) {
            Toast.info('领取成功', 1);
            this.setState({
              status: 2
            });
          } else {
            Toast.info(`领取成功，还可领${res.dataMap.remainingTimes}次`, 1);
            this.setState({
              remainingTimes: res.dataMap.remainingTimes
            });
            // Toast.info(tip, 1);
            tempStatus = 1;
          }
        } else if (res.code == 'PROMOTION_1013') {
          Toast.info(res.message, 2);
          this.setState({
            status: 2
          });
        } else if (res.code == 'PROMOTION_1014') {
          Toast.info(res.message, 2);
          this.setState({
            status: 3
          });
          tempStatus = 3;
        } else if (res.code == 10045) {
          const tag = 76;
          this.hybridBridge.hybrid('call_native', { tag }).then().catch((error) => {
            console.log(error);
          });
        } else {
          let tip = res.message;
          Toast.info(tip, 2);
        }
        if (res.code == 200 || res.code == 'PROMOTION_1013' || res.code == 'PROMOTION_1014') {
          onfire.fire('changeCouponStatus', {
            status: tempStatus,
            index: index,
            perPersonRemainingCount: this.state.remainingTimes
          });
        }
      }).catch((error) => { console.log(console.log("促销中心领券", error)) });
    } else {
      // alert(JSON.stringify(e))
      // alert('denglu')
      t.hybridOpenPageLogin.open(() => {
        window.location.href = location.href
      }).then((result) => {
        console.log(result);
        onfire.fire('loadCouponList');
      }).catch((error) => {
        console.log('领取优惠券登录错误', error);
      });
    };
  }

  render() {
    const { info, idx } = this.props;
    console.log('-----------info', info);
    const { status, remainingTimes } = this.state;
    const plusStatus = !this.state.plusVersion && info.receiveType ? 1 : 0;
    return (
      <div className={cs({ 'goods-coupon-item': true, 'get_end': status == 3, 'have_get': status == 2, 'not_start': false, 'goods-coupon-plus': plusStatus == 1 })} onClick={() => this.clickCouponGet(info.id, status, idx, info.receiveType)}>
        <div className="coupon-item-left">
          <div className="coupon-item-comp">
            <span className="coupon-item-price text">{info.couponShortName}</span>
            {info.receiveType ? <span className="coupon_item_plus"></span> : ''}
          </div>
          <div className="coupon-item-desc">{info.conditions}</div>
          <div className="coupon-item-time">
            {
              info.startT.split(' ')[0]
            } 至 {
              info.endT.split(' ')[0]
            }
          </div>
        </div>
        <div className="coupon-item-right">
          {status == 1 && <div className="coupon-item-btn">领取</div>}
          {!status && <div className="coupon-item-btn not_start">{`${new Date(parseFloat(info.issueStartTime)).Format("yyyy-MM-dd hh:mm")} 开抢`}</div>}
        </div>
        <div className={cs({ 'coupon_status': true, 'get_end': status == 3, 'have_get': status == 2 })}></div>
      </div>
    )
  }
}
