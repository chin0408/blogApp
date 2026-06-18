import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://blogapp-cnu1.onrender.com/api"
    : "/api",
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post("/users/register", data),
  login: (data) => api.post("/users/login", data),
  getProfile: () => api.get("/users/profile"),
};

// Posts API
export const postsAPI = {
  getAll: () => api.get("/posts"),
  getById: (id) => api.get(`/posts/${id}`),
  create: (data) => api.post("/posts", data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
};

// Comments API
export const commentsAPI = {
  getByPost: (postId) => api.get(`/comments/${postId}`),
  add: (postId, data) => api.post(`/comments/${postId}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
};

export default api;
