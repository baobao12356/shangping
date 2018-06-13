/**
 * Created by lenovo on 2017/7/9.
 */
import React, { Component } from 'react';
import './style.scss';

export default class shopCarIcon extends Component {

  constructor(props) {
    super(props);
  }

  toShopCart = () => {
    this.props.toShopCart();
  };

  render() {
    const t = this;

    return (
      <div id="shopCarIcon" onClick={this.toShopCart}>
        <img src={require('./img/rectangle@2x.png')} alt=""/>
        {t.props.count>0&&
        <span className="count">{t.props.count}</span>
        }
      </div>
    );
  }

}
