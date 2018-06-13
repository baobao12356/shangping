import { QueryModelCore } from '../core/model.core';

export default class ShopGoodsModel {
  //商品信息
  async getShopGoods(id) {
    const shopGoodsData = new QueryModelCore(`/api-rtapi/shop/v1.0.0/item/getItemAndPromotionDetail/${id}`).get();
    return shopGoodsData;
  }
  //店铺地址
  async getShop(shopId) {
    const shopData = new QueryModelCore(`/api-longguo/app/shopInfo/getShopDetailInfo3/${shopId}`).get();
    return shopData;
  }
  //商品页面促销信息
  async getGoodsPromotion(shopId, sku) {
    const goodsPromotionData =
      new QueryModelCore(`/api-rtapi/shop/v1.0.0/item/getItemSubPromotionAndCouponInfo/${shopId}/${sku}`).get();
    return goodsPromotionData;
  }
  //商品优惠券信息
  async getGoodsCoupon(shopId, sku) {
    const GoodsCouponData =
      new QueryModelCore(`/api-coupon/coupon/getCouponDetailByShopIdAndSkuId/${shopId}/${sku}`).get();
    return GoodsCouponData;
  }
  //促销活动
  async getPromotion(sku) {
    const promotionData =
      new QueryModelCore('/api-coupon/itemPromotion/batchDisplayItemPromotionPrice').post({ skuList: [sku] });
    return promotionData;
  }
  //活动预告
  async getAcPreview(sku) {
    const acPreviewData = new QueryModelCore(`/api-coupon/itemPromotion/getSkuPromotionPreInform/${sku}`).get();
    return acPreviewData;
  }

  //购物车数量
  async getShopCart(options) {
    const shopCartData = new QueryModelCore('/api-cart/cart/queryCarItem/queryItemCount').get({}, options);
    return shopCartData;
  }

  //获取服务器时间
  async getServerTime() {
    const serverTimeData = new QueryModelCore(`/api-rtapi1/active/v1.0.0/common/getCurrentDate`).get();
    return serverTimeData;
  }

  //推荐
  async getRecommand(options) {
    const recommandData = new QueryModelCore('/api-longguo/goods/getRelationGoodsInfo').post({ ...options });
    return recommandData;
  }

  async getSalesAssistant(id, options) {
    const salesAssistant = new QueryModelCore(`/api-im/api/imShop/getSalesAssistant?shopId=${id}`).get({}, options);
    return salesAssistant;
  }

  async getAddressByProductId(data, options) {
    const addressByProductId =
      new QueryModelCore('/api-tms/api/productTemplate/getAddressByProductId').post({ shopId: data.shopId, productId: data.productId }, options);
    return addressByProductId;
  }

  async getMshop(options) {
    console.log(options,'action调接口////////////////')
    const mShop =
      new QueryModelCore(`/api-longguo/app/shopInfo/getShopInfoBriefByShopId/${options.shopId}/${options.longitude}/${options.latitude}`).get();
    return mShop;
  }

  async getFlagShop(options) {
    const flagShop =
      new QueryModelCore(`/api-longguo/flagship/getOfficialFlagshipExperienceShops/${options.shopId}/${options.longitude}/${options.latitude}`).get();
    return flagShop;
  }

  async getItemPromotionPrice(skuArr) {
    const itemPromotionPrice =
      new QueryModelCore('/api-coupon/itemPromotion/batchDisplayItemPromotionPrice').post({ skuList: skuArr });
    return itemPromotionPrice;
  }

  async getAddCart(data, options) {
    const addCart =
      new QueryModelCore('/api-cart/cart/addCarItem').post({
        category: data.category,
        colorCode: data.colorCode,
        number: data.number,
        sizeCode: data.sizeCode,
        sku: data.sku,
        source: "app",
        userId: data.userId
      }, options);
    return addCart;
  }

}
