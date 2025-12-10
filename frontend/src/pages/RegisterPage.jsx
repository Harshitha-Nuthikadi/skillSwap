// frontend/src/pages/RegisterPage.jsx
import React, { useState } from "react";
import API from "../api";

const RegisterPage = ({ switchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await API.post("/auth/register", { name, email, password });
      setMsg("Registration successful. Please login.");
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "30px auto",border:".5 px solid whitesmoke",borderRadius:"10px", padding:"30px" ,borderStyle:"outset"}}>
      <h1 style={{color:"whitesmoke"}}>Register</h1>
      {msg && <p>{msg}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", marginBottom: "15px" ,borderRadius:"5px", height:"30px"}}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: "15px",borderRadius:"5px", height:"30px" }}
        />
        <input 
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "15px",borderRadius:"5px", height:"30px" }}
        />
        <button type="submit" style={{borderRadius:"5px", height:"30px", width:"80px"}}>Register</button>
      </form>
      <p style={{ marginTop: "10px" }}>
        Already have an account?{" "}
        <button type="button" style={{borderRadius:"5px", height:"40px",width:"100px"}} onClick={switchToLogin}>
          Login
        </button>
      </p>
    </div>
  );
};

export default RegisterPage;
