import React, {Component} from 'react';
import Http from '../../common/js/http';
import Collect from '../collect';
import Like from '../like';
import HybridOpenPageNewEvaluationList from 'rs-hybrid-open-page-new-evaluation-list';
import HybridOpenPageEstimate from 'rs-hybrid-open-page-estimate';
import './style.scss';

/* footer 参考文章详情页
 * props: type，id, initCollectData, collect
 * type - string, 查询评论列表的type值，参考http://wiki.corp.rs.com/pages/viewpage.action?pageId=6064652
 * id - string, 当前页面的id
 * collect - 收藏所需的参数（不包含objectId）
 * initCollectData - 收藏所需参数是否初始化完成，为'none'时不展示收藏按钮
 * */
export default class Footer extends Component {
  constructor(props) {
    super(props);
    console.log('footer component');

    this.state = {
      totalElements: 0
    };

    this.commentList = this.commentList.bind(this);
    this.submitComment = this.submitComment.bind(this);
  }

  checkComment (context, id, type) {
    Http.post('/api-longyan/api/review/common/list', {
      body: {
        type: type,
        id: id,
        page: 1,
        pageSize: 1
      }
    }).then(function(data) {
      if ( data.code == 200 && data.dataMap && data.dataMap.totalElements ) {
        context.setState({
          totalElements: data.dataMap.totalElements
        });
      }
    });
  }

  componentDidMount() {
    const _this = this;
    const {type, id} = _this.props;
    _this.checkComment(_this, id, type);
  }

  commentList() {
    const _this = this;
    const {type, id} = _this.props;
    new HybridOpenPageNewEvaluationList().open(id, type).then((res) => {
      if ( res.type == type ) {
        _this.checkComment(_this, id, type);
      }
    }).catch((e)=> {
      throw e;
    });
  }

  submitComment() {
    const _this = this;
    const {type, id} = _this.props;
    new HybridOpenPageEstimate().open(type, id).then((res) => {
      if ( res.success == 'true' ) {
        _this.checkComment(_this, id, type);
      }
    }).catch((e) => {
      console.log(e);
    })
  }

  render() {
    let {id, collect, initCollectData, likeType} = this.props;
    return (
      <footer className="com-page-footer">
        <div onClick={this.submitComment}>
          <p>发表评论</p>
        </div>
        <div>
          <span className="comment" onTouchStart={this.commentList}><em>{this.state.totalElements}</em></span>
          <span className="like-content">
            <Like id={id} likeType={likeType} />
          </span>
          <collect className="collect-content">
            {initCollectData != 'none' ? <Collect id={id} collect={collect} initCollectData={initCollectData} /> : null}
          </collect>
        </div>
      </footer>
    )
  }
}
