const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  addWaste,
  getMyWaste,
  getWasteAnalytics,getRecentActivity
} = require("../controllers/wasteController");



// PROTECTED ROUTES
router.post("/add", authMiddleware, addWaste);
router.get("/my", authMiddleware, getMyWaste);
router.get("/analytics", authMiddleware, getWasteAnalytics);
router.get("/activity", authMiddleware, getRecentActivity);

module.exports = router;
