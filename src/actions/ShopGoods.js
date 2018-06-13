import ShopGoodsModel from '../models/ShopGoods';

const SHOPGOODS_ALL = 'SHOPGOODS_ALL';
const MSHOP_ALL = 'MSHOP_ALL';
const FLAGSHOP_ALL = 'FLAGSHOP_ALL';
const ADD_CART = 'ADD_CART';
const NO_SHOPGOODS = 'NO_SHOPGOODS';
const GET_SHOPCARTNUM = 'GET_SHOPCARTNUM';
const GET_SERVERTIME = 'GET_SERVERTIME';
const model = new ShopGoodsModel();
/**
 * 商品信息
 */
async function getShopGoods(id, userInfo) {
  try {
    let shopGoodsType = '';
    const shopGoods = await model.getShopGoods(id);
    const dataMap = shopGoods.dataMap.itemInfo;
    if (!dataMap) {
      shopGoodsType = NO_SHOPGOODS;
    } else {
      shopGoodsType = SHOPGOODS_ALL;
      dataMap.shopAddress = dataMap.shopInfoBrief;

      const goodsPromotion = await model.getGoodsPromotion(dataMap.shopInfoBrief.id, dataMap.pdtSku);
      dataMap.goodsPromotion = goodsPromotion.dataMap.listItemSubPromotionInfo
        ? goodsPromotion.dataMap.listItemSubPromotionInfo : [];

      dataMap.goodsCoupon = goodsPromotion.dataMap.listItemCouponInfo
        ? goodsPromotion.dataMap.listItemCouponInfo : [];

      dataMap.promotion = shopGoods.dataMap.itemPromotionInfo;

      const acPreview = await model.getAcPreview(dataMap.pdtSku);
      dataMap.acPreview = acPreview.dataMap ? acPreview.dataMap : [];

      const recommand = await model.getRecommand({
        pdtSku: dataMap.pdtSku,
        shopId: dataMap.shopId,
        mid: 'a_1497581799064_09e3bbb616355b6', // 调试写死,发环境记得修改
        categoryId: dataMap.categoryId,
        productId: dataMap.productId,
      });

      dataMap.recommand = recommand.dataMap;
      let salesAssistant;

      try {
        salesAssistant = await model.getSalesAssistant(dataMap.shopInfoBrief.id, {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': userInfo.sessionid
          }
        });
        dataMap.salesAssistant = salesAssistant.dataMap;
      } catch (e) {
        dataMap.salesAssistant = [];
      }


      const addressCity = await model.getAddressByProductId({
        shopId: dataMap.shopInfoBrief.id,
        productId: dataMap.pdtSku
      }, {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': userInfo.sessionid
          }
        }
      );
      dataMap.addressCity = addressCity.dataMap;
      let itemPromotionPrice;

      if (dataMap.goodsType == 0) {
        let goodsData = dataMap.goodsData;
        let skuArr = [];
        let promotionsObj = {};
        let goodsList = [];
        // 遍历出所有商品的sku
        for (const item in dataMap.productColorStandards) {
          if (dataMap.productColorStandards.hasOwnProperty(item)) {
            dataMap.productColorStandards[item].forEach((value) => {
              skuArr.push(value.pdtSku);
            });
          }
        }

        itemPromotionPrice = await model.getItemPromotionPrice(skuArr);
        itemPromotionPrice.dataMap.map(item => {
          promotionsObj[item.skuId] = item;
        });
        for (const key in dataMap.productColors) {
          if (dataMap.productColors.hasOwnProperty(key)) {
            let value = dataMap.productColors[key];
            // 便利出所有的种类
            dataMap.productColorStandards[key].map((item, index) => {
              item.promotion = promotionsObj[item.pdtSku];
              // todo 添加计算之后的自定义数据数据
              /**
               * userBuyCount
               * 每个用户限购数量
               */
              const promotionFlag = (promotionsObj[item.pdtSku].itemPromotion &&
                promotionsObj[item.pdtSku].promotionType == 31 &&
                promotionsObj[item.pdtSku].startTime <= promotionsObj[item.pdtSku].nowDate &&
                promotionsObj[item.pdtSku].endTime >= promotionsObj[item.pdtSku].nowDate &&
                promotionsObj[item.pdtSku].remainingStock > 0) ||
                (promotionsObj[item.pdtSku].itemPromotion &&
                  (promotionsObj[item.pdtSku].promotionType == 30 || promotionsObj[item.pdtSku].promotionType == 28) &&
                  promotionsObj[item.pdtSku].bookingStartTime <= promotionsObj[item.pdtSku].nowDate &&
                  promotionsObj[item.pdtSku].bookingEndTime >= promotionsObj[item.pdtSku].nowDate &&
                  promotionsObj[item.pdtSku].remainingStock > 0);

              if (promotionFlag) {
                let _promotion = promotionsObj[item.pdtSku];
                dataMap.productColorStandards[key][index].userBuyCount = _promotion.remainingStock;
              } else {
                dataMap.productColorStandards[key][index].userBuyCount = item.inventory;
              }
            });

            // 购物车组件的数据格式
            goodsList.push({
              standards: key,
              color: value,
              standardsList: dataMap.productColorStandards[key],
            });

            dataMap.goodsList = goodsList;
          }
        }
      } else {
        const skuArr = [dataMap.pdtSku];
        itemPromotionPrice = await model.getItemPromotionPrice(skuArr);
        // 用户可购买数量
        const promotionFlag = (dataMap.promotion.itemPromotion &&
          dataMap.promotion.promotionType == 31 &&
          dataMap.promotion.startTime <= dataMap.promotion.nowDate &&
          dataMap.promotion.endTime >= dataMap.promotion.nowDate &&
          dataMap.promotion.remainingStock > 0) ||
          (dataMap.promotion.itemPromotion &&
            (dataMap.promotion.promotionType == 30 || dataMap.promotion.promotionType == 28) &&
            dataMap.promotion.bookingStartTime <= dataMap.promotion.nowDate &&
            dataMap.promotion.bookingEndTime >= dataMap.promotion.nowDate &&
            dataMap.promotion.remainingStock > 0);
        if (promotionFlag) {
          dataMap.userBuyCount = dataMap.promotion.remainingStock;
        } else {
          dataMap.userBuyCount = dataMap.inventory;
        }

        const goodsList = [];
        goodsList.push({
          standards: dataMap.colorId,
          color: dataMap.color,
          standardsList: [dataMap]
        });
        dataMap.goodsList = goodsList;
      }
    }
    return {
      type: shopGoodsType,
      data: {
        ...dataMap
      }
    };
  } catch (e) {
    return e;
  }
}

