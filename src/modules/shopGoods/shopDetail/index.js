/**
 * Created by lenovo on 2017/7/10.
 */
import React, {Component} from 'react';
import './style.scss';

export default class ShopImg extends Component {

  render() {
    const { detailData } = this.props;
    console.log(133321321321213,detailData)
    const detailContext = detailData && (
      <div>
          <p className="shopTitle">商品详情</p>
          <div className="detailHtml" dangerouslySetInnerHTML={{__html: detailData.productHtml}}></div>
      </div>
      )
     return (
       <div id="shopGoodsDetail">
       {detailContext}
       </div>
    )
  }
}
