// frontend/src/pages/LoginPage.jsx
import React, { useState } from "react";
import API from "../api";

const LoginPage = ({ onLoginSuccess, switchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("skillswap_token", res.data.token);
      onLoginSuccess(res.data.user);
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed");
    }
  };

  return (
   
      <div className="auth-card">
        {/* LEFT SIDE */}
        <div className="auth-left">
          <div className="auth-badge">SkillSwap</div>
          <h1 className="auth-title">Welcome back!</h1>
          <p className="auth-subtitle">
            Match with learners who can teach what you want
            and learn what you already know.
          </p>
          <ul className="auth-points">
            <li> Skill exchange, not just chat</li>
            <li> Smart compatibility scoring</li>
            <li> Real connections via email / LinkedIn</li>
          </ul>
          <p className="auth-footer-text">
            “Learn faster by teaching and being taught.”
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <h2 className="auth-right-title">Login to your account</h2>
          <p className="auth-right-subtitle">
            Enter your details to continue.
          </p>

          {msg && <p className="message error">{msg}</p>}

          <form className="form" onSubmit={handleLogin}>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="btn primary full-width" type="submit">
              Login
            </button>
          </form>

          <p className="auth-switch">
            Don&apos;t have an account?{" "}
            <button className="link-btn" type="button" onClick={switchToRegister}>
              Register
            </button>
          </p>
        </div>
      </div>
    
  );
};

export default LoginPage;
