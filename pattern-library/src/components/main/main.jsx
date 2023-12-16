import React from "react";
import "./main.css";
import useMain from "./useMain";
import TopNav from "../topNav/topNav";
import Menu from "../menu";

const Main = () => {
  const {
    toggleSidebar,
    isSidebarOpen,
    renderDetail,
    selectedSubmodule,
    handleSubmoduleClick,
  } = useMain();
  return (
    <>
      {/* Sidebar menu */}
      <Menu
        isSidebarOpen={isSidebarOpen}
        onSubmoduleClick={handleSubmoduleClick}
      />
      <div className={`container-main-wraper ${isSidebarOpen ? "open" : ""}`}>
        <div className="container-fluid">
          <div className="row">
            {/* Top navigation */}
            <TopNav onToggleSidebar={toggleSidebar} />
            <div className="col">
              {/* Main content */}
              <main>{renderDetail(selectedSubmodule)}</main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
