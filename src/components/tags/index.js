import React, {Component} from 'react';
import './style.scss';

/* 展示标签
 * props: tags
 * tags - Array, 列表
 * */
export default class Tags extends Component {
  render() {
    const {tags} = this.props;
    let tagList = tags.map((tag, idx)=>{
      return (
        <span key={idx}>{tag}</span>
      )
    });

    return (
      <div className="com-tags">
        {tagList}
      </div>
    )
  }
}
