import { get } from '../../services/user';

export const user = {
  namespaced: true,
  state: {
    status: '',
    user: {},
  },
  getters: {
    user: state => state.user,
  },
  actions: {
    async getUser({ commit }, { email }) {
      try {
        const res = await get(email);

        commit('user_success', { user: res });

        return user;
      } catch (err) {
        commit('user_error');
        throw err;
      }
    },
  },
  mutations: {
    user_success(state, { user: userObj }) {
      state.status = 'success';
      state.user = userObj;
    },
    user_error(state) {
      state.status = 'error';
    },
  },
};
