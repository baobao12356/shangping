import React, { Component } from 'react';
import DefaultImg from '../defaultImg';
import backOrient from '../../common/js/backOrient';
import './style.scss';

/* 商品展示列表 参考好物清单页面
 * props: list nameReflect
 * list - array, 展示数据
 * nameReflect - object, 字段名称映射
 * */
class ListItem extends Component {
  constructor(props) {
    super(props);

    this.handleGoods = this.handleGoods.bind(this);
  }

  static defaultProps = {
    nameReflect: {
      cover: 'cover',
      goodId: 'goodId',
      title: 'title',
      recommendWord: 'recommendWord',
      price: 'price'
    }
  }

  handleGoods(e) {
    var config = window.__config_env || {
      path: 'http://mkl.uat1.rs.com'
    };
    location = config.path + '/shopGoods/?id=' + e.target.getAttribute('dataSku') + '&back=h5';
    e.stopPropagation();
  }

  render() {
    let list = this.props.list;
    let { cover, goodId, title, recommendWord, price } = this.props.nameReflect;
    return (
      <li className="com-goods-list" data-sku={list[goodId]} onClick={this.handleGoods}>
        <DefaultImg src={list[cover]} />
        <div className="info-content">
          <h4>{list[title]}</h4>
          <p>{list[recommendWord]}</p>
          <p>
            ￥<span>{list[price]}</span>
            <button>立即购买</button>
          </p>
        </div>
      </li>
    )
  }
}

let GoodsList = (props) => {
  let lists = props.lists;
  let listItems = lists.map((list) =>
    <ListItem key={list.id.toString()} list={list} />
  );
  return (
    <ul className="com-goods-list-container">
      {listItems}
    </ul>
  );
}

export default GoodsList;
