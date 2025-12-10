// frontend/src/components/Navbar.jsx
import React from "react";

const Navbar = ({ onLogout, isLoggedIn, currentPage, setCurrentPage }) => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="logo">SkillSwap</span>
      </div>
      {isLoggedIn && (
        <div className="nav-center">
          <button
            className={
              currentPage === "profile" ? "nav-link active" : "nav-link"
            }
            onClick={() => setCurrentPage("profile")}
          >
            Profile
          </button>
          <button
            className={
              currentPage === "suggestions" ? "nav-link active" : "nav-link"
            }
            onClick={() => setCurrentPage("suggestions")}
          >
            Suggestions
          </button>
          <button
            className={
              currentPage === "matches" ? "nav-link active" : "nav-link"
            }
            onClick={() => setCurrentPage("matches")}
          >
            Matches
          </button>
        </div>
      )}
      <div className="nav-right">
        {isLoggedIn && (
          <button className="btn small" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
