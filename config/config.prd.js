import Env from 'rs-browser';
let appId = 'C1C50237';
if ( Env.web ) {
  appId = '313734E9';
} else if ( Env.android ) {
  appId = 'C7D84F4B';
}

const env = {
  appId: appId,
  path:'https://wap.mmall.com',
  hostname : 'https://wap.mmall.com',
  call_secret:'DC11572CFFEC446285CA6C3708EAEACD',
  location: 'https://wap.mmall.com',
  wap: 'https://m.mmall.com',
  aureuma: 'https://aureuma.mmall.com',
};

window.__config_env = env;

export default env;
