import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import PostDetail from "../views/PostDetail.vue";
import CreatePost from "../views/CreatePost.vue";
import EditPost from "../views/EditPost.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/posts/:id", name: "PostDetail", component: PostDetail },
  {
    path: "/create",
    name: "CreatePost",
    component: CreatePost,
    meta: { requiresAuth: true },
  },
  {
    path: "/edit/:id",
    name: "EditPost",
    component: EditPost,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
});

export default router;
