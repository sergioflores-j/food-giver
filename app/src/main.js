import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

axios.interceptors.request.use(config => ({
  ...config,
  headers: {
    ...config.headers,
    Authorization: store.state.auth.token,
  },
}));

// Add a response interceptor
axios.interceptors.response.use(
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  response => response,
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  error => {
    console.log('error', error);
    const status = error.response?.status || error.status;
    if (status === 403 || status === 401) router.push('/login');
    // TODO: Maybe we can make a global toast with the error here...
    throw error;
  },
);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
