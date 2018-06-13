const Backbone = require('backbone');

module.exports = (api) => {
  api.route('/api-longguo/goods/getGoodsInfo/')
    .get((req,res) => {
      const fixture = require('./shopGoods-data');
      const reModel = new Backbone.Model(fixture());
      res.status(200).json(reModel);
    })
}

