import React, { Component } from 'react';
import './style.scss';
import HybridBridge from 'rs-hybrid-bridge';
import { start } from 'repl';

export default class CountTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hour: "00",
      minutes: "00",
      second: "00",
      countDown: '',
      day: null
      // type : this.props.type||0,  //默认0  type 0 开始到结束倒计时  1 未开始到开始倒计时
    };
  }

  componentDidMount() {
    // const { nowDate, bookingStartTime } = this.props.promotion;
    // this.startTime = bookingStartTime - nowDate;
    this.initCountDown();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  initCountDown() {
    const { nowDate, bookingStartTime } = this.props.promotion;
    let startTime = parseInt(bookingStartTime) - parseInt(nowDate);
    let second = '';
    let minutes = '';
    let hour = '';
    let day = '';
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      startTime = parseInt(startTime) - 100;
      if (startTime > 0) {
        second = startTime % 1000 != 0 ? parseInt(startTime / 1000) + 1 : startTime / 1000;
        minutes = parseInt(second / 60);
        hour = parseInt(minutes / 60);
        if (hour > 23) {
          // console.log('hour',hour)
          day = parseInt(hour / 24);
          hour = hour - 24 * day
          // console.log(day*24)
        }
        this.setState({
          second: second % 60 < 10 ? '0' + second % 60 : second % 60,
          minutes: minutes % 60 < 10 ? '0' + minutes % 60 : minutes % 60,
          hour: hour < 10 ? '0' + hour : hour,
          day: day
        });
      } else {
        window.location.reload();
      }

    }, 100);
  }

  render() {
    return (
      <span>
        距开始 {this.state.day > 0 && this.state.day + '天 '}<span className='pHour'>{this.state.hour}</span> : <span className='pMinutes'>{this.state.minutes}</span> : <span className='pSecond'>{this.state.second} </span>
      </span>
    );
  }
}
