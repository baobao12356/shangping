const defaultApiPath = '/api';

const METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};

const CONTENT_TYPE = {
  FORM_URLENCODE: 'application/x-www-form-urlencoded',
  FORM_DATA: 'application/formdata',
  JSON: 'application/json'
};

const CONTENT_TYPE_KEY = 'Content-Type';

/**
 * 转换JSON对象至参数
 *
 * @param {Object} params
 */
function convertJSONToParams(params = {}) {
  return Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
}

class BaseModelCore {
  constructor(uri) {
    const that = this;
    that.url = uri;
  }

  /**
   * 创建fetch参数
   *
   * @param {JSONObject} options
   */
  createOptions(options = {}) {
    let { data, headers, method } = options;
    data = data || {};
    headers = headers || {};
    method = method || METHOD.GET;

    let body = '';

    if (options.emulateJSON) {
      headers.contentType = CONTENT_TYPE.FORM_URLENCODE;
      body = convertJSONToParams(data);
    } else if (method == METHOD.POST ||
      method == METHOD.PUT ||
      method == METHOD.PATCH ||
      method == METHOD.DELETE) {
      // 仅仅支持json
      headers[CONTENT_TYPE_KEY] = CONTENT_TYPE.JSON;
      body = JSON.stringify((data || {}));
    }

    const retVal = {
      ...options,
      method,
      headers
    };

    if (method !== METHOD.GET) {
      retVal.body = body;
    }

    return retVal;
  }

  /**
   * 执行请求
   *  仅仅处理返回值为json的请求
   *
   * @param {Object} options
   * @return {Promise} {}
   */
  async execute(options = {}) {
    const that = this;
    let url = options._url || that.url;

    const tmpOptions = (Object.assign({}, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {},
      emulateJSON: false,
      showError: true,
      apiPath: defaultApiPath
    }, options));

    const _options = that.createOptions(tmpOptions);
    const { apiPath = defaultApiPath } = tmpOptions;  // eslint-disable-line no-unused-vars
    if (tmpOptions.method === METHOD.GET) {
      const param = convertJSONToParams(tmpOptions.data);
      url = param ? `${url}?${param}` : url;
    }

    const path = `${url}`.replace(/\/{2}/g, '/');
    console.log('path, _options', path, _options);
    const response = await fetch(path, _options);
    const { status, headers } = response;
    let result;
    if (status === 200) {
      if (headers.get(CONTENT_TYPE_KEY) &&
        headers.get(CONTENT_TYPE_KEY).toLowerCase().indexOf(CONTENT_TYPE.JSON) >= 0) {

        result = await response.json();
        console.log('response--------------',result);
      } else {
        // 返回JSON以外字符, 出错
        result = {
          code: 200501,
          message: '返回数据类型错误, 应该返回JSON格式数据, 请联系管理员!',
          type: 'ERROR_500'
        };
        return Promise.reject(result);
      }
    } else {
      // 异常处理
      result = {
        code: status
      };
      let tmpResult = {};
      switch (status) {
        case 401:
          tmpResult = {
            message: '请登录后再试.',
            type: 'ERROR_401'
          };
          break;
        default:
          tmpResult = {
            message: '服务端通信出错,请与管理员联系.',
            type: 'ERROR_500'
          };
      }
      Object.assign(result, tmpResult);
      return Promise.reject(result);
    }
    const tmpHeaders = {};
    // TODO: 待验证
    headers.forEach((header) => {
      const key = Object.keys(header)[0].replace(/[-]./g, $1 => $1.substring(1).toLocaleUpperCase());
      tmpHeaders[key] = Object.values(header)[0];
    });
    // for (const pair of headers.entries()) {
    //   const key = pair[0].replace(/[-]./g, $1 => $1.substring(1).toLocaleUpperCase());
    //   tmpHeaders[key] = pair[1];
    // }
    const ret = {
      ...result,
      result,
      response: {
        headers: tmpHeaders,
        headerDate: headers.get('Date'),
        status
        //TODO: 需要增加其他状态信息
      }
    };
    console.log('fetch result is', ret);
    return ret;
  }
}
class RestModelCore extends BaseModelCore {
  execute(options) {
    const that = this;
    const _options = Object.assign({
      data: {}
    }, options);
    if (_options.data.id) {
      _options._url = `${that.url}/${_options.data.id}`;
      delete _options.data.id;
    }
    return super.execute(_options);
  }

