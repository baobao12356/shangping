/**
 * Created by chunhua.yang on 2017/6/30.
 */
// const host = window.__config_env || {
//     // path: 'http://jzwap.dev.rs.com',
//     path: 'http://jzwap.uat1.rs.com',
//     hostname: 'http://mkl.uat1.rs.com',
//     appId: 'c3',
//     ptotocol:'http://',
//     host1:'uat1.rs.com'
//   };
//
// export default host;
const host = window.__config_env || {
  path: 'http://mkl.uat1.rs.com',
  newWap: 'http://m.uat1.rs.com',
  appId: 'c3',
  couponPath: 'http://user-at.uat1.rs.com',
  call_secret: '1234567890',
  //call_secret:'DC11572CFFEC446285CA6C3708EAEACD',
  ptotocol: 'http://',
  aureuma: 'http://aureuma.uat1.rs.com',
};

Object.assign(host, {
  path: ''
});
export default host;
