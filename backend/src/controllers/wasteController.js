const Waste = require("../models/Waste");
const User = require("../models/User");

// ADD WASTE
exports.addWaste = async (req, res) => {
  try {
    const { type, quantity, recycled } = req.body;

    if (!type || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const waste = await Waste.create({
      user: req.user._id,
      type,
      quantity,
      recycled,
    });

    // Reward points if recycled
    if (recycled) {
      req.user.points += 10;
      await req.user.save();
    }

    res.status(201).json({
      success: true,
      message: "Waste added successfully",
      waste,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET MY WASTE
exports.getMyWaste = async (req, res) => {
  try {
    const waste = await Waste.find({ user: req.user._id });
    res.json(waste);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET USER ANALYTICS
exports.getWasteAnalytics = async (req, res) => {
  try {
    const waste = await Waste.find({ user: req.user._id });

    let totalWaste = 0;
    let recycledWaste = 0;
    let typeStats = {};

    waste.forEach(item => {
      totalWaste += item.quantity;

      if (item.recycled) {
        recycledWaste += item.quantity;
      }

      if (!typeStats[item.type]) {
        typeStats[item.type] = 0;
      }
      typeStats[item.type] += item.quantity;
    });

    const recycledPercentage =
      totalWaste === 0 ? 0 : ((recycledWaste / totalWaste) * 100).toFixed(2);

    res.json({
      totalWaste,
      recycledWaste,
      recycledPercentage,
      typeStats,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET RECENT ACTIVITY
exports.getRecentActivity = async (req, res) => {
  try {
    const activities = await Waste.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    const formatted = activities.map((item) => ({
      id: item._id,
      message: item.recycled
        ? `♻️ You recycled ${item.quantity}kg of ${item.type}`
        : `🗑️ You added ${item.quantity}kg of ${item.type}`,
      date: item.createdAt,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
