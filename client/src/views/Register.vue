<template>
  <div class="auth-page">
    <div class="auth-form">
      <h1>✨ Register</h1>
      <form @submit.prevent="handleRegister">
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
          <label for="username">Username</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            placeholder="Choose a username"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Choose a password (min 6 chars)"
            required
            minlength="6"
          />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? "Registering..." : "Register" }}
        </button>
      </form>
      <p class="auth-link">
        Already have an account? <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

export default {
  name: "Register",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const form = ref({ email: "", username: "", password: "" });
    const loading = ref(false);
    const error = ref(null);
    const success = ref(null);

    const handleRegister = async () => {
      loading.value = true;
      error.value = null;
      success.value = null;
      try {
        await authStore.register(form.value);
        success.value = "Registration successful! Redirecting to login...";
        setTimeout(() => router.push("/login"), 1500);
      } catch (err) {
        error.value = err.response?.data?.message || "Registration failed.";
      } finally {
        loading.value = false;
      }
    };

    return { form, loading, error, success, handleRegister };
  },
};
</script>
