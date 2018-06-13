import React, {PureComponent} from 'react';
import './popServiceRule.scss'
export default  class PopServiceRule extends PureComponent {
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
    const {serviceData} = this.props;
    return(
      <div>
        <div className="service-pop">
          <div className="service-pop-title">服务保障</div>
          <div className="service-pop-content">
            <div className="service-pop-box">
              {
                serviceData && serviceData.map((item,index)=>{
                  return(
                    <div key={index}>
                      <p className="service-pop-box-title">{item.tagName}</p>
                      <p className="service-pop-box-content">{item.tagDesc}</p>
                    </div>
                  )
                })
              }
              {/*<div>*/}
                {/*<p className="service-pop-box-title">支持7天退货</p>*/}
                {/*<p className="service-pop-box-content">商家承诺在买家签收商品之日起七天内，对支持七天无理由退货并符合标准的商品，可发起七天无理由退货申请</p>*/}
              {/*</div>*/}
            </div>
          </div>
          <div className="service-pop-layer"></div>
        </div>
        <div className="serviceconfirm" onClick={this.props.onClose}>完成</div>
      </div>
    )
  }
}
