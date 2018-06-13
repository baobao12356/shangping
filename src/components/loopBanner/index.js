/**
 * Created by chunhua.yang on 2017/6/6.
 */
import React from 'react';
import { Carousel } from 'antd-mobile';
import HybridOpenPageImagePreview from 'rs-hybrid-open-page-image-preview';
import UrlParse from '../../common/js/urlParse';
import './style.scss';

/*轮播图组件
 config{
 imgA:Array,[{},{},...] || ['','',...]（必填）
 imgUrl:String imgA中图片链接字段 （必填）
 linkUrl:String imgA中图片跳转字段（非必填）
 linkType:String imgA中图片跳转类型字段（非必填）
 dots:Bool 轮播图索引原点 default:false
 }
 */

export default class LoopBanner extends React.Component {
  static propTypes = {
    imgA: React.PropTypes.array.isRequired,
  };
  static defaultProps = {
    imgA: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      initialHeight: 205,
    };
    this.hybridOpenPageImagePreview = new HybridOpenPageImagePreview();
  }

  hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  };

  addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += ' ' + cls;
  }

  showImg(e) {

    /**
     * @type data:{
    "ID": "123",
    "objectType": "case",
    "currentIndex": 1,
    "share": {
        "link": "分享链接",
        "title": "分享标题",
        "text": "分享描述",
        "image": "分享图片"
    },
    "photos": [
        {
            "des": "图片描述",
            "url": "图片url",
            "title": "图片标题"
        },
        {
            "des": "图片描述",
            "url": "图片url",
            "title": "图片标题"
        }
    ]
}
     */
    const { f } = this.props;
    f({
      id: 2870,
      p_action_id: `skuid=${UrlParse('id')}`
    });
    let currentIndex = e.target.getAttribute('data-index');
    let data = {
      "photos": [],
      showDownloadBar: 'yes',
      currentIndex: currentIndex,
    };
    if (typeof (this.props.imgA[0]) == 'string') {
      this.props.imgToNative.map((item) => {
        data.photos.push({
          "url": item
        })
      })
    } else {
      this.props.imgToNative.map((item) => {
        data.photos.push({
          "url": item['imgUrl']
        })
      })
    }

    this.hybridOpenPageImagePreview.open(data).then((res) => {
    }).catch(e => {
      console.log(e)
    })

  }

  render() {
    const { imgA, imgUrl, linkUrl, linkType, dots, autoplay, imgToNative } = this.props;
    console.log('this.props', this.props)
    const BannerSet = {
      className: 'hm-carousel',
      dots: dots || false,
      dragging: true,
      autoplay: autoplay || false,
      infinite: true,
      easing: 'linear',
      autoplayInterval: 4000,
    };
    let content = null;
    if (typeof (imgA[0]) == 'string') {
      content = imgA.map((item, idx) => {
        return <div
          key={idx}
          className="com-default-img-content"
          onClick={this.showImg.bind(this)}
          style={{
            height: this.state.initialHeight,
            'backgroundSize': '50%',
            'backgroundColor': '#f5f5f5',
          }}>
          <img
            src={item.indexOf('!') != -1 ? item : item + '!'}
            className="v-item"
            key={idx}
            data-index={idx}
            onLoad={(e) => {
              window.dispatchEvent(new Event('resize'));
              this.addClass(e.target, 'img-show');
              this.setState({
                initialHeight: null,
              });
            }}
          />
        </div>;
      },
      );
    } else {
      content = imgA.map((item, idx) => {
        return <div
          key={idx}
          className="com-default-img-content"
          onClick={this.showImg.bind(this)}
          style={{
            height: this.state.initialHeight,
            'backgroundSize': '50%',
            'backgroundColor': '#f5f5f5',
          }}>
          <img
            src={item[imgUrl]}
            className="v-item"
            data-linkType={item[linkType]}
            data-linkUrl={item[linkUrl]}
            data-index={idx}
            onLoad={(e) => {
              window.dispatchEvent(new Event('resize'));
              this.addClass(e.target, 'img-show');
              this.setState({
                initialHeight: null,
              });
            }
            }
          />
        </div>;

      },
      );
    }
    return <Carousel {...BannerSet} style={{ overflow: 'hidden' }}>
      {content}
    </Carousel>;
  }
}
