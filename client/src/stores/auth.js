import { defineStore } from "pinia";
import { authAPI } from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.isAdmin || false,
    currentUser: (state) => state.user,
  },

  actions: {
    async register(userData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authAPI.register(userData);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Registration failed.";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authAPI.login(credentials);
        const { token, user } = response.data.data;
        this.token = token;
        this.user = user;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Login failed.";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});
