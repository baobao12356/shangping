import React, {PureComponent} from 'react';
import CouponItem from './couponItem/couponItem';
import './popCouponRule.scss';
export default  class PopCouponRule extends PureComponent {
  constructor(props){
    super(props)
  }
  componentDidMount() {
    document.querySelector('.am-popup-mask').addEventListener('click', ()=> {
      document.querySelector('#shopGoods').setAttribute('class', '')
      window.scroll(0,this.props.topSize)
    });
  }
  render(){
    const {couponData} = this.props;
    console.log('this.props.couponData',couponData);
    return(
      <div>
        <div className="coupon-pop">
          <div className="coupon-pop-title">优惠券</div>
          <div className="coupon-pop-content">
            <div className="coupon-pop-box">
              {
                couponData && couponData.map((item,index)=>{
                  return(
                    <CouponItem couponLength={couponData.length} info={item} key={index}/>
                  )
                })
              }
            </div>
          </div>
          <div className="coupon-pop-layer"></div>
        </div>
        <div className="promotionconfirm" onClick={this.props.onClose}>完成</div>
      </div>
    )
  }
}
