import { createStore } from 'vuex';
import authModule from './auth/index';
import shiftModule from './shift/index';

const store = createStore({
  modules: {
    auth: authModule,
    shift: shiftModule,
  },
});

export default store;
