<template>
  <div class="post-form-page">
    <div class="post-form">
      <h1>✏️ Edit Post</h1>
      <p v-if="loading && !form.title">Loading...</p>
      <form v-if="form.title" @submit.prevent="handleUpdate">
        <div class="form-group">
          <label>Title</label>
          <QuillEditor
            v-model:content="form.title"
            contentType="html"
            theme="snow"
            placeholder="Enter post title..."
            :toolbar="titleToolbar"
            style="min-height: 60px;"
          />
        </div>
        <div class="form-group">
          <label>Content</label>
          <QuillEditor
            v-model:content="form.content"
            contentType="html"
            theme="snow"
            placeholder="Write your blog post..."
            :toolbar="contentToolbar"
            style="min-height: 250px;"
          />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? "Updating..." : "Update Post" }}
        </button>
        <router-link to="/" class="btn btn-secondary">Cancel</router-link>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { postsAPI } from "../services/api";
import { useAuthStore } from "../stores/auth";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default {
  name: "EditPost",
  components: { QuillEditor },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const form = ref({ title: "", content: "" });
    const loading = ref(false);
    const error = ref(null);

    const titleToolbar = [
      ["bold", "italic", "underline"],
      [{ color: [] }],
    ];

    const contentToolbar = [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ];

    const fetchPost = async () => {
      // Redirect admin users - they can only delete posts
      if (authStore.isAdmin) {
        router.push("/");
        return;
      }

      loading.value = true;
      try {
        const response = await postsAPI.getById(route.params.id);
        form.value.title = response.data.data.title;
        form.value.content = response.data.data.content;
      } catch (err) {
        error.value = "Failed to load post.";
      } finally {
        loading.value = false;
      }
    };

    const handleUpdate = async () => {
      if (!form.value.title || form.value.title === "<p><br></p>") {
        error.value = "Title is required.";
        return;
      }
      if (!form.value.content || form.value.content === "<p><br></p>") {
        error.value = "Content is required.";
        return;
      }
      loading.value = true;
      error.value = null;
      try {
        await postsAPI.update(route.params.id, form.value);
        router.push(`/posts/${route.params.id}`);
      } catch (err) {
        error.value = err.response?.data?.message || "Failed to update post.";
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchPost);

    return { form, loading, error, handleUpdate, titleToolbar, contentToolbar };
  },
};
</script>
