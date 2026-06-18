const express = require("express");
const router = express.Router();
const {
  addComment,
  getCommentsByPost,
  deleteComment,
} = require("../controllers/commentController");
const { verifyToken } = require("../middleware/auth");

// POST /api/comments/:postId - Add a comment to a post (protected)
router.post("/:postId", verifyToken, addComment);

// GET /api/comments/:postId - Get all comments for a post (public)
router.get("/:postId", getCommentsByPost);

// DELETE /api/comments/:id - Delete a comment (protected)
router.delete("/:id", verifyToken, deleteComment);

module.exports = router;
