const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ==========================
// BADGE LOGIC
// ==========================
const getBadge = (points) => {
  if (points >= 100) return "🌍 Eco Hero";
  if (points >= 50) return "🌿 Eco Saver";
  return "🌱 Eco Beginner";
};

// ==========================
// GET USER PROFILE
// ==========================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.json({
      success: true,
      user: {
        ...user._doc,
        badge: getBadge(user.points),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// UPDATE USER PROFILE
// ==========================
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        points: user.points,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// CHANGE PASSWORD (FIXED)
// ==========================
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔴 MUST select password explicitly
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // ✅ DO NOT HASH HERE (model handles it)
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// UPDATE MONTHLY GOAL
// ==========================
exports.updateGoal = async (req, res) => {
  try {
    const { monthlyGoal } = req.body;

    const user = await User.findById(req.user._id);

    user.monthlyGoal = monthlyGoal;
    user.goalAchieved = false; // reset goal
    await user.save();

    res.json({
      success: true,
      message: "Goal updated",
      monthlyGoal,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update goal" });
  }
};
