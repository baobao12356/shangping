import React, { Component } from 'react';
import resizeImg from '../../../common/js/resizeImg';
import UrlParse from '../../../common/js/urlParse';
import './style.scss';

export default class ShopModule extends Component {

  constructor(props) {
    super(props);
    this.JumpToShopHome = this.JumpToShopHome.bind(this)
  }
  JumpToShopHome(id) {
    const { f } = this.props;
    f({
      id: 2877,
      p_action_id: `skuid=${UrlParse('id')}`
    });
    //this.point.f('110.101.49.58.68.78.213', 'retail', 'page.product.detail', '商品详情页_进店逛逛', 'page.product.detail.store1', id)
    window.location = `${window.__config_env ? window.__config_env.hostname : 'http://mkl.uat1.rs.com'}/shop/#/shopHome?id=${id}&back=h5&status=black&__open=1`
  }
  render() {
    const { data, shopAddress } = this.props;
    console.log('1231323213131', shopAddress);
    console.log(data, '店铺banner');
    return (
      <div className="shopmodule" onClick={() => { this.JumpToShopHome(shopAddress.id) }}>
        <div className="shopmodule_img">
          <img src={resizeImg(shopAddress.shopPic, 106, 106)} alt="" />
        </div>
        <div className="shopmodule_detail">
          <div className="shopmodule_name">{shopAddress.shopName}</div>
          <div className="shopmodule_address">{shopAddress.address}</div>
        </div>
        <div className="shopmodule_button">进店逛逛</div>
      </div>
    )
  }
}
