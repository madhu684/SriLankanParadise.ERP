import React from "react";
import template from "./menu.jsx";
import { logout_api } from "../../services/userManagementApi.js";
import { user_modules_api } from "../../services/userManagementApi.js";
import { submodules_api } from "../../services/userManagementApi.js";

class menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeModule: null,
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
        //   submodules: [{ id: 1, name: "submodule 1" }],
        // },
      ],
      isDropdownOpen: false,
      userId: sessionStorage.getItem("id"),
      username: sessionStorage.getItem("username"),
      isLogout: false, // Flag to trigger the redirection
    };
  }

  componentDidMount() {
    // Fetch user modules when the component mounts
    this.fetchUserModules();
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

  handleLogout = async () => {
    try {
      const response = await logout_api();
      // Clear session storage
      sessionStorage.clear();
      console.log("Logout successfully", response);
      // Set the state to trigger the Redirect component
      this.setState({ isLogout: true });
    } catch (error) {
      console.error("Error during logout:", error);
      // Handle error if needed
    }
  };

  handleModuleClick = (moduleId) => {
    this.setState((prevState) => ({
      activeModule: prevState.activeModule === moduleId ? null : moduleId,
    }));
  };
  //   handleModuleClick = (moduleId) => {
  //     this.setState({ activeModule: moduleId });
  //   };

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
