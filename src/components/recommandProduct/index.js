import React, { Component } from 'react';
import './style.scss';
import Http from '../../common/js/http';
import backOrient from '../../common/js/backOrient';
import LazyLoad from 'react-lazy-load';
import resizeImg from '../../common/js/resizeImg';
import UrlParse from '../../common/js/urlParse';
/*
 * 需要传递sku
 * */
export default class RecommandProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.point = this.point.bind(this);
  }

  point() {
    const { f } = this.props;
    f({
      id: 2886,
      p_action_id: `skuid=${UrlParse('id')}`
    });
  }

  render() {
    const t = this;
    const { recommand } = t.props;
    let relationGoods = null;
    if (Object.keys(recommand).length && recommand.relationGoods.length) {
      relationGoods = recommand.relationGoods.map(item => {
        return (
          <div className="productImgList" key={item.pdtSku}>
            <a href={`${window.__config_env ? window.__config_env.hostname : 'http://mkl.uat1.rs.com'}/shopGoods/?id=${item.pdtSku}&back=h5&__open=1`}
              onClick={() => {
                this.point();
              }}>
              <LazyLoad height={172}>
                <img className="previewImg" src={resizeImg(item.picUrl, 340, 340)} />
              </LazyLoad>
              <p className="title">
                {item.pdtName}
              </p>
              {
                item.showOnly == 0 &&
                <p className="price">
                  {item.discountPrice ? `¥ ${(item.discountPrice + '').indexOf('.') != -1 ? item.discountPrice : item.discountPrice + ''}` : `¥ ${(item.onlinePrice + '').indexOf('.') != -1 ? item.onlinePrice : item.onlinePrice + ''}`}
                  <del>{`¥ ${(item.salePrice + '').indexOf('.') != -1 ? item.salePrice : item.salePrice + ''}`}</del>
                </p>
              }
            </a>
          </div>
        );
      });
    }
    return (
      <div className="recommandProduct">
        <div>
          <div className="split"></div>
          <p className="desc">相关推荐</p>
          <div className="productCon">
            <div className="pList">
              {relationGoods}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
