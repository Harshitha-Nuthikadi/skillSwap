// frontend/src/pages/MatchesPage.jsx
import React, { useEffect, useState } from "react";
import API from "../api";

const MatchesPage = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [connections, setConnections] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      setMsg("");

      const [reqRes, connRes] = await Promise.all([
        API.get("/matches/requests"),
        API.get("/matches/connections"),
      ]);

      setIncoming(reqRes.data.incoming || []);
      setOutgoing(reqRes.data.outgoing || []);
      setConnections(connRes.data || []);
    } catch (err) {
      console.error("Matches load error:", err);
      setMsg(err.response?.data?.message || "Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const respondToRequest = async (matchId, action) => {
    try {
      await API.post("/matches/respond", { matchId, action });
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update request");
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="card">
          <h2 className="card-title">My Matches</h2>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="card">
        <h2 className="card-title">My Matches</h2>
        {msg && <p className="message error">{msg}</p>}

        {/* Incoming Requests */}
        <section className="section">
          <h3 className="section-title">Requests for You</h3>
          {incoming.length === 0 && (
            <p className="section-empty">No incoming requests.</p>
          )}
          <div className="card-grid">
            {incoming.map((m) => (
              <div className="match-card" key={m.matchId}>
                <div className="match-header">
                  <h4>{m.user.name}</h4>
                  <span className="badge">Score: {m.score}</span>
                </div>
                <p className="muted">
                  Can teach:{" "}
                  {m.user.skillsKnow && m.user.skillsKnow.length > 0
                    ? m.user.skillsKnow.join(", ")
                    : "-"}
                </p>
                <p className="muted">
                  Wants to learn:{" "}
                  {m.user.skillsWant && m.user.skillsWant.length > 0
                    ? m.user.skillsWant.join(", ")
                    : "-"}
                </p>
                <p className="muted">Style: {m.user.learningStyle || "-"}</p>
                <p className="muted">Bio: {m.user.bio || "-"}</p>

                <div className="button-row">
                  <button
                    className="btn primary"
                    onClick={() => respondToRequest(m.matchId, "accept")}
                  >
                    Accept
                  </button>
                  <button
                    className="btn secondary"
                    onClick={() => respondToRequest(m.matchId, "reject")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Outgoing Requests */}
        <section className="section">
          <h3 className="section-title">Requests You Sent</h3>
          {outgoing.length === 0 && (
            <p className="section-empty">No outgoing requests.</p>
          )}
          <div className="card-grid">
            {outgoing.map((m) => (
              <div className="match-card" key={m.matchId}>
                <div className="match-header">
                  <h4>{m.user.name}</h4>
                  <span className="badge">Score: {m.score}</span>
                </div>
                <p className="muted">
                  Can teach:{" "}
                  {m.user.skillsKnow && m.user.skillsKnow.length > 0
                    ? m.user.skillsKnow.join(", ")
                    : "-"}
                </p>
                <p className="muted">
                  Wants to learn:{" "}
                  {m.user.skillsWant && m.user.skillsWant.length > 0
                    ? m.user.skillsWant.join(", ")
                    : "-"}
                </p>
                <p className="muted">Style: {m.user.learningStyle || "-"}</p>
                <p className="muted">Bio: {m.user.bio || "-"}</p>
                <p className="muted small">
                  Status: <strong>Pending</strong>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Accepted Connections */}
        <section className="section">
          <h3 className="section-title">Connections</h3>
          {connections.length === 0 && (
            <p className="section-empty">No connections yet.</p>
          )}
          <div className="card-grid">
            {connections.map((m) => (
              <div className="match-card" key={m.matchId}>
                <div className="match-header">
                  <h4>{m.user.name}</h4>
                  <span className="badge success">
                    Connected • Score {m.score}
                  </span>
                </div>
                <p className="muted">
                  Email:{" "}
                  <a href={`mailto:${m.user.email}`}>{m.user.email}</a>
                </p>
                <p className="muted">
                  LinkedIn:{" "}
                  {m.user.linkedin ? (
                    <a
                      href={m.user.linkedin}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View profile
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>
                <p className="muted">
                  Can teach:{" "}
                  {m.user.skillsKnow && m.user.skillsKnow.length > 0
                    ? m.user.skillsKnow.join(", ")
                    : "-"}
                </p>
                <p className="muted">
                  Wants to learn:{" "}
                  {m.user.skillsWant && m.user.skillsWant.length > 0
                    ? m.user.skillsWant.join(", ")
                    : "-"}
                </p>
                <p className="muted">Style: {m.user.learningStyle || "-"}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MatchesPage;
