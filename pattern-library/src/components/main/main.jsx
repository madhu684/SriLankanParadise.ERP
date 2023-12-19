import React from "react";
import "./main.css";
import useMain from "./useMain";
import TopNav from "../topNav/topNav";
import Menu from "../menu";
import DiscardConfirmationModal from "../discardConfirmationModal/discardConfirmationModal";

const Main = () => {
  const {
    toggleSidebar,
    isSidebarOpen,
    renderDetail,
    selectedSubmodule,
    handleSubmoduleClick,
    showDiscardConfirmation,
    setShowDiscardConfirmation,
    handleDiscard,
  } = useMain();
  return (
    <>
      {/* Sidebar menu */}
      <Menu
        isSidebarOpen={isSidebarOpen}
        onSubmoduleClick={handleSubmoduleClick}
        activeSubmodule={selectedSubmodule}
      />
      <div className={`container-main-wraper ${isSidebarOpen ? "open" : ""}`}>
        <div className="container-fluid">
          <div className="row">
            {/* Top navigation */}
            <TopNav onToggleSidebar={toggleSidebar} />
            <div className="col">
              {/* Main content */}
              <main>
                {renderDetail(selectedSubmodule)}
                {/* Render Discard Confirmation Modal */}
                {showDiscardConfirmation && (
                  <DiscardConfirmationModal
                    show={showDiscardConfirmation}
                    onHide={() => setShowDiscardConfirmation(false)}
                    onDiscard={handleDiscard}
                    title="Registration"
                  />
                )}
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
