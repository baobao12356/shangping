import Env from 'rs-browser';
import React, {Component} from 'react';
import './style.scss';
import {Button} from 'antd-mobile';
import Hybrid from '../../../common/js/hybrid';
export default class Shopexperience extends Component {

  constructor(props) {
    super(props);
    this.state = {

    }

  }
  componentDidMount() {
    document.querySelector('.am-popup-mask').addEventListener('click', ()=> {
      document.querySelector('#shopGoods').setAttribute('class', '');
      window.scroll(0,this.props.topSize)
    });
  }
    onOpenMapView = () => {
    Hybrid('mapView', 'call_native', {
      tag: '1',
      longitude: this.props.shopInfo.marketLon,
      latitude: this.props.shopInfo.marketLat,
      shopName: this.props.shopInfo.shopName,
      marketAddress: this.props.shopInfo.marketAddress,
    }).then((res) => {
      if (res.success == 'true') {

      }
    }).catch((e) => {
      console.log(e);
    });
  };
  render() {

    return (
      <div className="shopDetail">
        <div className="shopDetail_top">
          <p className="shopName">{ this.props.shopInfo.shopName} </p>
          {this.props.shopInfo.distance > 0 &&
          <p className="distance">距您{ this.props.shopInfo.distance }km</p>
          }
        </div>

        <p className="shopAddress" onClick={this.onOpenMapView}>
          <span>{ this.props.shopInfo.marketAddress}</span>
          <em className="icon mapIcon"></em>
        </p>
        {this.props.shopInfo.shopTel &&
        Env.rsApp &&
        <a className="shopTel" href={`phone:${this.props.shopInfo.shopTel}`}>
          <span>{this.props.shopInfo.shopTel}</span>
          <em className="icon telIcon"></em>
        </a>
        }
        <Button type="primary" id="closeMShopBtn" onClick={() => this.props.onClose()}>关闭</Button>
      </div>
    )
  }
}
