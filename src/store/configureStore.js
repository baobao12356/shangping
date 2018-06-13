import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import dataMidCore from '../core/data.mid.core';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// 调用日志打印方法
const logger = createLogger({
  diff: false
});
const middleware = process.env.NODE_ENV === 'production' ? [thunk] : [thunk, dataMidCore, logger];

export default createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware))
);
