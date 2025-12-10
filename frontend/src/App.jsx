// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import MatchSuggestionsPage from "./pages/MatchSuggestionsPage";
import MatchesPage from "./pages/MatchesPage";
import API from "./api";
import "./styles.css";   

const App = () => {
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState("login"); // "login" | "register"
  const [currentPage, setCurrentPage] = useState("profile"); // "profile" | "suggestions" | "matches"

  useEffect(() => {
    const token = localStorage.getItem("skillswap_token");
    if (token) {
      API.get("/users/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("skillswap_token");
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("skillswap_token");
    setUser(null);
    setCurrentPage("profile");
  };
if (!user) {
  return (
    <div className="auth-wrapper">
      {authView === "login" ? (
        <LoginPage
          onLoginSuccess={setUser}
          switchToRegister={() => setAuthView("register")}
        />
      ) : (
        <RegisterPage switchToLogin={() => setAuthView("login")} />
      )}
    </div>
  );
}

  return (
    <>
      <Navbar
        isLoggedIn={true}
        onLogout={handleLogout}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      {currentPage === "profile" && <ProfilePage />}
      {currentPage === "suggestions" && <MatchSuggestionsPage />}
      {currentPage === "matches" && <MatchesPage />}
    </>
  );
};

export default App;
