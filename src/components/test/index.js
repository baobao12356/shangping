/**
 * Created by caihong.wu on 2017/6/26.
 */
import React, {Component} from 'react';
import ProductShortInfo from '../../components/productShortInfo';
import Header from '../../components/header';
import './style.scss';

export default class Test extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    tabs: [
      {tabName: '商品', id: 1},
      {tabName: '详情', id: 2},
      {tabName: '参数', id: 3},
    ],
    items: [
      {content: '11111111111111111111111111111'},
      {content: '232223322222222222'},
      {content: '3333333333333'},
    ],
  };

  render() {
    //第一个tab的数据

    return (
      <div className="testCon">
        <ul>
          <li>6.测试商品详情页</li>
          <li><ProductShortInfo isShowPadding={true} isShowLimitPrice={false}/></li>
          <li>7.测试顶部导航页面</li>
          <li>
            <Header dataTabs={this.state.tabs}>
              <div id="product"><ProductShortInfo isShowPadding={true} isShowLimitPrice={false}/></div>
              <div id="detail" style={{height: 800, backgroundColor: 'green'}}>2222</div>
              <div id="element" style={{height: 1000, backgroundColor: 'purple'}}>33333</div>
            </Header>
          </li>
        </ul>
      </div>
    );
  }
}
