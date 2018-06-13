function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }
    // 开始
    if (/START/.test(action.type)) {
      console.log('开始');
    }
    console.log('data.mid.core', action.type);
    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
