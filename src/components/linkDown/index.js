/**
 * Created by lenovo on 2017/8/9.
 */
import React, {Component} from 'react';
import Env from 'rs-browser';
import OpenApp from './../../common/js/openApp'
import './style.scss';

export default class LinkDown extends Component {
  constructor(props) {
    super(props);
  }

  closeTab() {
    document.querySelector('#linkDown').style.display = 'none';
  }

  render() {
    const t = this;
    return (
      <div id="linkDown">
        <p id="openApp" onClick={()=>{
          OpenApp()
        }}>立即打开</p>
        <em className="close" onClick={()=>{
          document.querySelector('#linkDown').style.display = 'none';
        }}/>
      </div>
    )
  }
}
