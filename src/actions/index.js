import ShopGoodsAction from './ShopGoods';

const ERRORS = {
  ERRORS_401: 'ERROR_401',
  ERRORS_500: 'ERROR_500'
};

module.exports = {
  ...ShopGoodsAction.ACTION
};

module.exports.ACTION_TYPES = {
  ...ERRORS,
  ...ShopGoodsAction.ACTION_TYPES
};
