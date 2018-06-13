import React, {Component} from 'react';
import Env from 'rs-browser';
import Http from '../../common/js/http';
import GetUserInfo from '../../common/js/getUserInfo';
import {Toast} from 'antd-mobile';
import Hybrid from '../../common/js/hybrid';
import './style.scss';

/* collect 收藏
 * props: id, likeType
 * id - 收藏接口所需的objectId
 * likeType - 点赞的type
* */
export default class Like extends Component {

  constructor(props) {
    super(props);
    console.log('like component');

    this.state = {
      pattern: ''
    };

    this.handleLike = this.handleLike.bind(this);

    this.course = {
      init: false,
      handle: false
    };
  }

  componentDidMount() {
    const _this = this;
    const {id, likeType} = _this.props;

    GetUserInfo().then((res) => {
      _query(res.sessionid);
    }).catch((e) => {
      console.log(e);
      if ( Env.rsApp ) {
        Hybrid('getPhoneUuid', 'getter').then((res) => {
          if ( res.hxiphoneUUID ) {
            _query(res.hxiphoneUUID);
          } else {
            throw new Error('like-未返回设备序列号');
          }
        }).catch((e) => {
          console.log(e);
        })
      }
    }).then(() => {
      _this.course.init = true;
    });

    function _query(userId) {
      Http.post('/api-longyan/api/review/common/likedCount', {
        body: {
          id: id,
          type: likeType,
          userId: userId
        }
      }).then(function(res) {
        if ( res.code == 200 && res.dataMap && res.dataMap.isUserLiked ) {
          _this.setState({
            pattern: ' liked'
          });
        }
      });
    }
  }

  handleLike() {
    const _this = this;
    const {id, likeType} = _this.props;
    let type = 'Cancel';
    if ( !_this.course.init || _this.course.handle ) {
      return false;
    }
    if ( _this.state.pattern == '' ) {
      type = 'Add';
    }
    _this.course.handle = true;

    GetUserInfo().then((res) => {
      _like(res.sessionid);
    }).catch((e) => {
      console.log(e);
      Hybrid('getPhoneUuid', 'getter').then((res) => {
        if ( res.hxiphoneUUID ) {
          _like(res.hxiphoneUUID);
        } else {
          reject( new Error('like-未返回设备序列号') )
        }
      }).catch((e) => {
        console.log(e);
      })
    });

    function _like(userId) {
      Http.post('/api-longyan/api/review/common/praise', {
        body: {
          type: type,
          id: id,
          objectType: likeType,
          userId: userId
        }
      }).then(function(res) {
        _this.course.handle = false;
        if ( res.code == 200 ) {
          if ( _this.state.pattern == '' ) {
            _this.setState({
              pattern: ' liked'
            });
          } else {
            _this.setState({
              pattern: ''
            });
          }
        }
      });
    }
  }

  render() {
    let pattern = 'com-like' + this.state.pattern;
    return (
      <span className={pattern} onClick={this.handleLike}/>
    )
  }
}
