import React from "react";
import "./topNav.css";
import CashierSession from "../cashierSession/cashierSession";
import CashierSessionUpdate from "../cashierSession/cashierSessionUpdate/cashierSessionUpdate";
import { useState, useEffect } from "react";

const TopNav = ({ onToggleSidebar }) => {
  const [showCashierSessionModal, setShowCashierSessionModal] = useState(false);
  const [showCashierSessionModalInParent, setshowCashierSessionModalInParent] =
    useState(false);
  const [isCashierSessionOpen, setIsCashierSessionOpen] = useState(false);
  const [currentCashierSession, setCurrentCashierSession] = useState(null);

  // Load cashier session state from sessionStorage on component mount
  useEffect(() => {
    const savedCashierSession = JSON.parse(
      sessionStorage.getItem("cashierSession")
    );
    if (savedCashierSession) {
      setCurrentCashierSession(savedCashierSession);
      setIsCashierSessionOpen(true);
    }
  }, []);

  // Save cashier session state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem(
      "cashierSession",
      JSON.stringify(currentCashierSession)
    );
  }, [currentCashierSession]);

  const handleShowCashierSessionModal = () => {
    setShowCashierSessionModal(true);
    setshowCashierSessionModalInParent(true);
  };

  const handleAddCashierSession = (response) => {
    if (response.status === 201) {
      setIsCashierSessionOpen(true);
      setCurrentCashierSession(response.data.result);
    }
  };

  const handleUpdateCashierSession = (response) => {
    if (response.status === 200) {
      setIsCashierSessionOpen(false);
      setCurrentCashierSession(null);
    }
  };

  const handleCloseCashierSessionModal = () => {
    setShowCashierSessionModal(false);
    handleCloseCashierSessionModalInParent();
  };

  const handleCloseCashierSessionModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      setshowCashierSessionModalInParent(false);
    }, delay);
  };

  return (
    <nav className="navbar navbar-dark bg-dark navbar-fixed-top shadow">
      <div className="container-fluid">
        <div>
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
          <button
            type="button"
            className={`btn btn-outline-light ${
              isCashierSessionOpen ? "active" : ""
            }`}
            onClick={handleShowCashierSessionModal}
            style={{ marginLeft: "25px" }}
          >
            {isCashierSessionOpen
              ? "Close Cashier Session"
              : "Open Cashier Session"}
          </button>
        </div>
        <span className="navbar-text">Enterprise Resource App</span>
      </div>
      {/* Render CashierSession modal */}
      {isCashierSessionOpen === false && showCashierSessionModalInParent && (
        <CashierSession
          show={showCashierSessionModal}
          handleClose={handleCloseCashierSessionModal}
          handleAddCashierSession={handleAddCashierSession}
        />
      )}
      {isCashierSessionOpen && showCashierSessionModalInParent && (
        <CashierSessionUpdate
          show={showCashierSessionModal}
          handleClose={handleCloseCashierSessionModal}
          handleAddCashierSession={handleUpdateCashierSession}
          cashierSession={currentCashierSession}
        />
      )}
    </nav>
  );
};

export default TopNav;
