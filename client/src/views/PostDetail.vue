<template>
  <div class="post-detail">
    <p v-if="loading">Loading post...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="post">
      <div class="post-detail-header">
        <h1 class="post-title-styled" v-html="post.title"></h1>
        <p class="post-meta">
          {{ post.author?.username }} &bull;
          {{ formatDate(post.createdAt) }} &bull;
          {{ readTime(post.content) }} min read
        </p>
      </div>
      <div class="post-content" v-html="post.content"></div>

      <!-- Action buttons for author or admin -->
      <div
        v-if="
          authStore.isAuthenticated &&
          (authStore.currentUser?.id === post.author?._id || authStore.isAdmin)
        "
        class="post-actions"
      >
        <router-link
          v-if="authStore.currentUser?.id === post.author?._id"
          :to="`/edit/${post._id}`"
          class="btn btn-secondary"
        >
          Edit
        </router-link>
        <button @click="handleDelete" class="btn btn-danger">Delete</button>
      </div>

      <!-- Comments Section -->
      <div class="comments-section">
        <h3>Comments ({{ comments.length }})</h3>

        <!-- Add Comment form (not for admin) -->
        <form
          v-if="authStore.isAuthenticated && !authStore.isAdmin"
          @submit.prevent="handleAddComment"
          class="comment-form"
        >
          <textarea
            v-model="newComment"
            placeholder="Write a comment..."
            required
          ></textarea>
          <button type="submit" class="btn btn-primary">Add Comment</button>
        </form>
        <p v-else-if="!authStore.isAuthenticated" class="login-prompt">
          <router-link to="/login">Login</router-link> to add a comment.
        </p>

        <!-- Comments list -->
        <div v-for="comment in comments" :key="comment._id" class="comment">
          <p class="comment-author">
            <strong>{{ comment.author?.username }}</strong> -
            {{ formatDate(comment.createdAt) }}
          </p>
          <p>{{ comment.content }}</p>
          <button
            v-if="
              authStore.isAuthenticated &&
              (authStore.currentUser?.id === comment.author?._id ||
                authStore.isAdmin)
            "
            @click="handleDeleteComment(comment._id)"
            class="btn-sm btn-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <router-link to="/" class="btn btn-secondary back-link">
      &larr; Back to Posts
    </router-link>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { postsAPI, commentsAPI } from "../services/api";

export default {
  name: "PostDetail",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();

    const post = ref(null);
    const comments = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const newComment = ref("");

    const fetchPost = async () => {
      loading.value = true;
      try {
        const response = await postsAPI.getById(route.params.id);
        post.value = response.data.data;
        comments.value = response.data.data.comments || [];
      } catch (err) {
        error.value = "Failed to load post.";
      } finally {
        loading.value = false;
      }
    };

    const handleDelete = async () => {
      if (!confirm("Are you sure you want to delete this post?")) return;
      try {
        await postsAPI.delete(post.value._id);
        router.push("/");
      } catch (err) {
        error.value = "Failed to delete post.";
      }
    };

    const handleAddComment = async () => {
      try {
        const response = await commentsAPI.add(post.value._id, {
          content: newComment.value,
        });
        comments.value.unshift(response.data.data);
        newComment.value = "";
      } catch (err) {
        error.value = "Failed to add comment.";
      }
    };

    const handleDeleteComment = async (commentId) => {
      if (!confirm("Delete this comment?")) return;
      try {
        await commentsAPI.delete(commentId);
        comments.value = comments.value.filter((c) => c._id !== commentId);
      } catch (err) {
        error.value = "Failed to delete comment.";
      }
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const readTime = (content) => {
      const text = content.replace(/<[^>]*>/g, "");
      const words = text.split(/\s+/).filter((w) => w.length > 0).length;
      const minutes = Math.ceil(words / 200);
      return minutes < 1 ? 1 : minutes;
    };

    onMounted(fetchPost);

    return {
      post,
      comments,
      loading,
      error,
      newComment,
      authStore,
      handleDelete,
      handleAddComment,
      handleDeleteComment,
      formatDate,
      readTime,
    };
  },
};
</script>
