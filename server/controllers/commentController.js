const Comment = require("../models/Comment");
const Post = require("../models/Post");

// Add a comment to a post
const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required.",
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const comment = await Comment.create({
      content,
      author: req.user.id,
      post: postId,
    });

    await comment.populate("author", "username");

    res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding comment.",
      error: error.message,
    });
  }
};

// Get comments for a post
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching comments.",
      error: error.message,
    });
  }
};

// Delete a comment (only author of comment can delete)
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    // Only the comment author or admin can delete
    if (comment.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments.",
      });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting comment.",
      error: error.message,
    });
  }
};

module.exports = { addComment, getCommentsByPost, deleteComment };
