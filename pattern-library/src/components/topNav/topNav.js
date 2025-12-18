import "./topNav.css";
import CashierSession from "../cashierSession/cashierSession";
import CashierSessionUpdate from "../cashierSession/cashierSessionUpdate/cashierSessionUpdate";
import { useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useQueryClient } from "@tanstack/react-query";

const TopNav = ({ onToggleSidebar }) => {
  const [showCashierSessionModal, setShowCashierSessionModal] = useState(false);
  const [showCashierSessionModalInParent, setshowCashierSessionModalInParent] =
    useState(false);
  const [modalType, setModalType] = useState(null);

  const { activeCashierSession, activeCashierSessionLoading } =
    useContext(UserContext);
  const queryClient = useQueryClient();

  const isCashierSessionOpen = !!activeCashierSession;

  const handleShowCashierSessionModal = () => {
    if (activeCashierSessionLoading) return;

    setModalType(isCashierSessionOpen ? "update" : "create");
    setShowCashierSessionModal(true);
    setshowCashierSessionModalInParent(true);
  };

  const handleAddCashierSession = (response) => {
    if (response.status === 201) {
      // Invalidate the query to refetch the active cashier session
      queryClient.invalidateQueries({
        queryKey: ["activeCashierSession", sessionStorage.getItem("userId")],
      });
    }
  };

  const handleUpdateCashierSession = (response) => {
    if (response.status === 200) {
      // Invalidate the query to refetch (should return null after closing)
      queryClient.invalidateQueries({
        queryKey: ["activeCashierSession", sessionStorage.getItem("userId")],
      });
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
      setModalType(null);
    }, delay);
  };

  const getButtonText = () => {
    if (activeCashierSessionLoading) {
      return "Loading...";
    }
    return isCashierSessionOpen
      ? "Close Cashier Session"
      : "Open Cashier Session";
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
            disabled={activeCashierSessionLoading}
          >
            {getButtonText()}
          </button>
        </div>
        <span className="navbar-text">Enterprise Resource App</span>
      </div>
      {/* Render CashierSession modal */}
      {modalType === "create" && showCashierSessionModalInParent && (
        <CashierSession
          show={showCashierSessionModal}
          handleClose={handleCloseCashierSessionModal}
          handleAddCashierSession={handleAddCashierSession}
        />
      )}
      {modalType === "update" && showCashierSessionModalInParent && (
        <CashierSessionUpdate
          show={showCashierSessionModal}
          handleClose={handleCloseCashierSessionModal}
          handleAddCashierSession={handleUpdateCashierSession}
          cashierSession={activeCashierSession}
        />
      )}
    </nav>
  );
};

export default TopNav;
