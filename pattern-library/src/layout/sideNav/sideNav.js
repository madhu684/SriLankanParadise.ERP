import React from "react";
import "./sideNav.css";

function SideNav({ options, selectedOption, onSelect }) {
  return (
    <div className="bg-light p-3" style={{ height: "100vh" }}>
      <a
        href="#"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
      >
        <svg className="bi me-2" width="40" height="32">
          <use xlinkHref="#bootstrap" />
        </svg>
        <span className="fs-4">ERP Admin</span>
      </a>
      <hr />
      <ul className="nav flex-column">
        {options.map((option) => (
          <li key={option} className="nav-item">
            <a
              href={`#${option.toLowerCase()}`} // Adjust the href as needed
              onClick={() => onSelect(option)}
              className={`nav-link nav-link-hover rounded ${
                selectedOption === option
                  ? "nav-link-active text-light"
                  : "text-dark"
              }`}
            >
              {option}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideNav;













