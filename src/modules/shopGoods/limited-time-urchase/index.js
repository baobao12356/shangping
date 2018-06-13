/**
 * Created by xin.li on 2017/6/30.
 */
import React, { Component } from 'react';
import './style.scss';
import HybridBridge from 'rs-hybrid-bridge';

export default class LimitedTimeUrchase extends Component {
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
    const t = this;
    let groupStatus;
    // !!t.props.actionStart && t.initCountdown(t.props['startTime'], t.props['endTime']);
    t.timeStart = t.props['startTime'];

    if (this.props.actionStart != 3) {
      t.initCountdown(t.props['startTime'], t.props['endTime']);
    } else if (this.props.actionStart == 3 && parseInt(this.props.endTime) - parseInt(this.props.startTime) > 0) {
      t.initCountdown(t.props['startTime'], t.props['endTime']);
    } else if ((this.props.actionStart == 3 && parseInt(this.props.endTime) - parseInt(this.props.startTime) < 0) || (this.props.actionStart == 3 && this.props.remainingStock <= 0)) {
      document.querySelector('#limited-time-urchase').style.background = '#999999'
    }
    // t.initCountdown(20000,30000);
  }

  componentWillUnmount() {
    const t = this;
    clearTimeout(t.timer)
  }

  initCountdown(start, end) {
    if (!end || !start) {
      return false
    }

    const t = this,
      timeSubtract = parseInt(end) - parseInt(start);
    let second = '',
      minutes = '',
      hour = '',
      day = '';

    clearTimeout(t.timer);

    t.timer = setTimeout(function () {
      if (timeSubtract > 0) {
        // 总秒数
        second = timeSubtract % 1000 != 0 ? parseInt(timeSubtract / 1000) + 1 : timeSubtract / 1000;
        // 总分
        // minutes = second % 60 != 0 ? parseInt(second / 60) + 1 : second / 60;
        minutes = parseInt(second / 60);
        // 总时
        // hour = minutes % 60 != 0 ? parseInt(minutes / 60) + 1 : minutes / 60;
        hour = parseInt(minutes / 60);
        if (hour > 23) {
          // console.log('hour',hour)
          day = parseInt(hour / 24);
          hour = hour - 24 * day
          // console.log(day*24)
        }

        t.setState({
          second: second % 60 < 10 ? '0' + second % 60 : second % 60,
          minutes: minutes % 60 < 10 ? '0' + minutes % 60 : minutes % 60,
          hour: hour < 10 ? '0' + hour : hour,
          day: day
        }, () => {
          // t.initCountdown();

        });

        t.initCountdown(parseInt(start) + 1000, end)
      }
      /* 活动开始 */
      else {
        clearTimeout(t.timer);
        t.setState({
          second: '00',
          minutes: '00',
          hour: '00'
        }, () => {
          if (window.location.protocol != 'file:') {
            console.log('非秒开');
            // window.didAppear();
            window.location.reload();
          } else {
            console.log('秒开');
            var hybridBridge = new HybridBridge(window);
            // alert('秒开')
            hybridBridge.hybrid('call_native', { tag: '63' }).then((result) => {
              // ...
            }).catch((error) => {
              // ...
            });
          }
        });
        document.querySelector('#limited-time-urchase').style.display = 'none';
        document.querySelector('#LimitPrice').style.display = 'none';
        // window.didAppear()
        t.props.callBack(true);
        return false
      }
    }, 1000);
  }

  render() {
    const t = this;
    // actionStart 1:爆款31，进行中  0:爆款31，预热   2:付费预定  3:拼团
    if (((this.props.actionStart != 3) || (this.props.actionStart == 3 && parseInt(this.props.endTime) - parseInt(this.props.startTime) > 0)) &&
      t.props.startTime != t.timeStart) {
      // clearTimeout(t.timer);
      t.initCountdown(t.props.startTime, t.props.endTime);
      t.timeStart = t.props.startTime;
    }
    const { bookingFavorType } = this.props;
    return (
      <div>
        {t.props.actionStart == 1 &&
          (
            <div id="limited-time-urchase" className="limited-urchase">
              <span
                className="timeBox">
                <p>距活动结束</p>
                <p>
                  {this.state.day > 0 && this.state.day + '天 '}<span>{t.state.hour}</span> : <span>{t.state.minutes}</span> : <span>{t.state.second}</span>
                </p>
              </span>
            </div>
          )
        }
        {t.props.actionStart == 0 &&
          (
            <div id="limited-time-urchase" className="limited-urchase">
              <span
                className="timeBox">
                <p>距活动开始</p>
                <p>
                  {this.state.day > 0 && this.state.day + '天 '}<span>{t.state.hour}</span> : <span>{t.state.minutes}</span> : <span>{t.state.second}</span>
                </p>
              </span>
            </div>
          )
        }
        {t.props.actionStart == 2 &&
          (
            <div id="limited-time-urchase" className="yellow">
              {this.props.bookingFavorType == 3
                ? <span className="bookprice te-bookprice">特权定金</span>
                : <span className="bookprice"><span className="bookprice">定金</span> <span className="bookprice bigprice">¥ {this.props.price}</span></span>}
              {this.props.bookingFavorType != 3 && <span className="retainage">尾款¥{this.props.retainage}</span>}
              <span className="timeBox">
                <p>
                  距预约结束
              </p>
                <p>
                  {this.state.day > 0 && this.state.day + '天 '}
                  <span>{t.state.hour}</span> : <span>{t.state.minutes}</span> : <span>{t.state.second}
                  </span>
                </p>
              </span>
            </div>
          )

        }

        {t.props.actionStart == 3 &&
          (
            <div id="limited-time-urchase" className="yellow">
              <span className="bookprice">定金</span><span className="bookprice bigprice">¥ {this.props.price}</span>
              <span className="retainage">尾款¥{this.props.retainage}</span>
              {
                parseInt(this.props.endTime) - parseInt(this.props.startTime) > 0 ?
                  <span
                    className="timeBox">
                    <p>
                      距预约结束
                  </p>
                    <p>
                      {this.state.day > 0 && this.state.day + '天 '}
                      <span>{t.state.hour}</span> : <span>{t.state.minutes}</span> : <span>{t.state.second}
                      </span>
                    </p>
                  </span> :
                  <span className="timeBox_end">
                    已结束
                </span>
              }
            </div>
          )
        }
      </div>
    )
  }

}
