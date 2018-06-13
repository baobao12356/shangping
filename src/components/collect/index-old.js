import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import QueryString from 'query-string';
import Host from '../../common/js/config_host';
import Http from '../../common/js/http';
import Login from '../../common/js/login';
import GetUserInfo from '../../common/js/getUserInfo';
import './style.scss';
import BigData from "../../common/js/bigData";
import HybridBridge from 'rs-hybrid-bridge';
import { getSessionid } from '../../common/js/AuthUtil';
import UrlParse from '../../common/js/urlParse';
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
    this.point = new BigData();
    this.wishId = 0;
    this.hybridBridge = new HybridBridge(window);
  }

  componentDidUpdate() {
    const _this = this;
    const { initCollectData } = this.props;
    if (!initCollectData || _this.course.checking || _this.course.init || !_this.props.id) {
      return;
    }
    _this.course.checking = true;
    const objectId = _this.props.id;
    console.log('111111111111eeeeeee', this.props)
    const wishDom = document.querySelector('.wish-hint');
    const sessionWish = localStorage.getItem('session_wish');
    GetUserInfo().then((res) => {
      Http.get(`/api-rtapi2/cms/v1.0.0/willing/isExist/${objectId}/1`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-auth-token': res.sessionid
        },
        requestSerializerType: '0'
      }, false).then((resp) => {
        if (resp.code == 200 && resp.dataMap) {
          this.wishId = resp.dataMap;
          _this.hasMounted && _this.setState({
            pattern: ' collected'
          });
        } else {
          if (sessionWish == null) {
            wishDom.style.display = 'block';
          }
        }
      });
    }).catch((e) => {
      if (sessionWish == null) {
        wishDom.style.display = 'block';
      }
      console.log(e);
    }).then(() => {
      _this.course.checking = false;
      _this.course.init = true;
    });
  }

  componentWillUnmount() {
    this.hasMounted = false;
  }

  addWishToNative(change) {
    const parameter = {
      change,
      tag: '75'
    };
    this.hybridBridge.hybrid('call_native', parameter).then().catch((error) => {
      console.log(error);
    });
  }

  handleCollect(e) {
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
    const wishDom = document.querySelector('.wish-hint');
    GetUserInfo().then((res) => {
      const { title, picture, id } = _this.props.collect;
      let url = `/api-rtapi2/cms/v1.0.0/willing/deleteUserWillingObjById/${this.wishId}`;


      if (_this.state.pattern == '') {
        url = '/api-rtapi2/cms/v1.0.0/willing/addUserWillingObj';
      }

      const userData = {
        objKey: id,
        objTitle: title,
        objPic: picture,
        objRatio: 1,
        objType: 1
      }
      if (_this.state.pattern == '') {
        Http.post(url, {
          body: userData,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'x-auth-token': res.sessionid
          },
          requestSerializerType: '0'
        }, false).then((data) => {
          this.wishId = data.dataMap;
          _this.course.handle = false;
          if (data.code == 200) {
            if (_this.state.pattern == '' && data.dataMap) {
              _this.hasMounted && _this.setState({
                pattern: ' collected'
              });
              this.addWishToNative(1);
              wishDom.style.display = 'none';
              localStorage.setItem('session_wish', 1);
              Toast.success('加入心愿单', 1);
              this.props.f({
                id: 3437,
                p_action_id: `skuid=${UrlParse('id')}`
              });
            } else {
              _this.hasMounted && _this.setState({
                pattern: ''
              });
              Toast.success('取消心愿单', 1);
            }
          } else if (data.code == -401) {
            Login();
          } else if (data.code == -9004 || data.code == -9005) {
            Toast.info('今日收藏已达最大次数', 1);
          } else {
            Toast.info('哎哟喂，操作失败', 1);
          }
        });
      } else {
        Http.get(url, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-auth-token': res.sessionid
          }
        }).then((resp) => {
          _this.course.handle = false;
          if (resp.code == 200) {
            this.addWishToNative(0);
            _this.hasMounted && _this.setState({
              pattern: ''
            });
            Toast.success('取消心愿单', 1);
            this.props.f({
              id: 3438,
              p_action_id: `skuid=${UrlParse('id')}`
            });
          }
        });
      }
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
      <img className='wish-icon' src={pattern == 'com-collect' ? require('./img/wishCollect@2x.png') : require('./img/wishCollected@2x.png')} alt="" onClick={this.handleCollect} />
    );
  }
}
