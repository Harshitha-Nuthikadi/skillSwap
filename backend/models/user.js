// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
    skillsKnow: [{ type: String, default: [] }],
    skillsWant: [{ type: String, default: [] }],
    learningStyle: {
      type: String,
      enum: ["visual", "hands-on", "theory", "mixed", ""],
      default: "",
    },
    bio: { type: String, maxlength: 300, default: "" },
    linkedin: { type: String, default: "" },   // ⭐ NEW
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
