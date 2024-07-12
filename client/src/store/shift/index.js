import actions from './actions';

export default {
  state() {
    return {
      isOnShift: false,
      isOnBreak: false,
      shifts: null,
      period: 'day',
    };
  },
  actions: actions,
  mutations: {
    setShifts(state, payload) {
      state.isOnBreak = payload.is_on_break;
      state.isOnShift = payload.is_on_shift;
      state.shifts = payload.shifts;
    },
    setPeriod(state, payload) {
      state.period = payload.period.toLowerCase();
    },
  },
  getters: {
    isOnBreak(state) {
      return state.isOnBreak;
    },
    isOnShift(state) {
      return state.isOnShift;
    },
    shifts(state) {
      return state.shifts;
    },
    period(state) {
      return state.period;
    },
  },
};
