/**
 * Created by lenovo on 2017/7/10.
 */
import React, { Component } from 'react';
import './style.scss';

export default class ShopParameter extends Component {

  constructor(props) {
    super(props);
    this.parameterShortData = [
      {
        name: '品牌',
        prop: 'brandName',
        imgUrl: './img/brandicon.png',
      },
      {
        name: '产地',
        prop: 'countryName',
        imgUrl: './img/placeicon.png',
      },
      {
        name: '等级',
        prop: 'lvInfo',
        imgUrl: './img/levericon.png',
      },
      {
        name: '颜色',
        prop: 'colorShow',
        imgUrl: './img/substrateicon.png',
      },
      {
        name: '规格',
        prop: 'standardShow',
        imgUrl: './img/substrateicon.png',
      },
      {
        name: '计价单位',
        prop: 'chargeUnitName',
        imgUrl: './img/levericon.png',
      },
    ];
    this.parameterFulltData = [
      {
        name: '品牌',
        prop: 'brandName',
        imgUrl: './img/brandicon.png',
      },
      {
        name: '产地',
        prop: 'countryName',
        imgUrl: './img/placeicon.png',
      },
      {
        name: '等级',
        prop: 'lvInfo',
        imgUrl: './img/levericon.png',
      },
      {
        name: '颜色',
        prop: 'colorShow',
        imgUrl: './img/substrateicon.png',
      },
      {
        name: '规格',
        prop: 'standardShow',
        imgUrl: './img/substrateicon.png',
      },
      {
        name: '计价单位',
        prop: 'chargeUnitName',
        imgUrl: './img/levericon.png',
      },
      {
        name: '型号',
        prop: 'modelNumber',
        imgUrl: './img/modelicon.png',
      },
      {
        name: '退换货',
        prop: 'refundType',
        imgUrl: './img/exchange.png',
      },
      {
        name: '价格类型',
        prop: 'priceType',
        imgUrl: './img/pricetype.png',
      },
      {
        name: '主要用料',
        prop: 'material',
        imgUrl: './img/substrateicon.png',
      },
      {
        name: '辅材',
        prop: 'material2',
        imgUrl: './img/assisticon.png',
      },
      {
        name: '饰面',
        prop: 'material3',
        imgUrl: './img/skinicon.png',
      },
      {
        name: '基材',
        prop: 'material1',
        imgUrl: './img/substrateicon.png',
      },
    ];
    this.state = {
      top: null,
      progress: 0,
      parameterData: this.parameterShortData,
      showAttrList: { 'display': 'none' },
    };
  }
  componentDidMount() {
    // setTimeout(()=>{
    //   const max = document.querySelector('#shopParameter').offsetHeight;
    //   const Top = document.querySelector('.parameter li:nth-of-type(7)').offsetTop;
    //   const Topnav = document.querySelector('#shopParameter .showmore').offsetHeight;
    //   console.log('Top',Top);
    //   console.log('max',max);
    //   console.log('Topnav',Topnav);
    //   document.querySelector('#shopParameter').style.maxHeight = Top + Topnav + 'px';
    //   this.state.top = Top + Topnav;
    //   this.state.progress = Top + Topnav;
    //   this.state.max = max;
    // },0)
  }

