import { useState, useRef } from "react";
import Registration from "../registration/registration.js";

const useMain = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSubmodule, setSelectedSubmodule] = useState(null);
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);
  const discardedSubmoduleRef = useRef(null);

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

  const renderDetail = (option) => {
    switch (option) {
      case "User Registration":
        return <Registration />;
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
  };
};

export default useMain;
