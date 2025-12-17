const mongoose = require("mongoose");

const WasteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true, // plastic, organic, e-waste
    },
    quantity: {
      type: Number,
      required: true, // in kg
    },
    recycled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Waste", WasteSchema);