  showMore(e) {
    // console.log(this.contentDiv);
    // if(this.contentDiv.style.maxHeight == this.state.max + 'px' || this.contentDiv.style.maxHeight == '99999px'){
    //   this.contentDiv.style.maxHeight = this.state.top +'px';
    //   document.querySelector('.showless').style.display = 'none';
    //   document.querySelector('.showmore').style.display = 'block';
    // }else{
    //   this.contentDiv.style.maxHeight = '99999px';
    //   // this.contentDiv.style.maxHeight = this.state.max + 'px'
    //   document.querySelector('.showless').style.display = 'block';
    //   document.querySelector('.showmore').style.display = 'none';
    // }

    if (this.state.parameterData.length == 6) {
      this.setState({
        parameterData: this.parameterFulltData,
        showAttrList: { 'display': 'block' },
      }, () => {
        document.querySelector('.showless').style.display = 'block';
        document.querySelector('.showmore').style.display = 'none';
      })
    } else {
      this.setState({
        parameterData: this.parameterShortData,
        showAttrList: { 'display': 'none' },
      }, () => {
        document.querySelector('.showless').style.display = 'none';
        document.querySelector('.showmore').style.display = 'block';
      })
    }

  }
  render() {
    const t = this;
    // const  parameterData = [
    //   {
    //     name: '品牌',
    //     prop: 'brandName',
    //     imgUrl: './img/brandicon.png',
    //   },
    //   {
    //     name: '产地',
    //     prop: 'countryName',
    //     imgUrl: './img/placeicon.png',
    //   },
    //   {
    //     name: '等级',
    //     prop: 'lvInfo',
    //     imgUrl: './img/levericon.png',
    //   },
    //   {
    //     name: '颜色',
    //     prop: 'colorShow',
    //     imgUrl: './img/substrateicon.png',
    //   },
    //   {
    //     name: '规格',
    //     prop: 'standardShow',
    //     imgUrl: './img/substrateicon.png',
    //   },
    //   {
    //     name: '计价单位',
    //     prop: 'chargeUnitName',
    //     imgUrl: './img/levericon.png',
    //   },
    //   {
    //     name: '型号',
    //     prop: 'modelNumber',
    //     imgUrl: './img/modelicon.png',
    //   },
    //   {
    //     name: '退换货',
    //     prop: 'refundType',
    //     imgUrl: './img/exchange.png',
    //   },
    //   {
    //     name: '价格类型',
    //     prop: 'priceType',
    //     imgUrl: './img/pricetype.png',
    //   },
    //   {
    //     name: '主要用料',
    //     prop: 'material',
    //     imgUrl: './img/substrateicon.png',
    //   },
    //   {
    //     name: '辅材',
    //     prop: 'material2',
    //     imgUrl: './img/assisticon.png',
    //   },
    //   {
    //     name: '饰面',
    //     prop: 'material3',
    //     imgUrl: './img/skinicon.png',
    //   },
    //   {
    //     name: '基材',
    //     prop: 'material1',
    //     imgUrl: './img/substrateicon.png',
    //   },
    //
    // ];
    let parameterDom = null;
    if (Object.keys(t.props.data.promotion).length && this.state.parameterData) {
      parameterDom = this.state.parameterData.map((item, index) => {
        return (
          <li key={index} style={{ display: t.props.data[item.prop] ? 'block' : 'none' }}>
            {/*<img src={require(`${item.imgUrl}`)} alt=""/>*/}
            <p className="paramterName">{item.name}</p>
            <p className="paramterText">{t.props.data[item.prop]}</p>
          </li>
        );
      });
    }

    let attributeListDom = null;
    if (Object.keys(t.props.data.promotion).length && t.props.data.productAttributeList) {
      attributeListDom = t.props.data.productAttributeList.map((item, index) => {
        let productAttributeValueList = item.productAttributeValueList.map((res, i) => {
          return (
            <p key={i}>{res.valueName}</p>
          );
        });

        return (
          <li key={index}>
            <span>{item.attrNameFront}</span>
            <div>
              {productAttributeValueList}
            </div>
          </li>
        );
      });
    }

    return (
      <div id="shopParameter" ref={(div) => { this.contentDiv = div }}>
        <p className="shopTitle">规格参数</p>
        <ul className="parameter">
          {parameterDom}
        </ul>
        <ul className="attributeList" style={this.state.showAttrList}>
          {attributeListDom}
        </ul>
        <div className="showmore" onClick={() => {
          this.showMore()
        }}>查看更多</div>
        <div className="showless" onClick={() => {
          this.showMore()
        }}>收起</div>
      </div>
    );
  }
}
