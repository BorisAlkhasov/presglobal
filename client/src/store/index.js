import { createStore } from 'vuex';
import authModule from './auth/index';
import shiftModule from './shift/index';
import exportModule from './export/index';

const store = createStore({
  modules: {
    auth: authModule,
    shift: shiftModule,
    export: exportModule,
  },
});

export default store;
