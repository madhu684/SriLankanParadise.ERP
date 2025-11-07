// src/hooks/useMenu.js
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  logout_api,
  user_modules_api,
  submodules_api,
  API_BASE_URL,
} from "../../services/userManagementApi.js";
import { UserContext } from "../../context/userContext.jsx";

const useMenu = (props = {}) => {
  const {
    activeSubmodule,
    isSidebarOpen: propSidebarOpen,
    isSmallScreen,
    onToggleSidebar,
    onSubmoduleClick,
  } = props;

  const navigate = useNavigate();

  const { clearUserId } = useContext(UserContext);

  // ────── State from sessionStorage ──────
  const [userId] = useState(sessionStorage.getItem("userId"));
  const [username] = useState(sessionStorage.getItem("username"));
  const [companyId] = useState(sessionStorage.getItem("companyId"));
  const [companyName] = useState(sessionStorage.getItem("companyName"));
  const [companyLogoPath] = useState(sessionStorage.getItem("companyLogoPath"));

  const [modules, setModules] = useState([]);
  const [activeModules, setActiveModules] = useState([]);
  const [selectedSubmodule, setSelectedSubmodule] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(propSidebarOpen ?? true);
  const [companyLogoUrl, setCompanyLogoUrl] = useState(null);

  // ────── Sync prop-controlled sidebar ──────
  useEffect(() => {
    if (propSidebarOpen !== undefined) {
      setIsSidebarOpen(propSidebarOpen);
    }
  }, [propSidebarOpen]);

  // ────── Fetch modules on mount ──────
  useEffect(() => {
    if (!userId) return;

    const fetchUserModules = async () => {
      try {
        const { data } = await user_modules_api(userId);
        const result = data.result || [];

        const modulesWithSubmodules = await Promise.all(
          result.map(async (module) => {
            const subRes = await submodules_api(module.moduleId);
            const subResult = subRes.data.result || [];

            const submodules = subResult.map((s) => ({
              id: s.subModuleId,
              name: s.subModuleName,
            }));

            return {
              id: module.moduleId,
              name: module.moduleName,
              submodules,
            };
          })
        );

        setModules(modulesWithSubmodules);
      } catch (err) {
        console.error("Error fetching modules:", err);
        toast.error("Failed to load menu.");
      }
    };

    fetchUserModules();
  }, [userId]);

  // ────── Generate company logo URL ──────
  useEffect(() => {
    if (!companyLogoPath) return;

    try {
      const baseApiUrl = API_BASE_URL.replace(/\/api(?!.*\/api)/, "");
      const cleanPath = companyLogoPath
        .replace(/\\/g, "/")
        .replace("wwwroot/", "");
      const url = `${baseApiUrl}/${cleanPath}`;
      setCompanyLogoUrl(url);
    } catch (err) {
      console.error("Error generating logo URL:", err);
    }
  }, [companyLogoPath]);

  // ────── Handlers ──────
  const handleModuleClick = (moduleId) => {
    setActiveModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSubmoduleClick = (moduleId, submoduleName) => {
    setSelectedSubmodule(submoduleName);
    onSubmoduleClick?.(submoduleName);

    setActiveModules((prev) =>
      prev.includes(moduleId) ? prev : [...prev, moduleId]
    );

    if (isSmallScreen) onToggleSidebar?.();
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await logout_api();
      clearUserId();
      sessionStorage.clear();
      toast.success("Logged out successfully");
      setIsLogout(true);
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed");
    }
  };

  // ────── Redirect after logout ──────
  useEffect(() => {
    if (isLogout) {
      navigate("/login", { replace: true });
    }
  }, [isLogout, navigate]);

  return {
    // State
    modules,
    activeModules,
    selectedSubmodule,
    isDropdownOpen,
    username,
    companyName,
    companyLogoUrl,
    isLogout,
    isSidebarOpen,
    setIsSidebarOpen,

    // Props
    activeSubmodule,
    isSmallScreen,
    onToggleSidebar,

    // Actions
    handleModuleClick,
    handleSubmoduleClick,
    toggleDropdown,
    handleLogout,
  };
};

export default useMenu;