  /**
   * 查询
   *
   * @param params 参数
   * @param options 配置
   * @return {Promise}
   *
   */
  async get(params = {}, options = {}) {
    const that = this;
    const _options = Object.assign({},
      options,
      {
        method: METHOD.GET,
        data: params
      });
    return that.execute(_options);
  }

  /**
   *
   * 查询带翻页
   *
   * @param {JSONObject} condition
   * @param {int} page = 1
   * @param {int} rowCount = 10
   * @param {JSONObject} options 配置
   * @return {Promise}
   */
  async getWithPage(condition, page = 1, rowCount = 10, options) {
    const that = this;
    return that.get({
      page,
      rowCount,
      ...condition
    }, options);
  }

  /**
   * 新增
   *
   * @param params 参数
   * @param options 配置
   * @return {Promise}
   *
   */
  async post(params, options = {}) {
    const that = this;
    const _options = Object.assign({},
      options,
      {
        method: METHOD.POST,
        data: params
      });
    return that.execute(_options);
  }

  /**
   * 更新
   *
   * @param params 参数
   * @param options 配置
   * @return {Promise}
   *
   */
  async put(params, options = {}) {
    const that = this;
    const _options = Object.assign({},
      options,
      {
        method: METHOD.PUT,
        data: params
      });
    return that.execute(_options);
  }

  /**
   * 更新部分字段
   *
   * @param params 参数
   * @param options 配置
   * @return {Promise}
   *
   */
  async patch(params, options = {}) {
    const that = this;
    const _options = Object.assign({},
      options,
      {
        method: METHOD.PATCH,
        data: params
      });
    return that.execute(_options);
  }

  /**
   * 删除
   *
   * @param params 参数
   * @param options 配置
   * @return {Promise}
   *
   */
  async delete(params, options = {}) {
    const that = this;
    const _options = Object.assign({},
      options,
      {
        method: METHOD.DELETE,
        data: params
      });
    return that.execute(_options);
  }
}

class QueryModelCore extends BaseModelCore {
  /**
   * 查询Get方式
   *
   * @param params 参数
   * @param options 配置
   * @return {Promise}
   *
   */
  async get(params = {}, options = {}) {
    const _options = Object.assign({}, options, {
      method: METHOD.GET
    });

    if (params) {
      _options.data = params;
    }

    return super.execute(_options);
  }

  /**
   * 查询Post方式
   *
   * @param params 参数
   * @param options 配置
   * @return {Promise}
   *
   */
  async post(params = {}, options = {}) {
    const _options = Object.assign({}, options, {
      method: METHOD.POST
    });

    if (params) {
      _options.data = params;
    }
    return super.execute(_options);
  }
}

export const MAX_PAGE_COUNT = 100;
export const DEFAULT_PAGE_COUNT = 20;
class QueryPagableModelCore extends QueryModelCore {
  /**
   *
   * @param {string} url required 查询接口
   * @param {JSONObject} params 查询参数
   * @param {int} currentPage 当前页, 默认1
   * @param {int} pageSize 页面记录数, 默认10
   */
  constructor(url, params, currentPage = 1, pageSize = DEFAULT_PAGE_COUNT) {
    super(url);
    const that = this;
    that.params = params;
    that.currentPage = currentPage;
    that.totalPageSize = 0;
    that.nextPage = that.currentPage + 1;
    that.prevPage = that.currentPage - 1;
    if (that.prevPage < 1) {
      that.prevPage = 1;
    }
    // if <0的情况采用服务端默认pageCount
    // else 设置边界值
    if (pageSize == null || pageSize == undefined || pageSize < 0) {
      that.pageSize = -1;
    } else if (pageSize === 0) {
      that.pageSize = DEFAULT_PAGE_COUNT;
    } else if (pageSize > MAX_PAGE_COUNT) {
      that.pageSize = MAX_PAGE_COUNT;
    } else {
      that.pageSize = pageSize;
    }
  }

  async next() {
    const that = this;
    if (that.nextPage == 0) {
      return that.makeReturn();
    }
    const currentPage = that.currentPage;
    that.currentPage = currentPage + 1;
    // 超出范围
    if (that.currentPage >= that.totalPageSize) {
      that.currentPage = that.totalPageSize;
      that.nextPage = 0;
    } else {
      that.nextPage = that.currentPage + 1;
    }
    // 前一页
    that.prevPage = that.currentPage - 1;

    return that.query();
  }

