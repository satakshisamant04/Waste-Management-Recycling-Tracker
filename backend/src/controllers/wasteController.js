const Waste = require("../models/Waste");
const User = require("../models/User");

// ==========================
// ADD WASTE
// ==========================
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

// ==========================
// GET MY WASTE
// ==========================
exports.getMyWaste = async (req, res) => {
  try {
    const waste = await Waste.find({ user: req.user._id });
    res.json(waste);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// GET ANALYTICS (TIME-BASED + GOALS + ENV IMPACT)
// ==========================
exports.getWasteAnalytics = async (req, res) => {
  try {
    const { range } = req.query; // week | month | all
    const userId = req.user._id;

    let startDate = null;
    const now = new Date();

    if (range === "week") {
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    }

    if (range === "month") {
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 1);
    }

    const match = { user: userId };

    if (startDate) {
      match.createdAt = { $gte: startDate };
    }

    const waste = await Waste.find(match);

    let totalWaste = 0;
    let recycledWaste = 0;
    const typeStats = {};

    waste.forEach((w) => {
      totalWaste += w.quantity;

      if (w.recycled) {
        recycledWaste += w.quantity;
      }

      typeStats[w.type] =
        (typeStats[w.type] || 0) + w.quantity;
    });

    // 🎯 GOAL LOGIC
    let goalAchieved = false;
    const user = await User.findById(userId);

    if (
      user.monthlyGoal &&
      recycledWaste >= user.monthlyGoal &&
      !user.goalAchieved
    ) {
      user.goalAchieved = true;
      user.points += 50; // 🎁 bonus points
      await user.save();
      goalAchieved = true;
    }

    // 🌍 ENVIRONMENTAL IMPACT
    const co2Saved = recycledWaste * 1.7; // kg CO₂
    const treesEquivalent = co2Saved / 21;

    res.json({
      totalWaste,
      recycledWaste,
      typeStats,
      monthlyGoal: user.monthlyGoal,
      goalAchieved,
      co2Saved: Number(co2Saved.toFixed(2)),
      treesEquivalent: Math.floor(treesEquivalent),
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      message: "Failed to fetch analytics",
    });
  }
};
  
// ==========================
// GET RECENT ACTIVITY
// ==========================
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

// ==========================
// GET WASTE HISTORY
// ==========================
exports.getWasteHistory = async (req, res) => {
  try {
    const { type, recycled } = req.query;

    const filter = { user: req.user._id };

    if (type) {
      filter.type = type;
    }

    if (recycled !== undefined) {
      filter.recycled = recycled === "true";
    }

    const history = await Waste.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(history);
  } catch (error) {
    console.error("Waste history error:", error);
    res.status(500).json({
      message: "Failed to fetch waste history",
    });
  }
};

// ==========================
// EXPORT WASTE HISTORY AS CSV
// ==========================
exports.exportWasteCSV = async (req, res) => {
  try {
    const waste = await Waste.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    let csv = "Date,Type,Quantity (kg),Recycled\n";

    waste.forEach((w) => {
      csv += `${w.createdAt.toISOString()},${w.type},${w.quantity},${w.recycled}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("waste-report.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({
      message: "Failed to export report",
    });
  }
};

exports.getCommunityComparison = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all users waste stats
    const stats = await Waste.aggregate([
      {
        $group: {
          _id: "$user",
          totalWaste: { $sum: "$quantity" },
          recycledWaste: {
            $sum: {
              $cond: ["$recycled", "$quantity", 0],
            },
          },
        },
      },
      {
        $project: {
          recyclingRate: {
            $cond: [
              { $eq: ["$totalWaste", 0] },
              0,
              {
                $multiply: [
                  { $divide: ["$recycledWaste", "$totalWaste"] },
                  100,
                ],
              },
            ],
          },
        },
      },
    ]);

    const totalUsers = stats.length;

    const currentUser = stats.find(
      (u) => u._id.toString() === userId.toString()
    );

    const userRate = currentUser?.recyclingRate || 0;

    const communityAvg =
      stats.reduce((sum, u) => sum + u.recyclingRate, 0) /
      (totalUsers || 1);

    const usersBelow = stats.filter(
      (u) => u.recyclingRate < userRate
    ).length;

    const percentile =
      totalUsers > 0
        ? ((usersBelow / totalUsers) * 100).toFixed(0)
        : 0;

    res.json({
      userRate: userRate.toFixed(1),
      communityAvg: communityAvg.toFixed(1),
      percentile,
    });
  } catch (error) {
    console.error("Community comparison error:", error);
    res.status(500).json({ message: "Failed to fetch comparison" });
  }
};
