import React, {PureComponent} from 'react';
import './popPromotionRule.scss'
export default  class PopPromotionRule extends PureComponent {
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
    const {promotionData} = this.props;
    console.log('this.props.promotionData',promotionData);
    return(
      <div>
        <div className="promotion-pop">
          <div className="promotion-pop-title">促销</div>
          <div className="promotion-pop-content">
            <div className="promotion-pop-box">
              {
                promotionData && promotionData.map((item,index)=>{
                  return(
                    <div key={index}>
                      <span className="promotion-pop-icon">促</span>
                      <span className="promotion-pop-txt">{item.displayName}</span>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className="promotion-pop-layer"></div>
        </div>
        <div className="promotionconfirm" onClick={this.props.onClose}>完成</div>
      </div>
    )
  }
}
