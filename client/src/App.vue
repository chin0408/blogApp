<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">Dev Blog</router-link>
        <div class="nav-links">
          <router-link to="/">Blog</router-link>
          <template v-if="authStore.isAuthenticated">
            <router-link v-if="!authStore.isAdmin" to="/create">New Post</router-link>
            <span class="nav-user">Hi, {{ authStore.currentUser?.username }}</span>
            <button @click="logout" class="btn-logout">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login">Login</router-link>
            <router-link to="/register">Register</router-link>
          </template>
        </div>
      </div>
    </nav>
    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<script>
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";

export default {
  name: "App",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const logout = () => {
      authStore.logout();
      router.push("/");
    };

    return { authStore, logout };
  },
};
</script>
