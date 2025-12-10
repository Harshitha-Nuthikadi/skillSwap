// frontend/src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import API from "../api";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [skillsKnow, setSkillsKnow] = useState("");
  const [skillsWant, setSkillsWant] = useState("");
  const [learningStyle, setLearningStyle] = useState("");
  const [bio, setBio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await API.get("/users/me");
        setUser(res.data);
        setSkillsKnow((res.data.skillsKnow || []).join(", "));
        setSkillsWant((res.data.skillsWant || []).join(", "));
        setLearningStyle(res.data.learningStyle || "");
        setBio(res.data.bio || "");
        setLinkedin(res.data.linkedin || "");
      } catch (err) {
        setMsg("Failed to load profile");
      }
    };
    fetchMe();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await API.put("/users/me", {
        skillsKnow: skillsKnow
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        skillsWant: skillsWant
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        learningStyle,
        bio,
        linkedin,
      });
      setUser(res.data);
      setMsg("Profile updated");
    } catch (err) {
      setMsg("Update failed");
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2 className="card-title">My Profile</h2>
        {msg && <p className="message">{msg}</p>}

        {user && (
          <div className="profile-header">
            <div>
              <div className="profile-name">{user.name}</div>
              <div className="profile-email">{user.email}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="form">
          <label className="label">Skills I can teach (comma separated)</label>
          <input
            className="input"
            value={skillsKnow}
            onChange={(e) => setSkillsKnow(e.target.value)}
          />

          <label className="label">
            Skills I want to learn (comma separated)
          </label>
          <input
            className="input"
            value={skillsWant}
            onChange={(e) => setSkillsWant(e.target.value)}
          />

          <label className="label">Learning style</label>
          <select
            className="input"
            value={learningStyle}
            onChange={(e) => setLearningStyle(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="visual">Visual</option>
            <option value="hands-on">Hands-on</option>
            <option value="theory">Theory</option>
            <option value="mixed">Mixed</option>
          </select>

          <label className="label">Short bio</label>
          <textarea
            className="textarea"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
          />

          <label className="label">LinkedIn Profile URL</label>
          <input
            className="input"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="https://www.linkedin.com/in/your-profile"
          />

          <button type="submit" className="btn primary">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
