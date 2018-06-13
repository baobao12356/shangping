import React from 'react';
import './style.scss'

export default class BannerShowTime extends React.Component {
  constructor(props){
    super(props)
    this.startTouch=this.startTouch.bind(this)
    this.endTouch=this.endTouch.bind(this)
  }

  startTouch(e) {
    console.log(this.bannerShowTime)
    this.bannerShowTime.className = 'tstart'
    document.querySelector('#bannershowtime').style.background = '#eeeeee !important'
    console.log(this.bannerShowTime.style)
    e.target.style.background = '#eeeeee !important'
  }

  endTouch() {
    this.bannerShowTime.className = ''
    document.querySelector('#bannershowtime').style.background = '#fafafa !important'

  }
  render() {
    return (
      <div id="bannershowtime"  ref={(div)=>{this.bannerShowTime = div}} onTouchStart={this.startTouch} onTouchEnd={this.endTouch}>
        {this.props.children}
      </div>
    );
  }
}
