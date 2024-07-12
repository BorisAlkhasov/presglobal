import { sendGetRequest, sendPostRequest } from '@/utils/helpers';
import { serverUrl, localFields } from '@/utils/constants';

export default {
  setPeriod(context, payload) {
    context.commit('setPeriod', payload);
    context.dispatch('fetchShifts');
  },
  async startBreak(context) {
    const empId = localStorage.getItem(localFields.empId);
    await sendPostRequest(`${serverUrl}/shift/startbreak`, { employee_id: empId });
    context.dispatch('fetchShifts');
  },
  async endBreak(context) {
    const empId = localStorage.getItem(localFields.empId);
    await sendPostRequest(`${serverUrl}/shift/endbreak`, { employee_id: empId });
    context.dispatch('fetchShifts');
  },
  async startShift(context) {
    const empId = localStorage.getItem(localFields.empId);
    await sendPostRequest(`${serverUrl}/shift/start`, { employee_id: empId });
    context.dispatch('fetchShifts');
  },
  async endShift(context) {
    const empId = localStorage.getItem(localFields.empId);
    await sendPostRequest(`${serverUrl}/shift/end`, { employee_id: empId });
    context.dispatch('fetchShifts');
  },
  async addComment(context, payload) {
    const { shift_id, comment } = payload;
    console.log(comment);
    await sendPostRequest(`${serverUrl}/shift/comment`, { shift_id, comment });
    context.dispatch('fetchShifts');
  },
  async fetchShifts(context) {
    const period = context.state.period;
    const empId = localStorage.getItem(localFields.empId);
    const shifts = await sendGetRequest(`${serverUrl}/shift/get?employee_id=${empId}&period=${period}`);
    context.commit('setShifts', {
      is_on_shift: shifts.is_on_shift,
      is_on_break: shifts.is_on_break,
      shifts: shifts.shifts,
    });
  },
};
