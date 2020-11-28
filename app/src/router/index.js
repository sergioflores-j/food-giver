import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import store from '../store/index';

Vue.use(VueRouter);

export const routes = [
  {
    path: '*',
    redirect: '/',
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: {
      requiresAuth: true,
    },
    component: () => import(/* webpackChunkName: "profile" */ '../views/Profile.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      noAuth: true,
    },
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    meta: {
      noAuth: true,
    },
    component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue'),
  },
  {
    path: '/donations',
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'Donations_list',
        component: () => import(/* webpackChunkName: "donation" */ '../views/Donation/DonationList.vue'),
      },
      {
        path: 'new',
        name: 'Donations_New',
        component: () => import(/* webpackChunkName: "donation" */ '../views/Donation/NewDonation.vue'),
      },
    ],
    component: () => import(/* webpackChunkName: "donation" */ '../views/Donation/Donation.vue'),
  },
  {
    path: '/select-donation',
    name: 'SelectDonation',
    meta: {
      requiresAuth: true,
    },
    component: () => import(/* webpackChunkName: "select_donation" */ '../views/SelectDonation.vue'),
  },
  {
    path: '/chat',
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'Chat_list',
        component: () => import(/* webpackChunkName: "chat" */ '../views/Chat/ChatList.vue'),
      },
      {
        path: ':chatId',
        name: 'Chat_screen',
        component: () => import(/* webpackChunkName: "chat" */ '../views/Chat/ChatRoom.vue'),
      },
    ],
    component: () => import(/* webpackChunkName: "chat" */ '../views/Chat/Chat.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isLoggedIn = store.getters['auth/isLoggedIn'];
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const noAuth = to.matched.some(record => record.meta.noAuth);

  if (noAuth && isLoggedIn)
    await store.dispatch('auth/logout');

  if (requiresAuth) {
    if (isLoggedIn) {
      next();
      return;
    }

    next('/login');
  }

  next();
});

export default router;
