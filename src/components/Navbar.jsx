import React from "react";

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="nav-title">Blockchain Voting System</h1>
        <div className="nav-buttons">
          <button
            className={`nav-btn ${activeTab === "candidate" ? "active" : ""}`}
            onClick={() => setActiveTab("candidate")}
          >
            Candidates
          </button>
          <button
            className={`nav-btn ${activeTab === "voter" ? "active" : ""}`}
            onClick={() => setActiveTab("voter")}
          >
            Voter
          </button>
          <button
            className={`nav-btn ${activeTab === "admin" ? "active" : ""}`}
            onClick={() => setActiveTab("admin")}
          >
            Admin
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
