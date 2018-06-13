import React, {Component} from 'react';
import HybridOpenPageNewEvaluationList from 'rs-hybrid-open-page-new-evaluation-list';
import Http from '../../common/js/http';
import DefaultUser from '../../components/defaultUser';
import './style.scss';

/*文章评论列表页
 *props: id type
* */
export default class ArtCommentList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lists: []
    }
  }

  checkComment(context, id, type) {
    Http.post('/api-longyan/api/review/common/list', {
      body: {
        page: 1,
        pageSize: 2,
        type: type,
        id: id
      }
    }).then((res) => {
      if ( res.code == 200 && res.dataMap && res.dataMap.totalElements ) {
        context.setState({
          lists: res.dataMap.data,
          totalElements: res.dataMap.totalElements
        })
      }
    })
  }

  handleTouch() {
    const _this = this;
    const {id, type} = this.props;
    new HybridOpenPageNewEvaluationList().open(id, type).then((res) => {
      if ( res.type == type ) {
        _this.checkComment(_this, id, type);
      }
    }).catch((e)=> {
      throw e;
    });
  }

  componentDidMount() {
    const _this = this;
    const {id, type} = this.props;

    _this.checkComment(_this, id, type);
  }

  render() {
    const {lists, totalElements} = this.state;
    if ( !lists.length ) {
      return null;
    }
    let comment = lists.map((list) => {
      return (
        <li key={list.id}>
          <div className="author-info">
            <DefaultUser src={list.headerUrl} />
            <div className="name">
              <h4>{list.nickName}</h4>
              <p>{list.createDate}</p>
            </div>
          </div>
          <div className="conmment-content">
            {list.comment}
          </div>
        </li>
      )
    });

    return (
      <div className="com-art-comment-list">
        <h4 className="title">网友点评({totalElements})<span className="more" onTouchStart={this.handleTouch.bind(this)}></span></h4>
        <ul>
          {comment}
        </ul>
      </div>
    )
  }
}
