import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {firebaseApp} from './firebaseConfig'
import { VueFire, VueFireFirestoreOptionsAPI, VueFireAuth } from "vuefire";
import { getCurrentUser } from 'vuefire'

const app = createApp(App)

app.use(VueFire, {
    firebaseApp,
    modules: [VueFireFirestoreOptionsAPI(), VueFireAuth()],
  });

  const user = await getCurrentUser();

  router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    if (requiresAuth && !user) {
      next("/login");
    } else {
      next();
    }
  });

app.use(router)

app.mount('#app')
