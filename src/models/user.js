export default {
  namespace: 'user',

  state: {
    favoriteControllers: [],
    favoriteResults: [],
    seenResults: [],
    // user: {},
  },

  effects: {
    // *loadUser({ payload }, { put }) {
    //   yield put({
    //     type: 'modifyUser',
    //     payload,
    //   });
    // },
    // *logoutUser({ put }) {
    //   yield put({
    //     type: 'removeUser',
    //   });
    // },
    *favoriteController({ payload }, { put }) {
      yield put({
        type: 'modifyFavoritedControllers',
        payload,
      });
    },
    *removeControllerFromFavorites({ payload }, { put }) {
      yield put({
        type: 'removeFavoriteController',
        payload,
      });
    },
    *favoriteResult({ payload }, { put }) {
      yield put({
        type: 'modifyFavoritedResults',
        payload,
      });
    },
    *markResultSeen({ payload }, { put }) {
      yield put({
        type: 'modifySeenResults',
        payload,
      });
    },
    *removeResultFromFavorites({ payload }, { put }) {
      yield put({
        type: 'removeFavoriteResult',
        payload,
      });
    },
    *removeResultFromSeen({ payload }, { put }) {
      yield put({
        type: 'removeSeenResults',
        payload,
      });
    },
  },

  reducers: {
    // modifyUser(state, { payload }) {
    //   return {
    //     ...state,
    //     user: payload,
    //   };
    // },
    // removeUser(state) {
    //   return {
    //     ...state,
    //     user: {},
    //   };
    // },
    modifyFavoritedControllers(state, { payload }) {
      return {
        ...state,
        favoriteControllers: [...state.favoriteControllers, payload],
      };
    },
    modifyFavoritedResults(state, { payload }) {
      return {
        ...state,
        favoriteResults: [...state.favoriteResults, payload],
      };
    },
    modifySeenResults(state, { payload }) {
      return {
        ...state,
        seenResults: [...state.seenResults, payload],
      };
    },
    removeFavoriteController(state, { payload }) {
      return {
        ...state,
        favoriteControllers: state.favoriteControllers.filter(item => item.key !== payload.key),
      };
    },
    removeFavoriteResult(state, { payload }) {
      return {
        ...state,
        favoriteResults: state.favoriteResults.filter(item => item.key !== payload.key),
      };
    },
    removeSeenResults(state, { payload }) {
      return {
        ...state,
        seenResults: state.seenResults.filter(item => item.key !== payload.key),
      };
    },
  },
};
