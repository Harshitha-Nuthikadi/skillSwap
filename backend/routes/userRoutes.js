// backend/routes/userRoutes.js
const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /api/users/me
router.get("/me", auth, async (req, res) => {
  res.json(req.user);
});

// PUT /api/users/me
router.put("/me", auth, async (req, res) => {
  try {
    const { skillsKnow, skillsWant, learningStyle, bio, linkedin } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      {
        skillsKnow: skillsKnow || [],
        skillsWant: skillsWant || [],
        learningStyle: learningStyle || "",
        bio: bio || "",
        linkedin: linkedin || "",
      },
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    console.error("Update user error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// DEBUG /all – you can delete later if you want
router.get("/all", async (req, res) => {
  try {
    const users = await User.find({});
    res.json({
      count: users.length,
      users: users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        skillsKnow: u.skillsKnow,
        skillsWant: u.skillsWant,
        learningStyle: u.learningStyle,
        bio: u.bio,
        linkedin: u.linkedin,
      })),
    });
  } catch (err) {
    console.error("Get all users error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
