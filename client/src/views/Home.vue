<template>
  <div class="home">
    <div class="hero-banner">
      <h1>📝 The Dev Blog</h1>
      <p>Stories, tutorials, and insights from the developer community.</p>
    </div>

    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search articles..."
      />
      <button>Search</button>
    </div>

    <p v-if="loading" style="text-align: center;">Loading posts...</p>
    <p v-if="error" class="error">{{ error }}</p>
    <div v-if="filteredPosts.length === 0 && !loading" class="empty">
      No posts found. Be the first to create one!
    </div>

    <div class="posts-grid">
      <div v-for="post in filteredPosts" :key="post._id" class="post-card">
        <div class="post-card-image">
          {{ getEmoji(post.title) }}
        </div>
        <div class="post-card-content">
          <span class="post-category">{{ getCategory(post.title) }}</span>
          <h2 v-html="post.title"></h2>
          <p class="post-author">By <strong>{{ post.author?.username }}</strong></p>
          <p class="post-meta">
            {{ formatDate(post.createdAt) }} &bull;
            {{ readTime(post.content) }} min read
          </p>
          <p class="post-excerpt">{{ stripHtml(post.content).substring(0, 120) }}...</p>
          <router-link :to="`/posts/${post._id}`" class="btn btn-primary">
            Read Article
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { postsAPI } from "../services/api";

export default {
  name: "Home",
  setup() {
    const posts = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const searchQuery = ref("");

    const filteredPosts = computed(() => {
      if (!searchQuery.value) return posts.value;
      const query = searchQuery.value.toLowerCase();
      return posts.value.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query)
      );
    });

    const fetchPosts = async () => {
      loading.value = true;
      try {
        const response = await postsAPI.getAll();
        posts.value = response.data.data;
      } catch (err) {
        error.value = "Failed to fetch posts.";
      } finally {
        loading.value = false;
      }
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const getEmoji = (title) => {
      const t = title.toLowerCase();
      if (t.includes("vue") || t.includes("frontend")) return "🖥️";
      if (t.includes("api") || t.includes("rest")) return "🔌";
      if (t.includes("mongo") || t.includes("database")) return "🗄️";
      if (t.includes("auth") || t.includes("jwt")) return "🔐";
      if (t.includes("mevn") || t.includes("stack")) return "🚀";
      return "📄";
    };

    const getCategory = (title) => {
      const t = title.toLowerCase();
      if (t.includes("vue") || t.includes("frontend")) return "Frontend";
      if (t.includes("api") || t.includes("rest")) return "Backend";
      if (t.includes("mongo") || t.includes("database")) return "Database";
      if (t.includes("auth") || t.includes("jwt")) return "Security";
      if (t.includes("mevn") || t.includes("stack")) return "Full Stack";
      return "General";
    };

    const stripHtml = (html) => {
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };

    const readTime = (content) => {
      const text = content.replace(/<[^>]*>/g, "");
      const words = text.split(/\s+/).filter((w) => w.length > 0).length;
      const minutes = Math.ceil(words / 200);
      return minutes < 1 ? 1 : minutes;
    };

    onMounted(fetchPosts);

    return {
      posts,
      filteredPosts,
      loading,
      error,
      searchQuery,
      formatDate,
      getEmoji,
      getCategory,
      stripHtml,
      readTime,
    };
  },
};
</script>
