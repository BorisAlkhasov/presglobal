import { createRouter, createWebHistory } from 'vue-router';
import store from '../store/index.js';

import LoginPage from '@/pages/LoginPage.vue';
import MainPage from '@/pages/MainPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/auth', name: 'Auth', component: LoginPage },
    { path: '/main', name: 'Main', component: MainPage, meta: { requiresAuth: true } },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta?.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      next({ name: 'Auth' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
