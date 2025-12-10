// backend/models/Match.js
const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    userA: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userB: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    score: { type: Number, required: true }, // 0–100
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Prevent duplicate match pairs
matchSchema.index({ userA: 1, userB: 1 }, { unique: true });

module.exports = mongoose.model("Match", matchSchema);
