const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  addWaste,
  getMyWaste,
  getWasteAnalytics,getRecentActivity, getWasteHistory, exportWasteCSV, getCommunityComparison
} = require("../controllers/wasteController");



// PROTECTED ROUTES
router.post("/add", authMiddleware, addWaste);
router.get("/my", authMiddleware, getMyWaste);
router.get("/analytics", authMiddleware, getWasteAnalytics);
router.get("/activity", authMiddleware, getRecentActivity);
router.get("/history", authMiddleware , getWasteHistory);
router.get("/export", authMiddleware, exportWasteCSV);
router.get("/community", authMiddleware,getCommunityComparison
);

module.exports = router;
