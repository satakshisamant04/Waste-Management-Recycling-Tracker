const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    points: {
      type: Number,
      default: 0,
    },
    monthlyGoal: {
  type: Number,
  default: 20, // kg
},
goalAchieved: {
  type: Boolean,
  default: false,
},

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
