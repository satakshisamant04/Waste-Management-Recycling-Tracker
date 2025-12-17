const User = require("../models/User");
const Waste = require("../models/Waste");

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GLOBAL WASTE STATS
exports.getGlobalStats = async (req, res) => {
  try {
    const waste = await Waste.find();

    let totalWaste = 0;
    let recycledWaste = 0;

    waste.forEach((item) => {
      totalWaste += item.quantity;
      if (item.recycled) recycledWaste += item.quantity;
    });

    res.json({
      totalWaste,
      recycledWaste,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// LEADERBOARD (TOP RECYCLERS)
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ points: -1 })
      .limit(5)
      .select("name points");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
