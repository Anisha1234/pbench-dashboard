export default {
  namespace: 'user',

  state: {
    favoriteControllers: [],
    favoriteResults: [],
    seenControllers: [],
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
    *markControllerSeen({ payload }, { put }) {
      yield put({
        type: 'modifySeenControllers',
        payload,
      });
    },
    *removeResultFromFavorites({ payload }, { put }) {
      yield put({
        type: 'removeFavoriteResult',
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
    modifySeenControllers(state, { payload }) {
      return {
        ...state,
        seenResults: [...state.seenControllers, payload],
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
  },
};
