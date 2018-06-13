import React, {Component} from 'react';
import Http from '../../common/js/http';
import './style.scss';

/* 文章浏览量
 * props: pageview
 * pageview - obj, 接口所需参数中的operation和ids
 * */
export default class PageViews extends Component {

    constructor(props) {
        super(props);

        this.state = {
            views: 0
        }
    }

    componentDidMount() {
        const {pageview} = this.props;
        const config = window.__config_env || {
                appId: 'c3'
            };
        Object.assign(pageview, {
            owner: 'h5_app_c',
            datatypes: 'history',
            fields: 'pv',
            appId: config.appId
        });

        Http.get('/api-bigdata/', {
            body: pageview
        }).then((res) => {
            if (res.code == 200 && res.info[0].history && res.info[0].history.pv) {
                this.setState({
                    views: res.info[0].history.pv
                })
            }
        });
    }

    render() {
        const {views} = this.state;
        return (
            <p className="com-page-views" style={{opacity: views ? '1' : '0'}}>
                {views}
            </p>
        )
    }
}
