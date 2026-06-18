const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("../controllers/userController");
const { verifyToken } = require("../middleware/auth");

// POST /api/users/register - Register a new user
router.post("/register", register);

// POST /api/users/login - Login user
router.post("/login", login);

// GET /api/users/profile - Get user profile (protected)
router.get("/profile", verifyToken, getProfile);

module.exports = router;
