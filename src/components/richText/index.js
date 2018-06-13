import React, { Component } from 'react';
import HybridOpenPageImagePreview from 'rs-hybrid-open-page-image-preview';
import './style.scss';

/* 展示富文本内容
 * props: description
 * description - string, 富文本内容
 * */
export default class richText extends Component {

  static defaultProps = {
    description: '加载中...',
    preview: 'true',
  };

  previewImg(e) {
    e.stopPropagation();
    const target = e.target;
    if(target.tagName.toLowerCase() != 'img') {
      return;
    }
    let data = {
      ID: '',
      objectType: '',
      currentIndex: '0',
      photos: [],
    };
    let imgAll = document.querySelectorAll('.com-rich-text img');
    for(let i in imgAll) {
      if(imgAll.hasOwnProperty(i)) {
        if(imgAll[i] == target) {
          data.currentIndex = i;
        }
        data.photos.push({
          des: '',
          title: '',
          url: imgAll[i].src,
        });
      }
    }
    new HybridOpenPageImagePreview().open(data).catch((e) => {
      console.log(e);
    });
  }

  createMarkup() {
    return {__html: this.props.description};
  }

  render() {
    const {preview} = this.props;

    return (
      <div className="com-rich-text" dangerouslySetInnerHTML={this.createMarkup()}
           onClick={preview == 'true' ? this.previewImg.bind(this) : ''}>
      </div>
    );
  }
}
