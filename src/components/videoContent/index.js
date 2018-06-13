import React, {Component} from 'react';
import './style.scss';

/* 展示富文本内容
 * props: description
 * description - string, 富文本内容
 * */
export default class richText extends Component {

  constructor(props) {
    super(props);

    this.handlePlay = this.handlePlay.bind(this);
    this.handlePause = this.handlePause.bind(this);
  }

  handlePlay(e) {
    const target = e.target;
    target.style.display = 'none';
    target.parentNode.querySelector('video').play;
  }

  handlePause(e) {
    const target = e.target;
    if ( target.paused ) {
      target.play();
    } else {
      target.pause();
      target.parentNode.querySelector('.play-btn').style.display = 'block';
    }
  }

  render() {
    const {poster, videoSrc} = this.props;
    return (
      <div className="com-video-getContent">
        <div className="play-btn" style={{backgroundImage: `url(${poster})`}} onClick={this.handlePlay}></div>
        <video src={videoSrc} onClick={this.handlePause}></video>
      </div>
    )
  }
}
