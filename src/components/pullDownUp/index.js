import React from 'react'
import './index.scss'

/*
| container | String | 下拉容器的querySelector选择器字符串，默认是当前父元素 |
| id | String | 会作为id属性附加到组件的DOM元素上 |
| className | String | 会作为class属性附加到组件的DOM元素上，可用于自定义组件的样式 |
| topTip| String | 下拉露出的顶部区域的提示文字 |
| bottomTip| String | 上推露出的底部区域的提示文字 |
| threshold | Number | 下拉/上推完成阈值，默认是200 |
| sensitivity | Number | 下拉/上推灵敏度，请传入0.1-1的数字，默认是0.4 |
| enablePull | Boolean | 开启下拉功能，默认true |
| enablePush | Boolean | 开启上推功能，默认true |
| onPullCancel | Function | 取消下拉后执行的回调函数 |
| onPullDown | Function | 达到下拉阈值后执行的回调函数 |
| onPullMove | Function | 下拉过程中指定的回调函数，可以从参数获取到位移、阈值、灵敏度 |
| onPushCancel | Function | 取消上推后执行的回调函数 |
| onPushUp | Function | 达到上推阈值后执行的回调函数 |
| onPushMove | Function | 上推过程中指定的回调函数，可以从参数获取到位移、阈值、灵敏度 |
*/

export default class PullDownUp extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      pulling: false
    };
    this.__container = null;
    this.__eventType = null;
    this.__self = null;
    this.__lastPageY = 0;
    this.__threshold = 0
  }

  componentDidMount() {
    console.log('this.props.enablePull',this.props.enablePull);
    console.log('this.props.enablePull ===boolean',typeof this.props.enablePull === 'boolean');
    this.__container = document.querySelector(this.props.container) || this.refs.content.parentNode;
    this.__self = this.refs.content;
    this.__threshold = this.props.threshold || 200;
    this.__sensitivity = this.props.sensitivity || .4;
    this.__enablePull = typeof this.props.enablePull === 'boolean' ? this.props.enablePull : true;
    this.__enablePush = typeof this.props.enablePush === 'boolean' ? this.props.enablePush : true
  }

  render() {
    let className = this.props.className || this.props.class;
    return (
      <div
        ref="content"
        id={this.props.id || 'react-PullDownUp'}
        className={'react-PullDownUp ' + className}
        onTouchStart={(e) => this.handleTouchStart(e)}
        onTouchMove={(e) => this.handleTouchMove(e)}
        onTouchEnd={() => this.handleTouchEnd()}
        style={{
          minHeight: this.props.minHeight || '100%',
          WebkitTransition: this.state.pulling ? 'none' : 'transform .3s',
          WebkitTransform: 'translateZ(0) translateY(' + this.state.offset / (1 / this.__sensitivity) + 'px)',
          transition: this.state.pulling ? 'none' : 'transform .3s',
          transform: 'translateZ(0)  translateY(' + this.state.offset / (1 / this.__sensitivity) + 'px)'
        }}
        >
          <div className="react-PullDownUp-background-layer">
            <div className="react-PullDownUp-top-tip">{this.props.topTip || this.props.tip}</div>
            <div className="react-PullDownUp-bottom-tip">{this.props.bottomTip}</div>
          </div>
          {this.props.children}
        </div>
    )
  }

  handlePullCancel() {
    typeof this.props.onPullCancel === 'function' && this.props.onPullCancel()
  }

  handlePullDown() {
    typeof this.props.onPullDown === 'function' && this.props.onPullDown()
  }

  handlePushCancel() {
    typeof this.props.onPushCancel === 'function' && this.props.onPushCancel()
  }

  handlePushUp() {
    typeof this.props.onPushUp === 'function' && this.props.onPushUp()
  }

  handleTouchStart(e) {
    let containerHeight = this.__container.getBoundingClientRect().height;
    let contentHeight = this.__self.getBoundingClientRect().height;
    let scrollTop = this.__container.scrollTop;
    let scrollBottom = contentHeight - containerHeight - scrollTop;
    if ((scrollTop <= 5 || scrollBottom <= 5) && (this.__enablePull || this.__enablePush)) {
      this.__lastPageY = e.touches[0].pageY;
      this.setState({
        pulling: true
      })
    }
  }

  handleTouchEnd() {
    let containerHeight = this.__container.getBoundingClientRect().height;
    let contentHeight = this.__self.getBoundingClientRect().height;
    let scrollTop = this.__container.scrollTop;
    let scrollBottom = contentHeight - containerHeight - scrollTop;
    if (scrollTop <= 5 || scrollBottom <= 5) {
      if (Math.abs(this.state.offset) < this.__threshold) {
        if (this.state.offset < 0) {
          this.handlePushCancel()
        } else if(this.state.offset > 0) {
          this.handlePullCancel()
        } else {
          if (this.__eventType === 'pull') {
            this.handlePullCancel()
          } else if (this.__eventType === 'push') {
            this.handlePushCancel()
          }
        }
      } else {
        if (this.state.offset < 0) {
          this.handlePushUp()
        } else {
          this.handlePullDown()
        }
      }
      this.__eventType = null;
      this.setState({
        pulling: false,
        offset: 0
      })
    }
  }

  handleTouchMove(e) {
    let containerHeight = this.__container.getBoundingClientRect().height;
    let contentHeight = this.__self.getBoundingClientRect().height;
    let scrollTop = this.__container.scrollTop;
    let scrollBottom = contentHeight - containerHeight - scrollTop;
    if (scrollTop <= 5 && this.__enablePull) {
      let offset = e.touches[0].pageY - this.__lastPageY;
      offset < 0 && (offset = 0);
      offset > this.__threshold && (offset = this.__threshold);
      offset > 0 &&  e.preventDefault();
      this.__eventType = 'pull';
      typeof this.props.onPullMove === 'function' && this.props.onPullMove({
        offset: offset,
        threshold: this.__threshold,
        sensitivity: this.__sensitivity
      });
      this.setState({ offset })
    } else if (scrollBottom <= 5 && this.__enablePush) {
      let offset = e.touches[0].pageY - this.__lastPageY;
      offset > 0 && (offset = 0);
      offset < this.__threshold * -1 && (offset = this.__threshold * -1);
      offset < 0 &&  e.preventDefault();
      this.__eventType = 'push';
      typeof this.props.onPushMove === 'function' && this.props.onPushMove({
        offset: offset,
        threshold: this.__threshold,
        sensitivity: this.__sensitivity
      });
      this.setState({ offset })
    }
  }
}


