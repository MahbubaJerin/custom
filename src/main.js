import "./assets/main.css";
import { firebaseApp } from "./firebaseConfig";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { useCurrentUser, getCurrentUser } from "vuefire";
import { VueFire, VueFireFirestoreOptionsAPI, VueFireAuth } from "vuefire";

const app = createApp(App);
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireFirestoreOptionsAPI(), VueFireAuth()],
});

async function initializeApp() {
  const user = await getCurrentUser();
  if (user) {
    console.log("User is logged in");
    console.log(user);
  } else {
    console.log("User is not logged in");
  }

  // Move routing guard setup into the async function so it can use the user state properly
  router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    // Ensure user is fetched each time if needed or fetch here once and use closure to keep state
    if (requiresAuth && !user) {
      next("/login");
    } else {
      next();
    }
  });

  app.use(router);
  app.mount("#app");
}

// Call the initialize function to start the app
initializeApp().catch((error) => {
  console.error("Failed to initialize the app:", error);
});
