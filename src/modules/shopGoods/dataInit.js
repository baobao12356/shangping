import resizeImg from '../../common/js/resizeImg'

export default function dataInit(data) {
  // 价格显示priceShowType 2显示促销预定30  1显示促销31  0显示普通  -1不显示
  // 倒计时显示LimitedTimeType  true显示 false不显示
  //    爆款未开始状态  showOnly为1-->显示为爆款状态
  //    爆款未开始状态  showOnly为0-->显示为普通状态(无爆款价 无倒计时)
  let initData = JSON.parse(JSON.stringify(data))
  let goodsData = initData.dataMap
  // todo 防重复执行
  if(!!!goodsData){
    console.log('防止空')
    return false
  }else if(!!!goodsData.promotion){
    console.log('促销接口初始化失败');
    return false
  }
  // goodsData.onceOk='已执行'
  console.log(goodsData);
  console.log('dataInitdataInitdataInitdataInitdataInitdataInitdataInitdataInitdataInit');
  const config = {
    imgA: goodsData && goodsData.imgs.map((data) => {
      return resizeImg(data, 750, 750)
    }),
    imgToNative: goodsData && goodsData.imgs,
    imgUrl: 'imgUrl',
    linkUrl: 'linkUrl',
    linkType: 'linkType',
    autoplay: true,
    dots: true,
  };
  goodsData.config = config
  console.log('bbbbbbbbbbbbbb',goodsData.config);
  if (goodsData) {
    let data = []
    for (let key in goodsData.productColors) {
      data.push(goodsData.productColors[key] + ' / ')
    }
    if (data.length > 0) {
      data[data.length - 1] = data[data.length - 1].replace(/\//g, '')
    } else {
      data = null
    }
    let standards = '';
    for (let key in goodsData.productColorStandards) {
      const size = goodsData.productColorStandards[key][0].standard + '(' + goodsData.productColorStandards[key][0].standardUnit + ') / '
      if (standards.indexOf(size) < 0) {
        standards += size
      }
    }
    // goodsData.shopAddress=this.state.shopAddress
    // console.log('standards',standards)
    const colorsIndex = standards.lastIndexOf('\/')
    standards = standards.slice(0, colorsIndex)
    goodsData.standardShow = standards
    goodsData.colorShow = data
  }


  // todo 控制倒计时显示 价格状态显示
  let priceShowType
  let LimitedTimeType
  let log
  goodsData.aaaaa = 123
  goodsData.promotion.checkout = 2333
  // goodsData.promotion =1111111
  console.log(goodsData, 'goodsData')
  console.log(initData, 'initData')
  if (goodsData && goodsData.promotion.promotionType == 31 && goodsData.showOnly == 1 && goodsData.promotion.nowDate < goodsData.promotion.startTime) {
    // 活动未开始 线上不可售状态 按照未开始促销样式显示
    priceShowType = 1
    LimitedTimeType = true
    log = '爆款未开始 线上不可售状态 按照未开始促销样式显示'
  } else if (goodsData && goodsData.promotion.promotionType == 31 && goodsData.showOnly == 0 && goodsData.promotion.nowDate < goodsData.promotion.startTime) {
    // 活动未开始 线上可售状态  按照普通商品可售显示
    priceShowType = 0
    LimitedTimeType = false
    log = '爆款未开始 线上可售状态  按照普通商品可售显示'
  } else if (goodsData && goodsData.promotion.promotionType == null && goodsData.showOnly == 1) {
    // 普通商品 线上不可售
    priceShowType = -1
    LimitedTimeType = false
    log = '普通商品 线上不可售'
  } else if (goodsData && goodsData.promotion.promotionType == null && goodsData.showOnly == 0) {
    // 普通商品  线上可售
    priceShowType = 0
    LimitedTimeType = false
    log = '普通商品  线上可售'
  } else if (goodsData && goodsData.promotion.promotionType == 31 && goodsData.promotion.nowDate > goodsData.promotion.startTime && goodsData.promotion.nowDate < goodsData.promotion.endTime && goodsData.promotion.remainingStock > 0) {
    // 爆款进行中，有库存
    priceShowType = 1;
    LimitedTimeType = true;
    log = '爆款进行中，有库存'
  } else if (goodsData && goodsData.promotion.promotionType == 31 && goodsData.promotion.nowDate > goodsData.promotion.startTime && goodsData.promotion.nowDate < goodsData.promotion.endTime && goodsData.promotion.remainingStock == 0) {
    // 爆款进行中，无库存  线上可售，按照普通商品可售显示。线上不可售，按照促销已售罄状态显示
    if (goodsData.showOnly == 1) {
      priceShowType = 1;
      LimitedTimeType = true;
      log = '爆款进行中，无库存  线上不可售，按照促销已售罄状态显示'
    } else {
      priceShowType = 0;
      LimitedTimeType = false;
      log = '爆款进行中，无库存  线上可售，按照普通商品可售显示'
    }
  } else if (goodsData && goodsData.promotion.promotionType == 30 && goodsData.promotion.nowDate > goodsData.promotion.bookingStartTime && goodsData.promotion.nowDate < goodsData.promotion.bookingEndTime && goodsData.promotion.remainingStock == 0) {
    // 预定进行中，无库存  线上可售，按照普通商品可售显示。线上不可售，按照促销已售完状态显示
    if (goodsData.showOnly == 1) {
      priceShowType = 2;
      LimitedTimeType = true;
      log = '预定进行中，无库存  线上不可售，按照促销已售完状态显示'
    } else {
      priceShowType = 0;
      LimitedTimeType = false;
      log = '预定进行中，无库存  线上可售，按照普通商品可售显示。'
    }
  } else if (goodsData && goodsData.promotion.promotionType == 30 && goodsData.promotion.nowDate > goodsData.promotion.bookingStartTime && goodsData.promotion.nowDate < goodsData.promotion.bookingEndTime && goodsData.promotion.remainingStock > 0) {
    // 预定进行中，有库存
    priceShowType = 2;
    LimitedTimeType = true;
    log = '预定进行中，有库存'
  } else if (goodsData && goodsData.promotion.promotionType == 30 && goodsData.promotion.nowDate < goodsData.promotion.bookingStartTime) {
    // 预定未开始，线上可售，按照普通商品可售显示。线上不可售，按照促销已售完状态显示
    if (goodsData.showOnly == 1) {
      priceShowType = -1;
      LimitedTimeType = false;
      log = '预定未开始，线上不可售，按照促销已售完状态显示'
    } else {
      priceShowType = 0;
      LimitedTimeType = false;
      log = '预定未开始，线上可售，按照普通商品可售显示。'
    }
  }


  else if (goodsData && goodsData.promotion.promotionType == 28 && goodsData.promotion.nowDate > goodsData.promotion.bookingStartTime && goodsData.promotion.nowDate < goodsData.promotion.bookingEndTime && goodsData.promotion.remainingStock == 0) {
    // 拼团进行中，无库存  线上可售，按照普通商品可售显示。线上不可售，按照促销已售完状态显示
    if (goodsData.showOnly == 1) {
      priceShowType = 3;
      LimitedTimeType = true;
      log = '拼团进行中，无库存  线上不可售，按照促销已售完状态显示'
    } else {
      priceShowType = 3;
      LimitedTimeType = true;
      log = '拼团进行中，无库存  线上可售，按照普通商品可售显示。'
    }
  } else if (goodsData && goodsData.promotion.promotionType == 28 && goodsData.promotion.nowDate > goodsData.promotion.bookingStartTime && goodsData.promotion.nowDate < goodsData.promotion.bookingEndTime && goodsData.promotion.remainingStock > 0) {
    // 拼团进行中，有库存
    priceShowType = 3;
    LimitedTimeType = true;
    log = '拼团进行中，有库存'
  } else if (goodsData && goodsData.promotion.promotionType == 28 && goodsData.promotion.nowDate < goodsData.promotion.bookingStartTime) {
    // 拼团未开始，线上可售，按照普通商品可售显示。线上不可售，按照促销已售完状态显示
    if (goodsData.showOnly == 1) {
      priceShowType = -1;
      LimitedTimeType = false;
      log = '拼团未开始，线上不可售，按照普通商品不可售显示'
    } else {
      priceShowType = 0;
      LimitedTimeType = false;
      log = '拼团未开始，线上可售，按照普通商品可售显示。'
    }
  } else if (goodsData && goodsData.promotion.promotionType == 28 && goodsData.promotion.nowDate > goodsData.promotion.endTime) {
    // 拼团活动结束 倒计时才结束
    if (goodsData.showOnly == 1) {
      priceShowType = -1;
      LimitedTimeType = false;
      log = '拼团活动结束 倒计时才结束，线上不可售，按照普通商品不可售显示'
    } else {
      priceShowType = 0;
      LimitedTimeType = false;
      log = '拼团活动结束 倒计时才结束，线上可售，按照普通商品可售显示。'
    }
  } else if (goodsData && goodsData.promotion.promotionType == 28 && goodsData.promotion.nowDate > goodsData.promotion.bookingStartTime && goodsData.promotion.nowDate < goodsData.promotion.endTime) {
    // 拼团活动内结束 倒计时一直存在,价格一直显示为拼团状态
    priceShowType = 3;
    LimitedTimeType = true;
    log = '拼团活动内结束 倒计时一直存在,价格一直显示为拼团状态'
  }
  else {
    priceShowType = 0;
    LimitedTimeType = false
  }
  console.log(log, 'log');
  console.log(priceShowType, 'priceShowType');
  console.log(LimitedTimeType, 'LimitedTimeType');


  // goodsData.promotion.priceShowType = priceShowType
  // goodsData.promotion.LimitedTimeType = LimitedTimeType






  // todo 控制拼团进度状态
  let status;
  let groupDivPercentage;
  let groupStatus;
  let groupStatusColor;

  if (goodsData && goodsData.promotion.promotionType == 28) {
    status = Math.round(goodsData.promotion.offeredNumber / goodsData.promotion.numberConditions * 100);
    if (status > 100) {
      status = 100
    } else if (status < 1 && status != 0) {
      status = 1
    } else if (status > 99) {
      if (goodsData.promotion.numberConditions > goodsData.promotion.offeredNumber) {
        status = 99
      } else {
        status = 100
      }
    } else if (status == 0) {
      status = 0
    }
    goodsData.promotion.groupDivPercentage = status // > 1 ? status : 1
    groupDivPercentage = status
    if (goodsData.promotion.numberConditions > goodsData.promotion.offeredNumber && goodsData.promotion.bookingStatus == 1) {
      // 人数条件 > 已参团人数 且在预定时间内
      // goodsData.promotion.groupStatus = '拼团中' + status + '%'
      groupStatus = '拼团中' + status + '%'
    } else if (goodsData.promotion.numberConditions <= goodsData.promotion.offeredNumber) {
      // 人数条件 <= 已参团人数
      // goodsData.promotion.groupStatus = '已成团'
      groupStatus = '已成团'
    } else if (goodsData.promotion.nowDate > goodsData.promotion.bookingEndTime) {
      // 超出预定时间
      if (goodsData.promotion.numberConditions > goodsData.promotion.offeredNumber) {
        // goodsData.promotion.groupStatus = '拼团失败'
        groupStatus = '拼团失败'
        // goodsData.promotion.groupStatusColor = '#ff454a'
        groupStatusColor = '#ff454a'
      } else {
        // goodsData.promotion.groupStatus = '已成团'
        groupStatus = '已成团'
      }
    }
  }


  // todo 预定（28,30）情况下，总价
  let booktotalPrice
  if (goodsData.promotion.promotionType == 30 || goodsData.promotion.promotionType == 28) {
    // goodsData.promotion.booktotalPrice = (goodsData.promotion.skuPromotionPrice*1000000 + goodsData.promotion.bookingAmount*1000000)/1000000
    booktotalPrice = (goodsData.promotion.skuPromotionPrice*1000000 + goodsData.promotion.bookingAmount*1000000)/1000000
  }


  goodsData.customPromotion={
    LimitedTimeType,
    priceShowType,
    groupDivPercentage,
    groupStatusColor,
    groupStatus,
    booktotalPrice
  };

  // todo 控制footer状态
  // isBuyNow 立即购买
  const isBuyNow = (goodsData.promotion.promotionType == 31 ) &&
    (goodsData.promotion.endTime > goodsData.promotion.nowDate) &&
    (goodsData.promotion.remainingStock > 0) &&
    (goodsData.promotion.nowDate > goodsData.promotion.startTime);
  // nostart 未开始
  const nostart = (goodsData.showOnly == 1 ) &&
    (goodsData.promotion.promotionType == 31 ) &&
    (goodsData.promotion.nowDate < goodsData.promotion.startTime);
  // noStock 售罄-> 爆款，活动库存0，线上不可售，活动进行中；爆款，活动库存和库存均为0，线上可售，活动进行中
  const noStock = ((goodsData.showOnly == 1 ) &&
    (goodsData.promotion.promotionType == 31 ) &&
    (goodsData.promotion.endTime > goodsData.promotion.nowDate) &&
    (goodsData.promotion.remainingStock == 0)) ||
    (goodsData.showOnly == 0 &&
      goodsData.promotion.promotionType == 31 &&
      goodsData.promotion.endTime > goodsData.promotion.nowDate &&
      goodsData.promotion.remainingStock == 0 &&
      goodsData.inventory == 0);
  // canBook 支付定金
  const canBook = (goodsData.promotion.promotionType == 30 ) &&
    (goodsData.promotion.bookingEndTime > goodsData.promotion.nowDate) &&
    (goodsData.promotion.remainingStock > 0) &&
    (goodsData.promotion.nowDate > goodsData.promotion.bookingStartTime );
  // noBook 已售完
  const noBook = ((goodsData.showOnly == 1 && goodsData.promotion.promotionType == 30 ) && (goodsData.promotion.bookingEndTime > goodsData.promotion.nowDate) && (goodsData.promotion.remainingStock == 0) && (goodsData.promotion.nowDate > goodsData.promotion.bookingStartTime )) ||
    (goodsData.showOnly == 0 && goodsData.promotion.promotionType == 30 && (goodsData.promotion.nowDate < goodsData.promotion.bookingStartTime || goodsData.promotion.nowDate > goodsData.promotion.bookingEndTime) && goodsData.inventory == 0) ||
    ((goodsData.promotion.promotionType != 31 && goodsData.promotion.promotionType != 30 && goodsData.promotion.promotionType != 28) && goodsData.showOnly == 0 && goodsData.inventory == 0) ||
    (goodsData.showOnly == 0 && goodsData.promotion.promotionType == 30 && goodsData.promotion.remainingStock == 0 && goodsData.inventory == 0) ||
    (goodsData.showOnly == 0 && goodsData.promotion.promotionType == 28 && (goodsData.promotion.endTime < goodsData.promotion.nowDate || goodsData.promotion.bookingStartTime > goodsData.promotion.nowDate) && goodsData.inventory == 0) ||
    (goodsData.showOnly == 0 && goodsData.promotion.promotionType == 31 && goodsData.promotion.nowDate < goodsData.promotion.startTime && goodsData.inventory == 0);
  // groupEnd 已结束
  const groupEnd = (goodsData.promotion.promotionType == 28) &&
    (goodsData.promotion.bookingEndTime < goodsData.promotion.nowDate) &&
    (goodsData.promotion.nowDate < goodsData.promotion.endTime);
  // groupNoStock 已抢完
  const groupNoStock = (goodsData.promotion.promotionType == 28) &&
    (goodsData.promotion.remainingStock == 0) &&
    (goodsData.promotion.bookingEndTime > goodsData.promotion.nowDate && goodsData.promotion.bookingStartTime < goodsData.promotion.nowDate);
    // console.log(goodsData.showOnly != 1)
    // console.log(goodsData.promotion.promotionType == 31)
    // console.log(goodsData.promotion.nowDate)
    // console.log(goodsData.promotion.startTime)
    // console.log(goodsData.promotion.nowDate - goodsData.promotion.startTime)

  // groupBook 支付定金 拼团
  const groupBook = (goodsData.promotion.promotionType == 28) &&
    (goodsData.promotion.remainingStock > 0) &&
    (goodsData.promotion.bookingStartTime < goodsData.promotion.nowDate) &&
    (goodsData.promotion.bookingEndTime > goodsData.promotion.nowDate);

  // addcart 加入购物车
  const addCart = goodsData.showOnly == 0 &&
    ((goodsData.promotion.promotionType != 31 && goodsData.promotion.promotionType != 30 && goodsData.promotion.promotionType != 28 && goodsData.inventory > 0) ||
      (goodsData.promotion.promotionType == 31 && goodsData.promotion.remainingStock == 0 && goodsData.inventory > 0) ||
      (goodsData.promotion.promotionType == 31 && goodsData.promotion.nowDate < goodsData.promotion.startTime && goodsData.inventory > 0) ||
      (goodsData.promotion.promotionType == 30 && goodsData.promotion.remainingStock == 0 && goodsData.inventory > 0) ||
      (goodsData.promotion.promotionType == 30 && goodsData.promotion.nowDate < goodsData.promotion.bookingStartTime && goodsData.inventory > 0) ||
      (goodsData.promotion.promotionType == 30 && goodsData.promotion.nowDate > goodsData.promotion.bookingEndTime && goodsData.inventory > 0) ||
      (goodsData.promotion.promotionType == 30 && goodsData.promotion.bookingStatus == 2) ||
      (goodsData.promotion.promotionType == 28 && goodsData.promotion.nowDate < goodsData.promotion.bookingStartTime && goodsData.inventory > 0) ||
      (goodsData.promotion.promotionType == 28 && goodsData.promotion.nowDate > goodsData.promotion.endTime && goodsData.inventory > 0)
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
  goodsData.footerStatus = {
    isBuyNow: isBuyNow,
    nostart: nostart,
    noStock: noStock,
    addCart: addCart,
    canBook: canBook,
    noBook: noBook,
    groupEnd: groupEnd,
    groupNoStock: groupNoStock,
    groupBook: groupBook,
  }


  // initData.dataMap = goodsData
  console.log(initData, 'initData');
  console.log(goodsData, 'goodsData');
  console.log('dataInitdataInitdataInitdataInitdataInitdataInitdataInitdataInitdataInit');
  window.goodsData = goodsData;
  // sessionStorage.setItem('initData',initData)
  return initData
}

