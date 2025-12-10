// frontend/src/pages/MatchSuggestionsPage.jsx
import React, { useEffect, useState } from "react";
import API from "../api";

const MatchSuggestionsPage = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      setMsg("");

      const res = await API.get("/matches/suggestions");
      setSuggestions(res.data || []);
    } catch (err) {
      console.error("Suggestions API error:", err);
      setSuggestions([]);
      setMsg(err.response?.data?.message || "Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const sendRequest = async (userId, score) => {
    try {
      await API.post("/matches/request", {
        targetUserId: userId,
        score,
      });
      alert("Request sent");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request");
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: "700px", margin: "30px auto" }}>
        <h2>Suggested Partners</h2>
        <p>Loading suggestions...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "30px auto" }}>
      <h2>Suggested Partners</h2>

      {msg && (
        <p style={{ color: "red", marginBottom: "10px" }}>
          {msg}
        </p>
      )}

      <button onClick={fetchSuggestions} style={{ marginBottom: "15px" }}>
        Reload Suggestions
      </button>

      {(!suggestions || suggestions.length === 0) && !msg && (
        <p>No suggestions yet.</p>
      )}

      {suggestions &&
        suggestions.length > 0 &&
        suggestions.map((s) => (
          <div
            key={s.user.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>{s.user.name}</h3>
            <p>
              <strong>Can teach:</strong>{" "}
              {s.user.skillsKnow && s.user.skillsKnow.length > 0
                ? s.user.skillsKnow.join(", ")
                : "-"}
            </p>
            <p>
              <strong>Wants to learn:</strong>{" "}
              {s.user.skillsWant && s.user.skillsWant.length > 0
                ? s.user.skillsWant.join(", ")
                : "-"}
            </p>
            <p>
              <strong>Learning style:</strong>{" "}
              {s.user.learningStyle || "-"}
            </p>
            <p>
              <strong>Bio:</strong> {s.user.bio || "-"}
            </p>
            <p>
              <strong>Score:</strong> {s.matchScore}{" "}
              (Skill: {s.skillScore}, Style: {s.styleScore}, Bio: {s.bioScore})
            </p>
            <button onClick={() => sendRequest(s.user.id, s.matchScore)}>
              Send Request
            </button>
          </div>
        ))}
    </div>
  );
};

export default MatchSuggestionsPage;
