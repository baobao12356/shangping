import { Toast } from 'antd-mobile';
import { ACTION_TYPES } from '../actions';
import resizeImg from '../common/js/resizeImg';

const initialState = {
  shopGoodsData: {
    config: {
      imgA: [],
      imgToNative: [],
      imgUrl: 'imgUrl',
      linkUrl: 'linkUrl',
      linkType: 'linkType',
      autoplay: true,
      dots: true
    },
    promotion: {},
    productAttributeList: [],
    recommand: {},
    footerStatus: {
      isBuyNow: false,
      nostart: false,
      noStock: false,
      addCart: true,
      canBook: false,
      noBook: false,
      groupEnd: false,
      groupNoStock: false,
      groupBook: false
    }
  },
  mShopData: {},
  flagShopData: {},
  addCartData: {},
  shopCartNumData: {},
  serverTimeData: {},
};

function initShopGoods(data) {
  const imgs = data && data.imgs.map((img) => {
    return resizeImg(img, 750, 750);
  });
  const config = {
    imgA: imgs,
    imgToNative: data && data.imgs,
    imgUrl: 'imgUrl',
    linkUrl: 'linkUrl',
    linkType: 'linkType',
    autoplay: true,
    dots: true
  };

  if (data) {
    let productColors = [];
    for (const key in data.productColors) {
      productColors.push(data.productColors[key] + ' /');
    }
    if (productColors.length > 0) {
      productColors[productColors.length - 1] = productColors[productColors.length - 1].replace(/\//g, '');
    } else {
      productColors = null;
    }

    let standards = '';
    for (const key in data.productColorStandards) {
      const size = data.productColorStandards[key][0].standard + '(' + data.productColorStandards[key][0].standardUnit + ') / ';
      if (standards.indexOf(size) < 0) {
        standards += size;
      }
    }
    const colorsIndex = standards.lastIndexOf('/');
    standards = standards.slice(0, colorsIndex);
    data.standardShow = standards;
    data.colorShow = productColors;
  }

  data.config = config;

  let priceShowType;
  let limitedTimeType;
  let log;
  if (data && data.promotion.promotionType == 31
    && data.showOnly == 1 && data.promotion.nowDate < data.promotion.startTime) {
    // 活动未开始 线上不可售状态 按照未开始促销样式显示
    priceShowType = 1;
    limitedTimeType = true;
    log = '爆款未开始 线上不可售状态 按照未开始促销样式显示';
  } else if (data && data.promotion.promotionType == 31
    && data.showOnly == 0 && data.promotion.nowDate < data.promotion.startTime) {
    // 活动未开始 线上可售状态  按照普通商品可售显示
    priceShowType = 0;
    limitedTimeType = false;
    log = '爆款未开始 线上可售状态  按照普通商品可售显示';
  } else if (data && data.promotion.promotionType == null && data.showOnly == 1) {
    // 普通商品 线上不可售
    priceShowType = -1;
    limitedTimeType = false;
    log = '普通商品 线上不可售';
  } else if (data && data.promotion.promotionType == null && data.showOnly == 0) {
    // 普通商品  线上可售
    priceShowType = 0;
    limitedTimeType = false;
    log = '普通商品  线上可售';
  } else if (data && data.promotion.promotionType == 31 &&
    data.promotion.nowDate > data.promotion.startTime &&
    data.promotion.nowDate < data.promotion.endTime &&
    data.promotion.remainingStock > 0) {
    // 爆款进行中，有库存
    priceShowType = 1;
    limitedTimeType = true;
    log = '爆款进行中，有库存';
  } else if (data && data.promotion.promotionType == 31 &&
    data.promotion.nowDate > data.promotion.startTime &&
    data.promotion.nowDate < data.promotion.endTime &&
    data.promotion.remainingStock == 0) {
    // 爆款进行中，无库存  线上可售，按照普通商品可售显示。线上不可售，按照促销已售罄状态显示
    if (data.showOnly == 1) {
      priceShowType = 1;
      limitedTimeType = true;
      log = '爆款进行中，无库存  线上不可售，按照促销已售罄状态显示';
    } else {
      priceShowType = 0;
      limitedTimeType = false;
      log = '爆款进行中，无库存  线上可售，按照普通商品可售显示';
    }
  } else if (data && data.promotion.promotionType == 30 &&
    data.promotion.nowDate > data.promotion.bookingStartTime &&
    data.promotion.nowDate < data.promotion.bookingEndTime &&
    data.promotion.bookingFavorType != 3 &&
    data.promotion.remainingStock == 0) {
    // 预定进行中，无库存  线上可售，按照普通商品可售显示。线上不可售，按照促销已售完状态显示
    if (data.showOnly == 1) {
      priceShowType = 2;
      limitedTimeType = true;
      log = '预定进行中，无库存  线上不可售，按照促销已售完状态显示';
    } else {
      priceShowType = 0;
      limitedTimeType = false;
      log = '预定进行中，无库存  线上可售，按照普通商品可售显示。';
    }
  } else if (data &&
    data.promotion.promotionType == 30 &&
    data.promotion.nowDate > data.promotion.bookingStartTime &&
    data.promotion.nowDate < data.promotion.bookingEndTime &&
    data.promotion.bookingFavorType != 3 &&
    data.promotion.remainingStock > 0) {
    // 预定进行中，有库存
    priceShowType = 2;
    limitedTimeType = true;
    log = '预定进行中，有库存';
  } else if (data &&
    data.promotion.promotionType == 30 &&
    data.promotion.nowDate < data.promotion.bookingStartTime &&
    data.promotion.bookingFavorType != 3) {
    // 预定未开始，线上可售，按照普通商品可售显示。线上不可售，按照促销已售完状态显示
    if (data.showOnly == 1) {
      priceShowType = -1;
      limitedTimeType = false;
      log = '预定未开始，线上不可售，按照促销已售完状态显示';
    } else {
      priceShowType = 0;
      limitedTimeType = false;
      log = '预定未开始，线上可售，按照普通商品可售显示。';
    }
  } else if (data && data.promotion.promotionType == 30 &&
    data.promotion.nowDate > data.promotion.bookingStartTime &&
    data.promotion.nowDate < data.promotion.bookingEndTime &&
    data.promotion.bookingFavorType == 3 &&
    data.promotion.remainingStock == 0) {
    // 定金膨胀进行中，无库存  线上可售，按照普通商品可售显示。线上不可售，按照促销已售完状态显示
    if (data.showOnly == 1) {
      priceShowType = 2;
      limitedTimeType = true;
      log = '进行中，无库存  线上不可售，按照促销已售完状态显示';
    } else {
      priceShowType = 0;
      limitedTimeType = false;
      log = '进行中，无库存  线上可售，按照普通商品可售显示。';
    }
  } else if (data &&
    data.promotion.promotionType == 30 &&
    data.promotion.nowDate > data.promotion.bookingStartTime &&
    data.promotion.nowDate < data.promotion.bookingEndTime &&
    data.promotion.bookingFavorType == 3 &&
    data.promotion.remainingStock > 0) {
    // 定金膨胀进行中，有库存
    priceShowType = 2;
    limitedTimeType = true;
    log = '预定进行中，有库存';
  } else if (data &&
    data.promotion.promotionType == 30 &&
    data.promotion.nowDate < data.promotion.bookingStartTime &&
    data.promotion.bookingFavorType == 3) {
    // 未开始，线上可售，按照普通商品可售显示。线上不可售，按照促销已售完状态显示
    if (data.showOnly == 1) {
      priceShowType = -1;
      limitedTimeType = false;
      log = '预定未开始，线上不可售，按照促销已售完状态显示';
    } else {
      priceShowType = 0;
      limitedTimeType = false;
      log = '预定未开始，线上可售，按照普通商品可售显示。';
    }
  } else if (data &&
    data.promotion.promotionType == 28 &&
    data.promotion.nowDate > data.promotion.bookingStartTime &&
    data.promotion.nowDate < data.promotion.bookingEndTime &&
    data.promotion.remainingStock == 0) {
    // 拼团进行中，无库存  线上可售，按照普通商品可售显示。线上不可售，按照促销已售完状态显示
    if (data.showOnly == 1) {
      priceShowType = 3;
      limitedTimeType = true;
      log = '拼团进行中，无库存  线上不可售，按照促销已售完状态显示';
    } else {
      priceShowType = 3;
      limitedTimeType = true;
      log = '拼团进行中，无库存  线上可售，按照普通商品可售显示。';
    }
  } else if (data &&
    data.promotion.promotionType == 28 &&
    data.promotion.nowDate > data.promotion.bookingStartTime &&
    data.promotion.nowDate < data.promotion.bookingEndTime &&
    data.promotion.remainingStock > 0) {
    // 拼团进行中，有库存
    priceShowType = 3;
    limitedTimeType = true;
    log = '拼团进行中，有库存';
  } else if (data && data.promotion.promotionType == 28 && data.promotion.nowDate < data.promotion.bookingStartTime) {
    // 拼团未开始，线上可售，按照普通商品可售显示。线上不可售，按照促销已售完状态显示
    if (data.showOnly == 1) {
      priceShowType = -1;
      limitedTimeType = false;
      log = '拼团未开始，线上不可售，按照普通商品不可售显示';
    } else {
      priceShowType = 0;
      limitedTimeType = false;
      log = '拼团未开始，线上可售，按照普通商品可售显示。';
    }
  } else if (data && data.promotion.promotionType == 28 && data.promotion.nowDate > data.promotion.endTime) {
    // 拼团活动结束 倒计时才结束
    if (data.showOnly == 1) {
      priceShowType = -1;
      limitedTimeType = false;
      log = '拼团活动结束 倒计时才结束，线上不可售，按照普通商品不可售显示';
    } else {
      priceShowType = 0;
      limitedTimeType = false;
      log = '拼团活动结束 倒计时才结束，线上可售，按照普通商品可售显示。';
    }
  } else if (data &&
    data.promotion.promotionType == 28 &&
    data.promotion.nowDate > data.promotion.bookingStartTime &&
    data.promotion.nowDate < data.promotion.endTime) {
    // 拼团活动内结束 倒计时一直存在,价格一直显示为拼团状态
    priceShowType = 3;
    limitedTimeType = true;
    log = '拼团活动内结束 倒计时一直存在,价格一直显示为拼团状态';
  } else {
    priceShowType = 0;
    limitedTimeType = false;
  }
  console.log(log, 'log');
  console.log(priceShowType, 'priceShowType');
  console.log(limitedTimeType, 'limitedTimeType');

  // todo 控制拼团进度状态
  let status;
  let groupDivPercentage;
  let groupStatus;
  let groupStatusColor;

  if (data && data.promotion.promotionType == 28) {
    status = Math.round((data.promotion.offeredNumber / data.promotion.numberConditions) * 100);
    if (status > 100) {
      status = 100;
    } else if (status < 1 && status != 0) {
      status = 1;
    } else if (status > 99) {
      if (data.promotion.numberConditions > data.promotion.offeredNumber) {
        status = 99;
      } else {
        status = 100;
      }
    } else if (status == 0) {
      status = 0;
    }
    data.promotion.groupDivPercentage = status; // > 1 ? status : 1
    groupDivPercentage = status;
    if (data.promotion.numberConditions > data.promotion.offeredNumber && data.promotion.bookingStatus == 1) {
      // 人数条件 > 已参团人数 且在预定时间内
      // goodsData.promotion.groupStatus = '拼团中' + status + '%'
      groupStatus = `拼团中 ${status}%`;
    } else if (data.promotion.numberConditions <= data.promotion.offeredNumber) {
      // 人数条件 <= 已参团人数
      // goodsData.promotion.groupStatus = '已成团'
      groupStatus = '已成团';
    } else if (data.promotion.nowDate > data.promotion.bookingEndTime) {
      // 超出预定时间
      if (data.promotion.numberConditions > data.promotion.offeredNumber) {
        // goodsData.promotion.groupStatus = '拼团失败'
        groupStatus = '拼团失败';
        // goodsData.promotion.groupStatusColor = '#ff454a'
        groupStatusColor = '#ff454a';
      } else {
        // goodsData.promotion.groupStatus = '已成团'
        groupStatus = '已成团';
      }
    }
  }

  // todo 预定（28,30）情况下，总价
  let booktotalPrice;
  if (data.promotion.promotionType == 30 || data.promotion.promotionType == 28) {
    booktotalPrice = ((data.promotion.skuPromotionPrice * 1000000)
      + (data.promotion.bookingAmount * 1000000)) / 1000000;
  }

  data.customPromotion = {
    limitedTimeType,
    priceShowType,
    groupDivPercentage,
    groupStatusColor,
    groupStatus,
    booktotalPrice
  };

  // todo 控制footer状态
  // isBuyNow 立即购买
  const isBuyNow = (data.promotion.promotionType == 31) &&
    (data.promotion.endTime > data.promotion.nowDate) &&
    (data.promotion.remainingStock > 0) &&
    (data.promotion.nowDate > data.promotion.startTime);
  // nostart 未开始
  const nostart = (data.showOnly == 1) &&
    (data.promotion.promotionType == 31) &&
    (data.promotion.nowDate < data.promotion.startTime);
  // noStock 售罄-> 爆款，活动库存0，线上不可售，活动进行中；爆款，活动库存和库存均为0，线上可售，活动进行中
  const noStock = ((data.showOnly == 1) &&
    (data.promotion.promotionType == 31) &&
    (data.promotion.endTime > data.promotion.nowDate) &&
    (data.promotion.remainingStock == 0)) ||
    (data.showOnly == 0 &&
      data.promotion.promotionType == 31 &&
      data.promotion.endTime > data.promotion.nowDate &&
      data.promotion.remainingStock == 0 &&
      data.inventory == 0);
  // canBook 支付定金
  const canBook = (data.promotion.promotionType == 30) &&
    (data.promotion.bookingEndTime > data.promotion.nowDate) &&
    (data.promotion.remainingStock > 0) &&
    (data.promotion.nowDate > data.promotion.bookingStartTime);
  // noBook 已售完
  const noBook = ((data.showOnly == 1 && data.promotion.promotionType == 30)
    && (data.promotion.bookingEndTime > data.promotion.nowDate)
    && (data.promotion.remainingStock == 0)
    && (data.promotion.nowDate > data.promotion.bookingStartTime)) ||
    (data.showOnly == 0
      && data.promotion.promotionType == 30
      && (data.promotion.nowDate < data.promotion.bookingStartTime
        || data.promotion.nowDate > data.promotion.bookingEndTime)
      && data.inventory == 0) ||
    ((data.promotion.promotionType != 31
      && data.promotion.promotionType != 30
      && data.promotion.promotionType != 28) && data.showOnly == 0 && data.inventory == 0) ||
    (data.showOnly == 0 && data.promotion.promotionType == 30
      && data.promotion.remainingStock == 0 && data.inventory == 0) ||
    (data.showOnly == 0 && data.promotion.promotionType == 28
      && (data.promotion.endTime < data.promotion.nowDate || data.promotion.bookingStartTime > data.promotion.nowDate)
      && data.inventory == 0) ||
    (data.showOnly == 0 && data.promotion.promotionType == 31
      && data.promotion.nowDate < data.promotion.startTime && data.inventory == 0);
  // groupEnd 已结束
  const groupEnd = (data.promotion.promotionType == 28) &&
    (data.promotion.bookingEndTime < data.promotion.nowDate) &&
    (data.promotion.nowDate < data.promotion.endTime);
  // groupNoStock 已抢完
  const groupNoStock = (data.promotion.promotionType == 28) &&
    (data.promotion.remainingStock == 0) &&
    (data.promotion.bookingEndTime > data.promotion.nowDate
      && data.promotion.bookingStartTime < data.promotion.nowDate);
  // groupBook 支付定金 拼团
  const groupBook = (data.promotion.promotionType == 28) &&
    (data.promotion.remainingStock > 0) &&
    (data.promotion.bookingStartTime < data.promotion.nowDate) &&
    (data.promotion.bookingEndTime > data.promotion.nowDate);
  // addcart 加入购物车
  const addCart = data.showOnly == 0 &&
    ((data.promotion.promotionType != 31
      && data.promotion.promotionType != 30
      && data.promotion.promotionType != 28
      && data.inventory > 0) ||
      (data.promotion.promotionType == 31 && data.promotion.remainingStock == 0 && data.inventory > 0) ||
      (data.promotion.promotionType == 31 && data.promotion.nowDate < data.promotion.startTime && data.inventory > 0) ||
      (data.promotion.promotionType == 30 && data.promotion.remainingStock == 0 && data.inventory > 0) ||
      (data.promotion.promotionType == 30
        && data.promotion.nowDate < data.promotion.bookingStartTime && data.inventory > 0) ||
      (data.promotion.promotionType == 30
        && data.promotion.nowDate > data.promotion.bookingEndTime && data.inventory > 0) ||
      (data.promotion.promotionType == 30 && data.promotion.bookingStatus == 2) ||
      (data.promotion.promotionType == 28
        && data.promotion.nowDate < data.promotion.bookingStartTime && data.inventory > 0) ||
      (data.promotion.promotionType == 28 && data.promotion.nowDate > data.promotion.endTime && data.inventory > 0)
    );

  console.log('isBuyNow--------', isBuyNow);
  console.log('nostart---------', nostart);
  console.log('noStock---------', noStock);
  console.log('addCart---------', addCart);
  console.log('canBook---------', canBook);
  console.log('noBook----------', noBook);
  console.log('groupEnd--------', groupEnd);
  console.log('groupNoStock----', groupNoStock);
  console.log('groupBook----', groupBook);

  data.footerStatus = {
    isBuyNow,
    nostart,
    noStock,
    addCart,
    canBook,
    noBook,
    groupEnd,
    groupNoStock,
    groupBook
  };


  return data;
}

function ShopGoods(state = initialState, action) {
  let result = null;
  console.log(123123123, action);
  switch (action.type) {
    case ACTION_TYPES.SHOPGOODS_ALL:
      console.log('---------------------------1111111111', action.data);
      result = Object.assign({}, state, {
        shopGoodsData: initShopGoods(action.data) || {}
      });
      break;
    case ACTION_TYPES.MSHOP_ALL:
      result = Object.assign({}, state, {
        mShopData: action.data || {}
      });
      break;
    case ACTION_TYPES.FLAGSHOP_ALL:
      result = Object.assign({}, state, {
        flagShopData: action.data || {}
      });
      break;
    case ACTION_TYPES.ADD_CART:
      result = Object.assign({}, state, {
        addCartData: action.data || {}
      });
      break;
    case ACTION_TYPES.GET_SHOPCARTNUM:
      result = Object.assign({}, state, {
        shopCartNumData: action.data || {}
      });
      break;
    case ACTION_TYPES.NO_SHOPGOODS:
      result = state;
      Toast.offline('商品已下架!');
      break;
    case ACTION_TYPES.GET_SERVERTIME:
      result = Object.assign({}, state, {
        serverTimeData: action.data || {}
      });
      break;
    default:
      result = state;
  }
  return result;
}
export default ShopGoods;
