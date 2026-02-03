import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  logout_api,
  user_modules_api,
  submodules_api,
  API_BASE_URL,
} from "../../services/userManagementApi.js";
import { UserContext } from "../../context/userContext.jsx";

// Map submodule names to routes
const submoduleRouteMap = {
  // User Management
  "User Roles": "/main/user-management/user-roles",
  "User Accounts": "/main/user-management/user-accounts",
  "User Registration": "/main/user-management/user-registration",
  "User Privileges": "/main/user-management/user-privileges",
  "Role Permission Mapping": "/main/user-management/role-permission-mapping",

  // Purchase
  "Purchase Requisitions": "/main/purchase/requisitions",
  "Purchase Orders": "/main/purchase/orders",
  "Goods Received Notes": "/main/purchase/grn",
  Suppliers: "/main/purchase/suppliers",
  "Supplier Return": "/main/purchase/supplier-returns",
  "Material Requisitions": "/main/purchase/material-requisitions",
  "Transfer Requisitions": "/main/purchase/transfer-requisitions",
  "Material Issue Notes": "/main/purchase/min",
  "Transfer Issue Notes": "/main/purchase/tin",
  "Update Item Batches": "/main/purchase/batch-update",
  "MIN Report": "/main/purchase/min-report",

  // Sales Management
  "Sales Orders": "/main/sales/orders",
  "Sales Invoices": "/main/sales/invoices",
  "Sales Receipts": "/main/sales/receipts",
  "Packing Slip": "/main/sales/packing-slips",
  Customers: "/main/sales/customers",
  "Price List Maintenance": "/main/sales/price-lists",
  "Sales Order Report": "/main/sales/reports/orders",
  "Expense Out Requisitions": "/main/sales/requisitions",
  "Cashier Expense Out": "/main/sales/cashier",
  "User Collection Report": "/main/sales/user-collection-report",
  "Collection Report": "/main/sales/collection-report",
  "Customer Inquiry Report": "/main/sales/customer-inquiry-report",

  // Inventory Management
  "Item Masters": "/main/inventory/items",
  Categories: "/main/inventory/categories",
  Units: "/main/inventory/units",
  Locations: "/main/inventory/locations",
  "Item Batch Update": "/main/inventory/batch-update",
  "Stock Management": "/main/inventory/stock-management",
  "Stock Level": "/main/inventory/stock-level",
  "Empty Return": "/main/inventory/empty-return",
  "Stock Report": "/main/inventory/reports/stock",
  "Inventory Analysis Report": "/main/inventory/reports/inventory-analysis",
  "Inventory As At Date Report":
    "/main/inventory/reports/inventory-analysis-date",
};

const useMenu = (props = {}) => {
  const {
    isSidebarOpen: propSidebarOpen,
    isSmallScreen,
    onToggleSidebar,
  } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const { clearUserId } = useContext(UserContext);

  // State from sessionStorage
  const [userId] = useState(sessionStorage.getItem("userId"));
  const [username] = useState(sessionStorage.getItem("username"));
  const [companyId] = useState(sessionStorage.getItem("companyId"));
  const [companyName] = useState(sessionStorage.getItem("companyName"));
  const [companyLogoPath] = useState(sessionStorage.getItem("companyLogoPath"));

  const [modules, setModules] = useState([]);
  const [activeModules, setActiveModules] = useState([]);
  const [activeSubmodule, setActiveSubmodule] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(propSidebarOpen ?? true);
  const [companyLogoUrl, setCompanyLogoUrl] = useState(null);

  // Sync prop-controlled sidebar
  useEffect(() => {
    if (propSidebarOpen !== undefined) {
      setIsSidebarOpen(propSidebarOpen);
    }
  }, [propSidebarOpen]);

  // Determine active submodule and module from current route
  useEffect(() => {
    if (modules.length === 0) return;

    const currentPath = location.pathname;

    // Check if we're in a module section
    const pathParts = currentPath.split("/");
    if (pathParts.length >= 3) {
      const moduleSection = pathParts[2]; // e.g., 'user-management', 'purchase', 'sales'

      // Map URL sections to module names
      const moduleSectionMap = {
        "user-management": "User Management",
        purchase: "Purchase",
        sales: "Sales Management",
        inventory: "Inventory Management",
        expense: "Expense",
      };

      const moduleName = moduleSectionMap[moduleSection];
      if (moduleName) {
        const module = modules.find((m) => m.name === moduleName);
        if (module) {
          // Set this module as active (replace, don't add)
          setActiveModules([module.id]);

          // Find which submodule is active
          const foundSubmodule = Object.entries(submoduleRouteMap).find(
            ([_, route]) => route === currentPath,
          );

          if (foundSubmodule) {
            setActiveSubmodule(foundSubmodule[0]);
          }
        }
      }
    }
  }, [location.pathname, modules]);

  // Fetch modules on mount
  useEffect(() => {
    if (!userId) return;

    const fetchUserModules = async () => {
      try {
        const { data } = await user_modules_api(userId);
        let result = data.result || [];

        // Filter only active modules (status === true)
        result = result.filter((module) => module.status === true);

        const modulesWithSubmodules = await Promise.all(
          result.map(async (module) => {
            const subRes = await submodules_api(module.moduleId);
            let subResult = subRes.data.result || [];

            // Filter only active submodules
            subResult = subResult.filter((sub) => sub.status === true);

            const submodules = subResult.map((s) => ({
              id: s.subModuleId,
              name: s.subModuleName,
            }));

            return {
              id: module.moduleId,
              name: module.moduleName,
              submodules,
            };
          }),
        );

        setModules(modulesWithSubmodules);
      } catch (err) {
        console.error("Error fetching modules:", err);
        toast.error("Failed to load menu.");
      }
    };

    fetchUserModules();
  }, [userId]);

  // Generate company logo URL
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

  // Handlers
  const handleModuleClick = (moduleId) => {
    // Toggle module expansion
    setActiveModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId],
    );
  };

  const handleSubmoduleClick = (moduleId, submoduleName) => {
    const route = submoduleRouteMap[submoduleName];

    if (route) {
      navigate(route);
      setActiveSubmodule(submoduleName);

      // Ensure parent module is expanded
      setActiveModules((prev) =>
        prev.includes(moduleId) ? prev : [...prev, moduleId],
      );

      if (isSmallScreen) onToggleSidebar?.();
    } else {
      console.warn(`No route found for submodule: ${submoduleName}`);
      toast.error(`Route not configured for ${submoduleName}`);
    }
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

  // Redirect after logout
  useEffect(() => {
    if (isLogout) {
      navigate("/login", { replace: true });
    }
  }, [isLogout, navigate]);

  return {
    // State
    modules,
    activeModules,
    activeSubmodule,
    isDropdownOpen,
    username,
    companyName,
    companyLogoUrl,
    isLogout,
    isSidebarOpen,
    setIsSidebarOpen,

    // Props
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
