import React, {Component} from 'react';
import './style.scss';
import cs from 'classnames';


/*展示图片 -- 设置默认图片
 * props: size src alt
 * src - img src
 * alt - img alt
 * size - 默认图片大小
 * */
export default class DefaultUser extends Component {
  constructor(props) {
    super(props);
    this.handleImgLoad = this.handleImgLoad.bind(this);
  }

  static defaultProps = {
    alt: '',
    size: '80'
  };

  handleImgLoad(e) {
    e.target.style.opacity = '1';
  }

  render() {
    const {src, size, alt} = this.props;
    return (
      <div className="com-default-user-content" style={{backgroundImage: `url(./img/user-${size}.png)`}}>
        <img src={src} alt={alt} onLoad={this.handleImgLoad}/>
      </div>
    )
  }
}
