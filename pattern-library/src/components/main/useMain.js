import { useState } from "react";
import Registration from "../registration/registration.js";

const useMain = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSubmodule, setSelectedSubmodule] = useState(null);

  const handleSubmoduleClick = (submodule) => {
    setSelectedSubmodule(submodule);
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
  };
};

export default useMain;
