import React from "react";
import template from "./menu.jsx";
import {
  logout_api,
  user_modules_api,
  submodules_api,
  API_BASE_URL,
} from "../../services/userManagementApi.js";
import toast from "react-hot-toast";

class menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeModules: [],
      selectedSubmodule: null,
      modules: [
        // {
        //   id: 1,
        //   name: "User management",
        //   submodules: [
        //     { id: 1, name: "submodule 1" },
        //     { id: 2, name: "submodule 2" },
        //   ],
        // },
        // {
        //   id: 2,
        //   name: "Sales management",
        //   submodules: [{ id: 1, name: "submodule 3" }],
        // },
      ],
      isDropdownOpen: false,
      userId: sessionStorage.getItem("userId"),
      username: sessionStorage.getItem("username"),
      companyId: sessionStorage.getItem("companyId"),
      companyName: sessionStorage.getItem("companyName"),
      companyLogoPath: sessionStorage.getItem("companyLogoPath"),
      isLogout: false, // Flag to trigger the redirection
      isSidebarOpen: true,
      companyLogoUrl: null,
    };
  }

  componentDidMount() {
    // Fetch user modules when the component mounts
    this.fetchUserModules();
    this.generateCompanyLogoUrl();
  }

  fetchUserModules = async () => {
    try {
      const response = await user_modules_api(this.state.userId);
      const { result } = response.data;

      // Update the state with the retrieved modules
      const modulesWithSubmodules = await Promise.all(
        result.map(async (module) => {
          const submoduleResponse = await submodules_api(module.moduleId);

          if (
            !submoduleResponse.data.result ||
            submoduleResponse.data.result.length === 0
          ) {
            // If no submodules, assign the module without submodules
            return {
              id: module.moduleId,
              name: module.moduleName,
              submodules: [], // Assign an empty array for submodules
            };
          } else {
            // If there are submodules, assign both modules and submodules
            const submodules = submoduleResponse.data.result.map(
              (submodule) => ({
                id: submodule.subModuleId,
                name: submodule.subModuleName,
              })
            );
            return {
              id: module.moduleId,
              name: module.moduleName,
              submodules: submodules,
            };
          }
        })
      );

      this.setState((prevState) => ({
        ...prevState,
        modules: modulesWithSubmodules,
      }));
    } catch (error) {
      console.error("Error fetching user modules:", error);
      // Handle error if needed
    }
  };

  generateCompanyLogoUrl = () => {
    try {
      //const baseApiUrl = API_BASE_URL.replace("/api", "");

      // Remove the last occurrence of '/api' from API_BASE_URL
      const baseApiUrl = API_BASE_URL.replace(/\/api(?!.*\/api)/, "");

      const adjustedRelativePath = this.state.companyLogoPath
        .replace(/\\/g, "/")
        .replace("wwwroot/", "");

      const companyLogoUrl = `${baseApiUrl}/${adjustedRelativePath}`;
      this.setState({ companyLogoUrl: companyLogoUrl });
    } catch (error) {
      console.error("Error generating company logo url:", error);
    }
  };

  handleLogout = async () => {
    try {
      const response = await logout_api();
      // Clear session storage
      sessionStorage.clear();
      console.log("Logout successfully", response);
      // Set the state to trigger the Redirect component
      toast.success("Logout successfully");
      this.setState({ isLogout: true });
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error during logout");
      // Handle error if needed
    }
  };

  handleModuleClick = (moduleId) => {
    this.setState((prevState) => {
      const isModuleActive = prevState.activeModules.includes(moduleId);

      return {
        activeModules: isModuleActive
          ? prevState.activeModules.filter((id) => id !== moduleId)
          : [...prevState.activeModules, moduleId],
      };
    });
  };

  handleSubmoduleClick = (moduleId, submodule) => {
    this.setState((prevState) => {
      const isModuleActive = prevState.activeModules.includes(moduleId);
      if (this.props.onSubmoduleClick) {
        this.props.onSubmoduleClick(submodule);
      }
      return {
        activeModules: isModuleActive
          ? prevState.activeModules
          : [...prevState.activeModules, moduleId],
        selectedSubmodule: submodule,
      };
    });
  };

  handleDropdownToggle = () => {
    this.setState((prevState) => ({ dropdownOpen: !prevState.dropdownOpen }));
  };

  toggleDropdown = () => {
    this.setState((prevState) => ({
      isDropdownOpen: !prevState.isDropdownOpen,
    }));
  };

  render() {
    return template.call(this);
  }
}

export default menu;
