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
import { getSessionid, getOpenId } from '../../common/js/AuthUtil';
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
      pattern: '',
      listUser: [],
      isListUser: false,
      wishCount: 0
    };

    this.handleCollect = this.handleCollect.bind(this);
    this.handleGoAdd = this.handleGoAdd.bind(this);
    this.handleHideMask = this.handleHideMask.bind(this);

    this.course = {
      init: false,
      handle: false,
      checking: false
    };
    this.hasMounted = true;
    this.point = new BigData();
    this.wishId = 0;
    this.hybridBridge = new HybridBridge(window);
    this.handleAddTag = this.handleAddTag.bind(this);
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
    //获取心愿单数量
    Http.get(`/api-rtapi2/cms/v1.0.0/willing/getCountByKeyAndType/${objectId}/1`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      requestSerializerType: '0'
    }).then((data) => {
      this.setState({
        wishCount: data.dataMap
      });
    });
    GetUserInfo().then((res) => {
      Http.get(`/api-rtapi2/cms/v1.0.0/willing/isExist/${objectId}/1`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-auth-token': res.sessionid
        },
        requestSerializerType: '0'
      }).then((resp) => {
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

  handleHideMask(e) {
    e.stopPropagation();
    this.setState({
      isListUser: false
    });
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

  handleAddTag(title, id, e) {
    e.stopPropagation();
    GetUserInfo().then((res) => {
      const tagData = {
        title,
        idList: [this.wishId],
        openId: res.openId,
        id
      };
      // const tagData = {
      //   openId: res.openId,
      //   title,
      //   idList: [this.wishId]
      // };
      Http.post('/api-rtapi2/cms/v1.0.0/willing/updateUserTagAndRelateByIds', {
        body: tagData,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'x-auth-token': getSessionid()
        },
        requestSerializerType: '0'
      }).then((data) => {
        if (data.code == 200) {
          this.props.f({
            id: 3438,
            p_action_id: `skuid=${UrlParse('id')}`
          });
          this.setState({
            isListUser: false
          });
          Toast.success('成功加入文件夹', 1);
        }
      });
    }).catch((error) => {
      console.log(error);
      Login();
    });
  }

  handleGoAdd(e) {
    this.props.f({
      id: 3445,
      p_action_id: `skuid=${UrlParse('id')}`
    });
    this.setState({
      isListUser: false
    });
    const parameter = {
      tag: '82'
    };
    this.hybridBridge.hybrid('call_native', parameter).then().catch((error) => {
      console.log(error);
    });
  }

  handleCollect(e) {
    //this.point.f('110.101.49.58.68.78.215', 'retail', 'page.product.detail', '商品详情页_收藏', 'page.product.detail.collection');
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
      console.log('res1111111111', res);
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
      };

      const listUserData = {
        pageNo: 1,
        pageSize: 3,
        openId: res.openId,
        flag: 2,
        tagId: 0,
        isInTag: 0
      };

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
              const wishCount = this.state.wishCount + 1;
              _this.hasMounted && _this.setState({
                pattern: ' collected',
                wishCount
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
        //获取心愿单列表
        Http.post('/api-rtapi2/cms/v1.0.0/willing/listUserWillingObj', {
          body: listUserData,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'x-auth-token': res.sessionid
          },
          requestSerializerType: '0'
        }, false).then((data) => {
          this.setState({
            listUser: data.dataMap.tagPages.data,
            isListUser: true
          });
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
            const wishCount = this.state.wishCount - 1;
            this.addWishToNative(0);
            _this.hasMounted && _this.setState({
              pattern: '',
              wishCount
            });
            Toast.success('取消心愿单', 1);
            this.props.f({
              id: 3438,
              p_action_id: `skuid=${UrlParse('id')}`
            });
            this.setState({
              isListUser: false,
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
    console.log('13ffff', this.state.listUser);
    const wishList = this.state.listUser ? this.state.listUser.map((tag) => (
      <div className="tag" onClick={(e) => this.handleAddTag(tag.title, tag.id, e)}>{tag.title}</div>
    )) : '';

    let wishCount = this.state.wishCount > 999 ? '999+' : this.state.wishCount;
    wishCount = parseInt(wishCount) > 0 ? wishCount : ''
    return (
      <div className="wish-comp">
        <div className="wish-count">{wishCount}</div>
        {
          this.state.isListUser && <div className="wish-popup">

            <div className="wp-title">成功加入心愿单！请选择</div>
            {wishList}
            <div className="wp-add" onClick={this.handleGoAdd}><span className="add-icon">+</span> 新建文件夹</div>
            <b className="bottom">
              <i className="bottom-arrow1"></i>
              <i className="bottom-arrow2"></i>
            </b>
          </div>

        }
        <img className='wish-icon' src={pattern == 'com-collect' ? require('./img/wishCollect@2x.png') : require('./img/wishCollected@2x.png')} alt="" onClick={this.handleCollect} />
        {this.state.isListUser && <div className="wish-mask" onClick={this.handleHideMask} onTouchMove={this.handleHideMask}></div>}
      </div>
    );
  }
}
