const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getProfile, updateProfile, changePassword,updateGoal } = require("../controllers/userController");

// PROFILE ROUTE
router.get("/profile", authMiddleware, getProfile);
router.put("/update", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.put("/goal", authMiddleware, updateGoal);

module.exports = router;
