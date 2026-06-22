<template>
  <div class="post-form-page">
    <div class="post-form">
      <h1>✍️ Create New Post</h1>
      <form @submit.prevent="handleCreate">
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
          {{ loading ? "Creating..." : "Create Post" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { postsAPI } from "../services/api";
import { useAuthStore } from "../stores/auth";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default {
  name: "CreatePost",
  components: { QuillEditor },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const form = ref({ title: "", content: "" });
    const loading = ref(false);
    const error = ref(null);

    // Redirect admin users - they can only delete posts
    onMounted(() => {
      if (authStore.isAdmin) {
        router.push("/");
      }
    });

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

    const handleCreate = async () => {
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
        await postsAPI.create(form.value);
        router.push("/");
      } catch (err) {
        error.value = err.response?.data?.message || "Failed to create post.";
      } finally {
        loading.value = false;
      }
    };

    return { form, loading, error, handleCreate, titleToolbar, contentToolbar };
  },
};
</script>
