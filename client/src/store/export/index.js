import { serverUrl, localFields } from '@/utils/constants';

export default {
  state() {
    return {
      exportRoute: null,
    };
  },
  actions: {
    setRoute(context, payload) {
      const empId = localStorage.getItem(localFields.empId);
      const token = localStorage.getItem(localFields.token);
      const route = `${serverUrl}/export/${empId}/${payload.format}/${token}`;
      context.commit('setRoute', { route });
    },
  },
  mutations: {
    setRoute(state, payload) {
      state.exportRoute = payload.route;
    },
  },
  getters: {
    exportRoute(state) {
      return state.exportRoute;
    },
  },
};
