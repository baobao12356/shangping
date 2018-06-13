var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var api = module.exports = express();
var proxyWeb = require('express-http-proxy');
var _ = require('lodash');
var compression = require('compression');
var fs = require('fs');
var multer = require('multer');
var path = require('path');
api.use(logger('dev'));
api.use(compression());
api.use('/api/', bodyParser.json({ "limit": "100000kb" })); // for parsing application/json
api.use('/api/', bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//api.use(multer()); // for parsing multipart/form-data
//require('./shopGoods/routes')(api);

// 测试服务器地址

var urlPre = '/',
  //env = 'dev',
  env = 'uat1',
  //env = 'stg',
  //env = 'prd',

  baseUrl = {
    dev: {
      longyan: 'http://m.dev.rs.com/',
      cms: 'http://cms.dev.rs.com/',
      user: 'http://api-user.dev.rs.com/',
      longguo: 'http://m-api-longguo.dev.rs.com/',
      coupon: 'http://api-promotion.dev.rs.com/',
      coupon_oms: 'http://114.215.184.61:9937/',
      bigdata: 'http://api-bigdata.dev.rs.com/',
      reco: 'http://api-reco.dev.rs.com/',
      im: 'http://im.dev.rs.com/',
      cart: 'http://api-cart.dev.rs.com/',
      tms: 'http://api-tms.dev.rs.com/',
      rtapi: 'http://rtapi.dev.rs.com/',
      rtapi1: 'http://rtapi.dev.rs.com/',
      rtapi2: 'http://rtapi.dev.rs.com/',
    },
    uat1: {
      longyan: 'http://m.uat1.rs.com/',
      cms: 'http://cms.uat1.rs.com/',
      user: 'http://api-user.uat1.rs.com/',
      longguo: 'http://m-api-longguo.uat1.rs.com/',
      coupon: 'http://api-promotion.uat1.rs.com/',
      coupon_oms: 'http://114.215.184.61:9937/',
      bigdata: 'http://api-bigdata.uat1.rs.com/',
      reco: 'http://api-reco.uat1.rs.com/',
      im: 'http://im.uat1.rs.com/',
      cart: 'http://api-cart.uat1.rs.com/',
      tms: 'http://api-tms.uat1.rs.com/',
      rtapi: 'http://rtapi.dev.rs.com/',
      rtapi1: 'http://rtapi.uat1.rs.com/',
      rtapi2: 'http://rtapi.uat1.rs.com/',
    },
    stg: {
      longyan: 'https://m.mklmall.com/',
      cms: 'https://cms.mklmall.com/',
      user: 'https://api-user.mklmall.com/',
      longguo: 'https://m-api-longguo.mklmall.com/',
      coupon: 'https://api-promotion.mklmall.com/',
      coupon_oms: 'http://114.215.184.61:9937/',
      bigdata: 'https://api-bigdata.mklmall.com/',
      reco: 'https://api-reco.mklmall.com/',
      im: 'https://im.mklmall.com/',
      cart: 'https://api-cart.mklmall.com/',
      tms: 'https://api-tms.mklmall.com/',
      rtapi: 'https://rtapi.mklmall.com/',
      rtapi1: 'https://rtapi.mklmall.com/',
      rtapi2: 'https://rtapi.mklmall.com/',
    },
    prd: {
      longyan: 'https://m.mmall.com/',
      cms: 'https://cms.mmall.com/',
      user: 'https://api-user.mmall.com/',
      longguo: 'https://m-api-longguo.mmall.com/',
      coupon: 'https://api-promotion.mmall.com/',
      coupon_oms: 'http://122.144.134.228:9937/',
      bigdata: 'https://api-bigdata.mmall.com/',
      reco: 'https://api-reco.mmall.com/',
      im: 'https://im.mmall.com/',
      cart: 'https://api-cart.mmall.com/',
      tms: 'https://api-tms.mmall.com/',
      rtapi: 'https://rtapi.mmall.com/',
      rtapi1: 'https://rtapi.mmall.com/',
      rtapi2: 'https://rtapi.mmall.com/',
    }
  },
  curPath = baseUrl[env];

api.use('/api-longyan/**', proxyWeb(curPath.longyan, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-longyan', '');
    return url;
  }
}));

api.use('/api-user/**', proxyWeb(curPath.user, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-user', '');
    return url;
  }
}));

api.use('/api-cms/**', proxyWeb(curPath.cms, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-cms', '');
    return url;
  }
}));

api.use('/api-longguo/**', proxyWeb(curPath.longguo, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-longguo', '');
    return url;
  }
}));


api.use('/api-coupon/**', proxyWeb(curPath.coupon, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-coupon', '');
    return url;
  }
}));

api.use('/api-bigdata/**', proxyWeb(curPath.bigdata, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-bigdata', '');
    return url;
  }
}));


api.use('/api-coupon-oms/**', proxyWeb(curPath.coupon_oms, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-coupon-oms', '');
    return url;
  }
}));

api.use('/api-reco/**', proxyWeb(curPath.reco, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-reco', '');
    return url;
  }
}));

api.use('/api-im/**', proxyWeb(curPath.im, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-im', '');
    return url;
  }
}));

api.use('/api-cart/**', proxyWeb(curPath.cart, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-cart', '');
    return url;
  }
}));

api.use('/api-tms/**', proxyWeb(curPath.tms, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-tms', '');
    return url;
  }
}));

api.use('/api-rtapi1/**', proxyWeb(curPath.rtapi1, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-rtapi1', '');
    return url;
  }
}));

api.use('/api-rtapi2/**', proxyWeb(curPath.rtapi1, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-rtapi2', '');
    return url;
  }
}));

api.use('/api-rtapi/**', proxyWeb(curPath.rtapi1, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-rtapi', '');
    return url;
  }
}));

module.exports = api;
