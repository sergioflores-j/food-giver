import axios from 'axios';
import { login } from '../../services/auth';

const cacheUser = JSON.parse(localStorage.getItem('user'));

export const auth = {
  namespaced: true,
  state: {
    token: localStorage.getItem('token'),
    user: cacheUser,
    status: '',
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
  },
  actions: {
    login({ commit }, { email, password }) {
      commit('auth_request');

      return login({ email, password })
        .then(({ user, token }) => {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          axios.defaults.headers.common.Authorization = token;
          commit('auth_success', { token, user });
          return user;
        },
        error => {
          commit('auth_error');
          localStorage.removeItem('token');
          return Promise.reject(error);
        });
    },
    logout({ commit }) {
      return new Promise(resolve => {
        commit('logout');

        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common.Authorization;
        resolve();
      });
    },
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading';
    },
    auth_success(state, { token, user }) {
      state.status = 'success';
      state.token = token;
      state.user = user;
    },
    auth_error(state) {
      state.status = 'error';
    },
    logout(state) {
      state.status = '';
      state.token = '';
    },
  },
};
