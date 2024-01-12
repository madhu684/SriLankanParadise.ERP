import { useState, useRef, useEffect } from "react";
import Registration from "../registration/registration.js";
import PurchaseRequisitionList from "../purchaseRequisition/PurchaseRequisitionList/PurchaseRequisitionList.jsx";

const useMain = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 992);
  const [selectedSubmodule, setSelectedSubmodule] = useState(null);
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);
  const discardedSubmoduleRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 992);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isSmallScreen) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isSmallScreen]);

  const handleSubmoduleClick = (submodule) => {
    if (submodule === selectedSubmodule) {
    } else {
      if (selectedSubmodule === "User Registration") {
        discardedSubmoduleRef.current = submodule;
        setShowDiscardConfirmation(true);
      } else {
        setSelectedSubmodule(submodule);
      }
    }
  };

  const handleDiscard = () => {
    const discardedSubmodule = discardedSubmoduleRef.current;
    if (discardedSubmodule) {
      setSelectedSubmodule(discardedSubmodule);
    }
    discardedSubmoduleRef.current = null;
    setShowDiscardConfirmation(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Add other content as needed.
  const renderDetail = (option) => {
    switch (option) {
      case "User Registration":
        return <Registration />;
      case "Purchase Requisitions":
        return <PurchaseRequisitionList />;
      default:
        return null;
    }
  };

  return {
    toggleSidebar,
    isSidebarOpen,
    renderDetail,
    selectedSubmodule,
    handleSubmoduleClick,
    showDiscardConfirmation,
    setShowDiscardConfirmation,
    handleDiscard,
    isSmallScreen,
  };
};

export default useMain;
