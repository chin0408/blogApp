<template>
  <div class="auth-page">
    <div class="auth-form">
      <h1>🔐 Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>
      <p class="auth-link">
        Don't have an account? <router-link to="/register">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

export default {
  name: "Login",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const form = ref({ email: "", password: "" });
    const loading = ref(false);
    const error = ref(null);

    const handleLogin = async () => {
      loading.value = true;
      error.value = null;
      try {
        await authStore.login(form.value);
        router.push("/");
      } catch (err) {
        error.value = err.response?.data?.message || "Login failed.";
      } finally {
        loading.value = false;
      }
    };

    return { form, loading, error, handleLogin };
  },
};
</script>
