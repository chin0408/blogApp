const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const { verifyToken } = require("../middleware/auth");

// GET /api/posts - Get all posts (public)
router.get("/", getAllPosts);

// GET /api/posts/:id - Get a single post (public)
router.get("/:id", getPostById);

// POST /api/posts - Create a new post (protected)
router.post("/", verifyToken, createPost);

// PUT /api/posts/:id - Update a post (protected, author only)
router.put("/:id", verifyToken, updatePost);

// DELETE /api/posts/:id - Delete a post (protected, author or admin)
router.delete("/:id", verifyToken, deletePost);

module.exports = router;
