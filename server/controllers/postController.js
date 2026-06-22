const Post = require("../models/Post");
const Comment = require("../models/Comment");

// Create a new post (regular users only, not admin)
const createPost = async (req, res) => {
  try {
    // Admin can only delete posts, not create
    if (req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin users cannot create posts. Admin can only delete posts.",
      });
    }

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required.",
      });
    }

    const post = await Post.create({
      title,
      content,
      author: req.user.id,
    });

    await post.populate("author", "username email");

    res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating post.",
      error: error.message,
    });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching posts.",
      error: error.message,
    });
  }
};

// Get a single post
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username email"
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Get comments for this post
    const comments = await Comment.find({ post: req.params.id })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { ...post.toObject(), comments },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching post.",
      error: error.message,
    });
  }
};

// Update a post (only the author can update, admin cannot update)
const updatePost = async (req, res) => {
  try {
    // Admin can only delete posts, not update
    if (req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin users cannot update posts. Admin can only delete posts.",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Check if the user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own posts.",
      });
    }

    const { title, content } = req.body;
    post.title = title || post.title;
    post.content = content || post.content;
    post.updatedAt = Date.now();

    await post.save();
    await post.populate("author", "username email");

    res.status(200).json({
      success: true,
      message: "Post updated successfully.",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating post.",
      error: error.message,
    });
  }
};

// Delete a post (only author or admin can delete)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Check if user is the author OR an admin
    if (post.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own posts.",
      });
    }

    // Delete all comments associated with the post
    await Comment.deleteMany({ post: req.params.id });

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting post.",
      error: error.message,
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
