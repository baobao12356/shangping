import React, {Component} from 'react';
import './style.scss';

export default class Pop extends Component {
  constructor(props){
    super(props)
    this.popAfter = this.popAfter.bind(this)
  }
  popAfter(topSize){
    console.log(topSize,'topSize')
    document.querySelector('#shopGoods').setAttribute('class', '')
    window.scroll(0,topSize)
  }
  render(){
    return(
      <div>
        {
          this.props.showpop &&
          this.props.type == 30 &&
          <div className="showpop animated fadeIn">
            <div className="showpop_background"></div>
            <div className="showpop_content">
              <div className="showpop_content_title">预约规则</div>
              <div className="showpop_content_contain">
                <p><span>1、</span>预售不可在订金阶段使用优惠券；</p>
                <p><span>2、</span>订单提交后，顾客需在15分钟内成功支付订金，超时将自动关闭订单；</p>
                <p><span>3、</span>预售商品可以选择在线上支付或在门店支付。具体以商品详情页或订单页为准；</p>
                <p><span>4、</span>订金支付后，顾客未如期支付尾款，或顾客投诉申请退款，则根据红星美凯龙退换货政策判断为顾客责任的，订金恕不退还；</p>
                <p><span>5、</span>订金支付后，如因商家未备货等原因无法正常支付尾款，可申请退订金，由平台审核；</p>
                <p><span>6、</span>定制类商品不支持七天无理由退换货；</p>
              </div>
              <div className="showpop_content_close" onClick={()=>{
                this.popAfter(this.props.topSize)
                this.props.changeShowPop()
              }}>知道了</div>
            </div>
          </div>
        }

        {
          this.props.showpop &&
          this.props.type == 28 &&
          <div className="showpop animated fadeIn">
            <div className="showpop_background"></div>
            <div className="showpop_content">
              <div className="showpop_content_title">拼团规则</div>
              <div className="showpop_content_contain">
                <p><span>1、</span>活动期间，注册会员点击参团并支付订金。支付订金的人数达到或超过最低成团人数均视为已成团，未达到最低成团人数则视为成团失败；</p>
                <p><span>2、</span>活动结束后已成团的商品，参团会员可以在线或前往线下门店支付尾款。成团失败的商品，在10个工作日内退还订金至参团会员的付款账号；</p>
                <p><span>3、</span>活动期间，单个拼团活动1个注册会员只可报名1次；</p>
                <p><span>4、</span>物流配送，成功支付尾款后，按照活动规则快递发货或线下门店自提；</p>
              </div>
              <div className="showpop_content_close" onClick={()=>{
                this.popAfter(this.props.topSize)
                this.props.changeShowPop()
              }}>知道了</div>
            </div>
          </div>
        }
      </div>
    )
  }

}
