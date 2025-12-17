const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllUsers,
  getGlobalStats,
  getLeaderboard,
} = require("../controllers/adminController");

router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.get("/stats", authMiddleware, adminMiddleware, getGlobalStats);
router.get("/leaderboard", authMiddleware, adminMiddleware, getLeaderboard);

module.exports = router;
