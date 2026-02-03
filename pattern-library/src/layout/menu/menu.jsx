import React from "react";
import "./menu.css";
import userImage from "assets/images/person-circle.svg";
import CompanyImage from "assets/images/logo_small.png";
import useMenu from "./useMenu";

function Menu({
  isSidebarOpen: propSidebarOpen,
  isSmallScreen,
  onToggleSidebar,
}) {
  const {
    modules,
    activeModules,
    activeSubmodule,
    isDropdownOpen,
    username,
    companyName,
    companyLogoUrl,
    isSidebarOpen,
    handleModuleClick,
    handleSubmoduleClick,
    toggleDropdown,
    handleLogout,
  } = useMenu({
    isSidebarOpen: propSidebarOpen,
    isSmallScreen,
    onToggleSidebar,
  });

  return (
    <>
      <nav
        className={`bg-light menu ${isSidebarOpen ? "" : "d-none"} transition`}
      >
        <div
          className="d-flex flex-column flex-shrink-0 p-3 bg-light"
          style={{ height: "100vh" }}
        >
          <div className="container-fluid">
            <a
              href="#"
              className={`d-flex align-items-center ${
                isSmallScreen
                  ? "justify-content-between"
                  : "justify-content-center"
              } mb-0 mb-md-0 me-md-auto link-dark text-decoration-none`}
            >
              <img
                className="company-menu-logo"
                src={CompanyImage}
                alt="Company Logo"
              />
              {isSmallScreen && (
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={onToggleSidebar}
                />
              )}
            </a>
          </div>

          <hr />

          <div className="mb-auto overflow-y-auto">
            <ul className="nav flex-column mb-auto">
              {modules.map((module) => (
                <li className="nav-item" key={module.id}>
                  <a
                    href="#"
                    className={`nav-link nav-link-hover rounded ${
                      activeModules.includes(module.id)
                        ? "nav-link-active text-light"
                        : "text-dark"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleModuleClick(module.id);
                    }}
                    data-bs-toggle="collapse"
                    data-bs-target={`#submodulesCollapse${module.id}`}
                    aria-expanded={activeModules.includes(module.id)}
                  >
                    {module.name}
                  </a>

                  {module.submodules.length > 0 && (
                    <div
                      className={`collapse ${
                        activeModules.includes(module.id) ? "show" : ""
                      }`}
                      id={`submodulesCollapse${module.id}`}
                    >
                      <ul className="list-unstyled ps-2 submodule-list">
                        {module.submodules.map((submodule) => (
                          <li key={submodule.id}>
                            <a
                              href="#"
                              className="nav-link link-dark smaller-text"
                              onClick={(e) => {
                                e.preventDefault();
                                handleSubmoduleClick(module.id, submodule.name);
                              }}
                            >
                              <span
                                className={`p-1 nav-link-hover-lite rounded ${
                                  activeSubmodule === submodule.name
                                    ? "nav-link-active-small"
                                    : ""
                                }`}
                              >
                                {submodule.name}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <hr />

          <div
            className={`nav-item dropdown ${isDropdownOpen ? "dropup" : ""}`}
          >
            <a
              className="d-flex align-items-center nav-link dropdown-toggle link-dark text-decoration-none"
              role="button"
              aria-expanded={isDropdownOpen}
              onClick={toggleDropdown}
            >
              <img
                src={userImage}
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
              }`}
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
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                >
                  Sign out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isSidebarOpen && isSmallScreen && (
        <div className="overlay" onClick={onToggleSidebar}></div>
      )}
    </>
  );
}

export default Menu;













