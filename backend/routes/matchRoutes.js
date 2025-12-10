const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");
const Match = require("../models/Match");
const { calcTotalMatchScore } = require("../utils/matchScore");

const router = express.Router();

// GET /api/matches/suggestions
router.get("/suggestions", auth, async (req, res) => {
  try {
    const currentUser = req.user;

    // Get all other users
    const allUsers = await User.find({ _id: { $ne: currentUser._id } });

    const suggestions = allUsers.map((u) => {
      const scores = calcTotalMatchScore(currentUser, u);
      return {
        user: {
          id: u._id,
          name: u.name,
          skillsKnow: u.skillsKnow || [],
          skillsWant: u.skillsWant || [],
          learningStyle: u.learningStyle || "",
          bio: u.bio || "",
        },
        matchScore: scores.total,
        skillScore: scores.skillScore,
        styleScore: scores.styleScore,
        bioScore: scores.bioScore,
      };
    });

    // sort by best score
    suggestions.sort((a, b) => b.matchScore - a.matchScore);

    console.log(
      "Suggestions:",
      suggestions.map((s) => ({
        name: s.user.name,
        matchScore: s.matchScore,
      }))
    );

    return res.json(suggestions);
  } catch (err) {
    console.error("Suggestions error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/matches/requests  -> pending incoming + outgoing
router.get("/requests", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const pendingMatches = await Match.find({
      status: "pending",
      $or: [{ userA: userId }, { userB: userId }],
    }).populate("userA userB", "name email linkedin skillsKnow skillsWant learningStyle bio");

    const incoming = [];
    const outgoing = [];

    pendingMatches.forEach((m) => {
      const isIncoming = String(m.userB._id) === String(userId);
      const otherUser = isIncoming ? m.userA : m.userB;

      const item = {
        matchId: m._id,
        user: {
          id: otherUser._id,
          name: otherUser.name,
          email: otherUser.email,
          linkedin: otherUser.linkedin,
          skillsKnow: otherUser.skillsKnow,
          skillsWant: otherUser.skillsWant,
          learningStyle: otherUser.learningStyle,
          bio: otherUser.bio,
        },
        score: m.score,
        createdAt: m.createdAt,
      };

      if (isIncoming) incoming.push(item);
      else outgoing.push(item);
    });

    res.json({ incoming, outgoing });
  } catch (err) {
    console.error("Requests error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/matches/connections  -> accepted matches with partner info
router.get("/connections", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const acceptedMatches = await Match.find({
      status: "accepted",
      $or: [{ userA: userId }, { userB: userId }],
    }).populate("userA userB", "name email linkedin skillsKnow skillsWant learningStyle bio");

    const connections = acceptedMatches.map((m) => {
      const isUserA = String(m.userA._id) === String(userId);
      const otherUser = isUserA ? m.userB : m.userA;

      return {
        matchId: m._id,
        user: {
          id: otherUser._id,
          name: otherUser.name,
          email: otherUser.email,
          linkedin: otherUser.linkedin,
          skillsKnow: otherUser.skillsKnow,
          skillsWant: otherUser.skillsWant,
          learningStyle: otherUser.learningStyle,
          bio: otherUser.bio,
        },
        score: m.score,
        createdAt: m.createdAt,
      };
    });

    res.json(connections);
  } catch (err) {
    console.error("Connections error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


// POST /api/matches/request
router.post("/request", auth, async (req, res) => {
  try {
    const { targetUserId, score } = req.body;
    if (!targetUserId) {
      return res.status(400).json({ message: "targetUserId is required" });
    }

    if (String(targetUserId) === String(req.user._id)) {
      return res.status(400).json({ message: "Cannot match with yourself" });
    }

    const existing = await Match.findOne({
      $or: [
        { userA: req.user._id, userB: targetUserId },
        { userA: targetUserId, userB: req.user._id },
      ],
    });

    if (existing) {
      return res.status(400).json({ message: "Match already exists" });
    }

    const match = await Match.create({
      userA: req.user._id,
      userB: targetUserId,
      score: score || 0,
      status: "pending",
    });

    return res.status(201).json(match);
  } catch (err) {
    console.error("Match request error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/matches/respond
router.post("/respond", auth, async (req, res) => {
  try {
    const { matchId, action } = req.body;
    if (!matchId || !action) {
      return res
        .status(400)
        .json({ message: "matchId and action are required" });
    }

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (
      String(match.userA) !== String(req.user._id) &&
      String(match.userB) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Not authorized for this match" });
    }

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    match.status = action === "accept" ? "accepted" : "rejected";
    await match.save();

    return res.json(match);
  } catch (err) {
    console.error("Match respond error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
