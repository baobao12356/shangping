import React, { Component } from 'react';
import Http from '../../common/js/http';
import DefaultImg from '../../components/defaultImg'
import Tags from '../../components/tags';
import GetUserInfo from '../../common/js/getUserInfo';
import backOrient from '../../common/js/backOrient';
import './style.scss';

export default class RecoArt extends Component {

  constructor(props) {
    super(props);

    this.state = {
      infos: []
    }

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const _this = this;
    const { artInfo, artsort } = _this.props;

    GetUserInfo().then((res) => {
      artInfo.userid = res.openid;
    }).catch((e) => {
      console.log(e);
    }).then((res) => {
      Http.get('/api-reco/', {
        body: artInfo
      }).then((res) => {
        if (res.code == 200 && res.sorts) {
          let ids = res.sorts.map((list) => {
            if (!list.sort) {
              return;
            }
            return list.sort;
          });
          artsort.ids = ids.join(',');

          Http.get('/api-bigdata/', {
            body: artsort
          }).then((data) => {
            if (data.code == 200 && data.info) {
              _this.setState({
                infos: data.info
              })
            }
          });
        }
      }).catch((e) => {
        console.log(e);
      });
    });
  }

  handleClick(e) {
    const id = e.target.getAttribute('dataId');
    location = 'picDetail.html?id=' + id + '&back=h5';
  }

  render() {
    const { infos } = this.state;
    if (!infos.length) {
      return null;
    }
    let lists = infos.map((info) => {
      const tags = info.tags.split(',');
      return (
        <li key={info.id} data-id={info.id} onClick={this.handleClick}>
          <DefaultImg src={info.cover_img_url} />
          <div className="info">
            <h4>{info.title}</h4>
            <Tags tags={tags} />
          </div>
        </li>
      )
    });

    return (
      <div className="com-reco-art">
        <h4 className="title">相关推荐</h4>
        <ul className="lists">
          {lists}
        </ul>
      </div>
    )
  }
}

