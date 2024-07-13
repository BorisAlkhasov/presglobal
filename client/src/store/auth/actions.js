import { serverUrl, localFields } from '@/utils/constants';

export default {
  login(context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'login',
    });
  },
  signup(context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'register',
    });
  },
  logout(context) {
    localStorage.removeItem(localFields.token);
    localStorage.removeItem(localFields.idNumber);
    localStorage.removeItem(localFields.empId);
    context.commit('setUser', {
      token: null,
      idNumber: null,
      empId: null,
      isLoggedIn: false,
    });
  },
  tryLogin(context) {
    const token = localStorage.getItem(localFields.token);
    const idNumber = localStorage.getItem(localFields.idNumber);
    const empId = localStorage.getItem(localFields.empId);

    if (token && idNumber && empId) {
      context.commit('setUser', {
        token: token,
        idNumber: idNumber,
        empId: empId,
        isLoggedIn: true,
      });
    }
  },
  async auth(context, payload) {
    const mode = payload.mode;
    let response = null;

    try {
      response = await fetch(`${serverUrl}/auth/${mode}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          idNumber: payload.idNumber,
          password: payload.password,
        }),
      });
    } catch (error) {
      throw new Error('Unable to connect ot server.');
    }

    const resData = await response.json();

    if (!response.ok) {
      console.error(resData);
      throw new Error(resData.error || `Unable to ${mode}. Please try again later.`);
    }

    localStorage.setItem(localFields.token, resData.token);
    localStorage.setItem(localFields.empId, resData.empId);
    localStorage.setItem(localFields.idNumber, payload.idNumber);

    context.commit('setUser', {
      token: resData.idToken,
      empId: resData.empId,
      idNumber: payload.idNumber,
      isLoggedIn: true,
    });
  },
};
