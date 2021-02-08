export default {
  namespace: 'privatedatastore',

  state: {
    privateControllers: [],
    selectedPrivateControllers: [],
  },

  effects: {
    *updatePrivateControllers({ payload }, { put }) {
      yield put({
        type: 'modifyPrivateControllers',
        payload,
      });
    },
    *updateSelectedPrivateController({ payload }, { put }) {
      yield put({
        type: 'modifySelectedPrivateController',
        payload,
      });
    },
  },

  reducers: {
    modifyPrivateControllers(state, { payload }) {
      return {
        ...state,
        privateControllers: payload,
      };
    },
    modifySelectedPrivateController(state, { payload }) {
      return {
        ...state,
        selectedPrivateController: payload,
      };
    },
  },
};