// M店调用
async function getMshop(options) {
  try {
    const result = await model.getMshop(options);
    const dataMap = result.dataMap;
    return {
      type: MSHOP_ALL,
      data: {
        ...dataMap
      }
    };
  } catch (e) {
    return e;
  }
}

//购物车数量
async function getShopCartNum(userInfo) {
  try {
    const result = await model.getShopCart({
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': userInfo.sessionid,
      }
    });
    const dataMap = result.dataMap;

    return {
      type: GET_SHOPCARTNUM,
      data: {
        count: dataMap,
      }
    };
  } catch (e) {
    return e;
  }
}

//服务器时间
async function getServerTime() {
  try {
    const result = await model.getServerTime();
    return {
      type: GET_SERVERTIME,
      data: {
        Date: new Date(result.response.headerDate).getTime()
      }
    };
  } catch (e) {
    return e;
  }
}

// 旗舰店调用
async function getFlagShop(options) {
  try {
    const result = await model.getFlagShop(options);
    const dataMap = result.dataMap;
    return {
      type: FLAGSHOP_ALL,
      data: {
        ...dataMap
      }
    };
  } catch (e) {
    return e;
  }
}

//添加购物车
async function getAddCart(data, options) {
  try {
    const result = await model.getAddCart(data, options);
    const dataMap = result;
    return {
      type: ADD_CART,
      data: {
        ...dataMap
      }
    };
  } catch (e) {
    return e;
  }
}


export default {
  ACTION_TYPES: {
    SHOPGOODS_ALL,
    MSHOP_ALL,
    FLAGSHOP_ALL,
    ADD_CART,
    NO_SHOPGOODS,
    GET_SHOPCARTNUM,
    GET_SERVERTIME,
  },
  ACTION: {
    getShopGoods,
    getMshop,
    getFlagShop,
    getAddCart,
    getShopCartNum,
    getServerTime
  }
};