  makeReturn(result = {}) {
    const dataMap = result.dataMap || {
      content: [],
      nextPage: 0,
      prevPage: 0,
      pageNo: 1,
      totalPageSize: 1
    };
    const retVal = {
      code: result.code || 200,
      message: result.message || '',
      dataMap: {
        ...dataMap
      }
    };
    return retVal;
  }

  async prev() {
    const that = this;
    if (that.prevPage == 0) {
      return that.makeReturn();
    }
    const currentPage = that.currentPage;
    that.currentPage = currentPage - 1;
    // 当前页,超出范围
    if (that.currentPage < 1) {
      that.prevPage = 0;
      that.currentPage = 1;
    } else {
      const prevPage = that.prevPage;
      that.prevPage = prevPage - 1;
    }
    // 下一页
    that.nextPage = that.currentPage + 1;
    if (that.nextPage > that.totalPageSize) {
      that.nextPage = that.totalPageSize;
    }
    return that.query();
  }

  async query() {
    const that = this;
    const data = {
      ...that.params,
      pageNo: that.currentPage
    };
    // const _options = Object.assign({}, {
    //   method: METHOD.GET,
    //   data
    // });
    const result = await super.get(data);
    const dataMap = result.dataMap;
    // 设置总页数
    that.totalPageSize = dataMap.totalPageSize;

    const retVal = {
      code: result.code,
      message: result.message,
      dataMap: {
        ...result.dataMap,
        nextPage: that.nextPage,
        prevPage: that.prevPage,
        totalPageSize: that.totalPageSize
      }
    };
    return retVal;
  }

  /**
   * 查询Get方式
   *
   * @param {int} paramPageNo required 当前页
   * @param {int} paramPageSize 每页显示记录数
   * @param {JSONObject} options 配置
   * @return {Promise} {
   *  {int} code
   *  {string} message
   *  {int} pageNo 当前页页码
   *  {int} totalSize 总记录数
   *  {int} totalPageSizeSize 总页数
   *  {int} nextPage 下一页页码
   *  {int} prevPage 前一页页码
   *  {Array} content 查询结果
   * }
   *
   */
  async get(paramPageNo, paramPageSize, options = {}) {
    const that = this;
    let pageNo = 1;
    let pageSize = -1;
    let nextPage = -1;
    let prevPage = -1;
    if (pageNo > 0) {
      pageNo = paramPageNo || 1;
    }
    // <0的情况采用服务端默认pageCount
    if (paramPageSize == null || paramPageSize == undefined || paramPageSize < 0) {
      pageSize = -1;
    } else {
      pageSize = paramPageSize;
    }
    if (pageSize === 0) {
      pageSize = DEFAULT_PAGE_COUNT;
    } else if (pageSize > MAX_PAGE_COUNT) {
      pageSize = MAX_PAGE_COUNT;
    }

    const data = {
      ...that.params,
      pageNo
    };

    if (pageSize !== -1) {
      data.pageSize = pageSize;
    }

    const _options = Object.assign({}, options, {
      method: METHOD.GET,
      data
    });

    const result = await super.execute(_options);
    let retVal = {};
    if (result.code == 200) {
      const dataMap = result.dataMap || {};
      let resPageNo = dataMap.pageNo;
      const totalPageSizeSize = dataMap.totalPageSizeSize;
      if (resPageNo > totalPageSizeSize) {
        resPageNo = totalPageSizeSize;
      }
      if (resPageNo > 0) {
        prevPage = resPageNo - 1;
        nextPage = resPageNo + 1;
      }
      if (prevPage <= 0) {
        prevPage = -1;
      }
      if (nextPage > totalPageSizeSize) {
        nextPage = -1;
      }
      retVal = {
        code: result.code,
        message: result.message,
        dataMap: {
          ...result.dataMap,
          nextPage,
          prevPage
        }
      };
    } else {
      retVal = {
        code: result.code,
        message: '',
        dataMap: {
          content: [],
          nextPage: -1,
          prevPage: -1,
          pageNo: 1,
          totalPageSizeSize: 1,
          totalSize: 0
        }
      };
    }
    return retVal;
  }
}

export { QueryModelCore, QueryPagableModelCore, METHOD };

export default RestModelCore;
