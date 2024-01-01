import React from "react";
import "./topNav.css";

const TopNav = ({ onToggleSidebar }) => {
  return (
    <nav className="navbar navbar-dark bg-dark navbar-fixed-top shadow">
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#sidebar"
        aria-controls="sidebar"
        aria-expanded="false"
        aria-label="Toggle Sidebar"
        onClick={onToggleSidebar}
        style={{ marginLeft: "10px" }}
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <span className="navbar-brand">ERP App</span>
    </nav>
  );
};

export default TopNav;
