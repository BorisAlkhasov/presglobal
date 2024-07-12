import actions from './actions';

export default {
  state() {
    return {
      token: null,
      idNumber: null,
      empId: null,
      isLoggedIn: false,
    };
  },
  actions: actions,
  mutations: {
    setUser(state, payload) {
      state.token = payload.token;
      state.idNumber = payload.idNumber;
      state.empId = payload.empId;
      state.isLoggedIn = payload.isLoggedIn;
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.isLoggedIn;
    },
  },
};
