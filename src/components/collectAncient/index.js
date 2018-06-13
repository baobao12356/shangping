import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import QueryString from 'query-string';
import Host from '../../common/js/config_host';
import Http from '../../common/js/http';
import Login from '../../common/js/login';
import GetUserInfo from '../../common/js/getUserInfo';
import './style.scss';
import BigData from "../../common/js/bigData";

/* collect 收藏
 * props: id collect initCollectData
 * id - 收藏接口所需的objectId
 * collect - 收藏所需数据
 * initCollectData - 收藏所需参数是否初始化完成
* */


export default class Collect extends Component {

  constructor(props) {
    super(props);
    console.log('collect component');

    this.state = {
      pattern: ''
    };

    this.handleCollect = this.handleCollect.bind(this);

    this.course = {
      init: false,
      handle: false,
      checking: false
    };
    this.hasMounted = true;
    this.point = new BigData()
  }

  componentWillReceiveProps(nextProps) {
    const _this = this;
    const { initCollectData } = nextProps;
    if (!initCollectData || _this.course.checking || _this.course.init) {
      return;
    }
    _this.course.checking = true;
    const objectId = _this.props.id;
    const { sourceType } = nextProps.collect;

    GetUserInfo().then((res) => {
      Http.post('/api-user/api/userCollection/IsItemCollectioned', {
        body: {
          appId: Host.appId,
          objectId,
          sourceType
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-auth-token': res.sessionid
        },
        type: 0,
        requestSerializerType: '0'
      }, false).then((resp) => {
        if (resp.code == 200 && resp.dataMap) {
          _this.hasMounted && _this.setState({
            pattern: ' collected'
          });
        }
      });
    }).catch((e) => {
      console.log(e);
    }).then(() => {
      _this.course.checking = false;
      _this.course.init = true;
    });
  }

  componentWillUnmount() {
    this.hasMounted = false;
  }

  handleCollect(e) {
    this.point.f('110.101.49.58.68.78.215', 'retail', 'page.product.detail', '商品详情页_收藏', 'page.product.detail.collection')
    e.stopPropagation();
    const _this = this;
    if (!_this.course.init) {
      return false;
    }
    if (_this.course.handle) {
      Toast.info('哎哟喂，操作失败', 1);
      return false;
    }
    _this.course.handle = true;

    GetUserInfo().then((res) => {
      const objectId = _this.props.id;
      const { sourceType, channel, title, picture, desc1 } = _this.props.collect;
      let url = '/api-user/api/userCollection/cancelUserCollection';

      const body = {
        appId: Host.appId,
        objectId,
        sourceType
      };

      console.log('appid----------------', body);
      if (_this.state.pattern == '') {
        url = '/api-user/api/userCollection/addUserCollection';
        Object.assign(body, {
          channel,
          title,
          picture,
          desc1
        });
      }

      Http.post(url, {
        body,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-auth-token': res.sessionid
        },
        requestSerializerType: '0',
        type: 0,
      }, false).then((data) => {
        _this.course.handle = false;
        if (data.code == 200) {
          if (_this.state.pattern == '' && data.dataMap) {
            _this.hasMounted && _this.setState({
              pattern: ' collected'
            });
            Toast.success('收藏成功', 1);
          } else {
            _this.hasMounted && _this.setState({
              pattern: ''
            });
            Toast.success('取消收藏', 1);
          }
        } else if (data.code == -401) {
          Login();
        } else if (data.code == -9004 || data.code == -9005) {
          Toast.info('今日收藏已达最大次数', 1);
        } else {
          Toast.info('哎哟喂，操作失败', 1);
        }
      });
    }).catch((error) => {
      console.log(error);
      _this.course.handle = false;
      Login();
    });
    return this;
  }
  // {/*<span className={pattern} onClick={this.handleCollect}/>*/}
  render() {
    const pattern = `com-collect${this.state.pattern}`;
    return (
      <img src={pattern == 'com-collect' ? require('./img/collect@2x.png') : require('./img/collected@2x.png')} alt="" onClick={this.handleCollect} />
    );
  }
}
