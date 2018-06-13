import Env from 'rs-browser';
let appId = 'C1C50237';
if (Env.web) {
  appId = '313734E9';
} else if (Env.android) {
  appId = 'C7D84F4B';
}

const env = {
  appId: appId,
  path: 'https://mkl.mklmall.com',
  hostname : 'https://mkl.mklmall.com',
  call_secret: '1234567890',
  location: 'https://mkl.mklmall.com',
  wap: 'https://m.mklmall.com',
  aureuma: 'https://aureuma.mmall.com',
};

window.__config_env = env;

export default env;
