var CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = (webpackConfig) => {
  let retVal = Object.assign({}, webpackConfig, {
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'antd-mobile': 'antd-mobile'
      // 提出ant design的公共资源
      //'antd': 'antd',
    },
    devServer: {
      //host:'192.168.227.86',
      hot: true,
      inline: true,
      port: 9000,
      stats: { colors: true, progress: false },
      compress: true,
      quiet: false,
      clientLogLevel: 'info',
      open: false,
      //host: '192.168.220.4',
      disableHostCheck: true,
      proxy: {
        '/api-cms': {
          changeOrigin: true,
          target: 'http://localhost:3000',
          secure: false
        },
        '/api-user': {
          changeOrigin: true,
          target: 'http://localhost:3000',
          secure: false
        },
        '/api-longyan': {
          changeOrigin: true,
          target: 'http://localhost:3000',
          secure: false
        },
        '/api-longguo': {
          changeOrigin: true,
          target: 'http://localhost:3000',
          secure: false
        },
        '/api-coupon': {
          changeOrigin: true,
          target: 'http://localhost:3000',
          secure: false
        },
        '/api-bigdata': {
          changeOrigin: true,
          target: 'http://localhost:3000',
          secure: false
        },
        '/api-coupon-oms': {
          changeOrigin: true,
          target: 'http://localhost:3000',
          secure: false
        },
        '/api-reco': {
          changeOrigin: true,
          target: 'http://localhost:3000',
          secure: false
        },
        '/api-im': {
          changeOrigin: true,
          target: 'http://localhost:3000',
          secure: false
        },
        '/api-cart': {
          changeOrigin: true,
          target: 'http://localhost:3000',
          secure: false
        },
        '/api-tms': {
          changeOrigin: true,
          target: 'http://localhost:3000',
          secure: false
        },
        '/api-rtapi1': {
          changeOrigin: true,
          target: 'http://localhost:3000',
          secure: false
        },
        '/api-rtapi2': {
          changeOrigin: true,
          target: 'http://localhost:3000',
          secure: false
        },
        '/api-rtapi': {
          changeOrigin: true,
          target: 'http://localhost:3000',
          secure: false
        },
      }
    }
  });

  const svgDirs = [
    require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
    // path.resolve(__dirname, 'src/my-project-svg-foler'),  // 2. 自己私人的 svg 存放目录
  ];

  retVal.module.loaders.push({
    test: /\.(svg)$/i,
    loader: 'svg-sprite',
    include: svgDirs
  });
  retVal.babel.plugins.push(['import', [
    { libraryName: 'antd-mobile', style: true },
    { libraryName: 'rs-react-components', style: true }
  ]]);
  return retVal;
};
