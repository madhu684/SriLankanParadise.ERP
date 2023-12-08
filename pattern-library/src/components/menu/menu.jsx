import "./menu.css";
import React from "react";
import { Navigate } from "react-router-dom";

function template() {
  const { activeModule, modules, isDropdownOpen, username } = this.state;
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-light"
      style={{ width: "280px", height: "100vh" }}
    >
      <a
        href="#"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
      >
        <svg className="bi me-2" width="40" height="32">
          <use xlinkHref="#bootstrap" />
        </svg>
        <span className="fs-4">Ayu ERP</span>
      </a>
      <hr />
      {/* <ul className="nav nav-pills flex-column mb-auto">
        {modules.map((module) => (
          <li className="nav-item" key={module.id}>
            <a
              href="#"
              //   className="nav-link link-dark"
              className={`nav-link ${
                activeModule === module.id ? "active" : "link-dark"
              }`}
              onClick={() => this.handleModuleClick(module.id)}
            >
              {module.name}
            </a>
          </li>
        ))}
      </ul> */}
      <ul className="nav nav-pills flex-column mb-auto">
        {modules.map((module) => (
          <li className="nav-item" key={module.id}>
            <a
              href="#"
              className={`nav-link ${
                activeModule === module.id ? "active" : "link-dark"
              }`}
              onClick={() => this.handleModuleClick(module.id)}
              data-bs-toggle="collapse"
              data-bs-target={`#submodulesCollapse${module.id}`}
            >
              {module.name}
            </a>
            {module.submodules && module.submodules.length > 0 && (
              <div
                className={`collapse ${
                  activeModule === module.id ? "show" : ""
                }`}
                id={`submodulesCollapse${module.id}`}
              >
                <ul className="list-unstyled ">
                  {module.submodules.map((submodule) => (
                    <li key={submodule.id}>
                      <a href="#" className="nav-link link-dark">
                        {submodule.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>

      <hr />
      <div className={`nav-item dropdown ${isDropdownOpen ? "dropup" : ""}`}>
        <a
          href="#"
          className="d-flex align-items-center nav-link dropdown-toggle link-dark text-decoration-none"
          role="button"
          aria-expanded={isDropdownOpen}
          onClick={this.toggleDropdown}
        >
          <img
            src=""
            alt=""
            width="32"
            height="32"
            className="rounded-circle me-2"
          />
          <strong>{username}</strong>
        </a>
        <ul
          className={`dropdown-menu ${
            isDropdownOpen ? "dropup-position show" : ""
          } `}
        >
          <li>
            <a className="dropdown-item" href="#">
              New project...
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Settings
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Profile
            </a>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <a
              className="dropdown-item"
              href="#"
              onClick={(e) => {
                e.preventDefault(); // Prevent the default link behavior
                this.handleLogout();
              }}
            >
              Sign out
            </a>
            {/* Redirect to the /menu route */}
            {this.state.isLogout && <Navigate to="/login" replace={true} />}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default template;
