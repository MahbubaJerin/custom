import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignupView from "@/views/AuthView/SignupView.vue";
import LoginView from "@/views/AuthView/LoginView.vue";
import ProfileView from "@/views/AuthView/ProfileView.vue";
import PostUpView from "@/views/PostView/PostUpView.vue";
import ProfilePostView from "@/views/PostView/profilepostsView.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: PostUpView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/signup",
      name: "signup",
      component: SignupView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/account",
      name: "profile",
      component: ProfileView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/profile/:id",
      name: "profilePost",
      component: ProfilePostView,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

export default router;
