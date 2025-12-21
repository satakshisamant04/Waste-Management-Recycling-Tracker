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

exports.getEnvironmentalStats = async (req, res) => {
  try {
    const waste = await Waste.find({ recycled: true });

    let recycledWaste = 0;

    waste.forEach((w) => {
      recycledWaste += w.quantity;
    });

    const co2Saved = recycledWaste * 1.7;
    const treesEquivalent = co2Saved / 21;
    const carsOffRoad = co2Saved / 4600; // 🚗 avg yearly CO2 per car

    res.json({
      recycledWaste,
      co2Saved: Number(co2Saved.toFixed(2)),
      treesEquivalent: Math.floor(treesEquivalent),
      carsOffRoad: Number(carsOffRoad.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch impact stats" });
  }
};
