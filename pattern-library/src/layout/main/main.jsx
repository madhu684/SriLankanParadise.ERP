import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./main.css";
import TopNav from "layout/topNav/topNav";
import Menu from "layout/menu";

const Main = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setSidebarOpen(!isSmallScreen);
  }, [isSmallScreen]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Menu
        isSidebarOpen={isSidebarOpen}
        isSmallScreen={isSmallScreen}
        onToggleSidebar={toggleSidebar}
      />
      <div
        className={`container-main-wraper ${
          isSidebarOpen && !isSmallScreen ? "open" : ""
        }`}
      >
        <div className="container-fluid">
          <div className="row">
            <TopNav onToggleSidebar={toggleSidebar} />
            <div className="col">
              <main>
                {/* This will render the matched child route */}
                <Outlet />
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;













