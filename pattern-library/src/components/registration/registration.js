import React from "react";
import template from "./registration.jsx";
import { company_modules_api } from "../../services/userManagementApi.js";
import { module_roles_api } from "../../services/userManagementApi.js";
import { module_permissions_api } from "../../services/userManagementApi.js";
import { user_registration_api } from "../../services/userManagementApi.js";
import { company_subscription_module_user_api } from "../../services/userManagementApi.js";
import { user_role_api } from "../../services/userManagementApi.js";
import { user_permission_api } from "../../services/userManagementApi.js";
import { role_permission_api } from "../../services/userManagementApi.js";

class registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        basic: {
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          contactNo: "",
          firstname: "",
          lastname: "",
          companyId: sessionStorage.getItem("companyId"),
        },
        "user-module": {
          assignedModules: [], // Array to store assigned modules
          availableModules: [
            // {
            //   id: null,
            //   name: "",
            //   roles: {
            //     assignedRoles: [],
            //     availableRoles: [
            //       { id: null, name: "" },
            //       // ... other roles for Module 1
            //     ],
            //   },
            //   permissions: {
            //     assignedPermissions: [],
            //     availablePermissions: [
            //       { id: null, name: "" },
            //       // ... other permissions for Module 1
            //     ],
            //   },
            // },
          ], // Array to store available modules for the dropdown
        },
      },
      activeTab: "basic",
      prevCompanyId: 0, // Initialize with the default companyId
      fetchedAssignedModuleIds: [], // Track previously fetched assignedModuleIds
      registrationSuccessful: false,
    };
  }

  // Handle next button click
  handleNext = async () => {
    switch (this.state.activeTab) {
      case "basic":
        // Check if companyId has changed before making the request
        const companyId = this.state.formData.basic.companyId;
        if (companyId !== this.state.prevCompanyId) {
          try {
            const modulesData = await company_modules_api(companyId);
            const modulesArray = modulesData.data.result || [];

            this.setState((prevState) => ({
              formData: {
                ...prevState.formData,
                "user-module": {
                  ...prevState.formData["user-module"],
                  assignedModules: [], // Unassign modules when companyId changes
                  availableModules: modulesArray.map((module) => ({
                    id: module.moduleId,
                    name: module.moduleName,
                    roles: {
                      assignedRoles: [],
                      availableRoles: [],
                    },
                    permissions: {
                      assignedPermissions: [],
                      availablePermissions: [],
                    },
                  })),
                },
              },
              activeTab: "user-module",
              prevCompanyId: companyId, // Update prevCompanyId
            }));
          } catch (error) {
            console.error("Error fetching modules:", error);
          }
        } else {
          // If companyId has not changed, just move to the next tab
          this.setState({ activeTab: "user-module" });
        }
        break;
      case "user-module":
        // AssignedModules is an array of module IDs
        const assignedModuleIds = this.state.formData[
          "user-module"
        ].assignedModules.map((module) => module.id);

        // Check if assignedModuleIds have changed
        if (
          !this.arraysAreEqual(
            assignedModuleIds,
            this.state.fetchedAssignedModuleIds
          )
        ) {
          try {
            // Fetch roles for the assigned modules
            const rolesData = await module_roles_api(assignedModuleIds);
            const permissionData = await module_permissions_api(
              assignedModuleIds
            );
            // Update the state with the fetched roles and modules for assigned modules
            this.setState((prevState) => ({
              formData: {
                ...prevState.formData,
                "user-module": {
                  ...prevState.formData["user-module"],
                  assignedModules: prevState.formData[
                    "user-module"
                  ].assignedModules.map((assignedModule) => {
                    const moduleId = assignedModule.id.toString();
                    const moduleRoles = rolesData.data.result[moduleId] || [];
                    const modulePermissions =
                      permissionData.data.result[moduleId] || [];
                    return {
                      ...assignedModule,
                      roles: {
                        availableRoles: moduleRoles.map((role) => ({
                          id: role.roleId,
                          name: role.roleName,
                        })),
                        assignedRoles: [], //assignedModule.roles.assignedRoles, // Keep assignedRoles
                      },
                      permissions: {
                        availablePermissions: modulePermissions.map(
                          (permission) => ({
                            id: permission.permissionId,
                            name: permission.permissionName,
                          })
                        ),
                        assignedPermissions: [],
                        //assignedModule.permissions.assignedPermissions, // Keep assignedPermissions
                      },
                    };
                  }),
                  availableModules:
                    prevState.formData["user-module"].availableModules, // Keep availableModules
                },
              },
              activeTab: "user-role",
              fetchedAssignedModuleIds: assignedModuleIds, // Update fetchedAssignedModuleIds
            }));
          } catch (error) {
            console.error("Error fetching roles:", error);
            // Handle error, e.g., show an error message to the user
          }
        } else {
          // Data is already fetched, move to the next tab
          this.setState({ activeTab: "user-role" });
        }
        break;
      case "user-role":
        this.setState({ activeTab: "role-permission" });
        break;
      default:
        break;
    }
  };

  // handle previous button click
  handlePrevious = () => {
    switch (this.state.activeTab) {
      case "user-module":
        this.setState({ activeTab: "basic" });
        break;
      case "user-role":
        this.setState({ activeTab: "user-module" });
        break;
      case "role-permission":
        this.setState({ activeTab: "user-role" });
        break;
      default:
        break;
    }
  };

  //Save the user data
  handleSave = async () => {
    try {
      // Disable the save button immediately
      this.setState({ registrationSuccessful: true });

      // Extract assigned module IDs as a single number
      const assignedModuleIds = this.state.formData[
        "user-module"
      ].assignedModules.map((module) => module.id);
      const permissionId = parseInt(assignedModuleIds.join(""));

      // Extract basic user information
      const basicUserData = {
        username: this.state.formData.basic.username,
        password: this.state.formData.basic.password,
        email: this.state.formData.basic.email,
        contactNo: this.state.formData.basic.contactNo,
        firstname: this.state.formData.basic.firstname,
        lastname: this.state.formData.basic.lastname,
        companyId: this.state.formData.basic.companyId,
        permissionId: permissionId,
      };

      // Call the user registration API to save basic user information
      const registrationResponse = await user_registration_api(basicUserData);

      // Check if the registration was successful
      if (
        registrationResponse.status === 201 &&
        registrationResponse.data &&
        registrationResponse.data.result &&
        registrationResponse.data.result.userId
      ) {
        const userId = registrationResponse.data.result.userId;

        // Extract assigned module IDs
        const assignedModuleIds = this.state.formData[
          "user-module"
        ].assignedModules.map((module) => module.id);

        // Prepare data for company_subscription_module_user_api
        const userModulesFromData = assignedModuleIds.map((module, index) => ({
          companySubscriptionModuleId: module,
          userId: userId,
          permissionId: permissionId,
        }));

        // Loop through the prepared data and call the API for each row
        for (const userModuleData of userModulesFromData) {
          // Call the company_subscription_module_user_api to save user module assignment
          const userModuleResponse = await company_subscription_module_user_api(
            userModuleData
          );
          // Check the response or handle success/error as needed
          console.log("User Module Response:", userModuleResponse);
        }

        // Prepare data for user_role_api
        const userRolesFromData = this.state.formData[
          "user-module"
        ].assignedModules
          .map((module) => module.roles.assignedRoles)
          .flat() // Flatten the array of arrays
          .map((role) => ({
            userId: userId,
            roleId: role.id,
            permissionId: permissionId,
          }));

        // Loop through the prepared data and call the API for each row
        for (const userRoleData of userRolesFromData) {
          // Call the user_role_api to save user role assignment
          const userRoleResponse = await user_role_api(userRoleData);

          // Check the response or handle success/error as needed
          console.log("User Role Response:", userRoleResponse);
        }

        // Prepare data for user_permission_api
        const userPermissionsFromData = this.state.formData[
          "user-module"
        ].assignedModules
          .map((module) => module.permissions.assignedPermissions)
          .flat() // Flatten the array of arrays
          .map((permission) => ({
            userId: userId,
            permissionId: permission.id,
          }));

        // Loop through the prepared data and call the API for each row
        for (const userPermissionData of userPermissionsFromData) {
          // Call the user_permission_api to save user permission assignment
          const userPermissionResponse = await user_permission_api(
            userPermissionData
          );

          // Check the response or handle success/error as needed
          console.log("User Permission Response:", userPermissionResponse);
        }

        // Prepare data for role_permission_api
        const rolePermissionsFromData = this.state.formData[
          "user-module"
        ].assignedModules
          .map((module) => {
            const assignedRoles = module.roles.assignedRoles.map(
              (role) => role.id
            );
            const assignedPermissions =
              module.permissions.assignedPermissions.map(
                (permission) => permission.id
              );

            // Generate all combinations of roleId and permissionId
            return assignedRoles.flatMap((roleId) =>
              assignedPermissions.map((permissionId) => ({
                roleId: roleId,
                permissionId: permissionId,
              }))
            );
          })
          .flat(); // Flatten the array of arrays

        // Loop through the prepared data and call the API for each row
        for (const rolePermissionData of rolePermissionsFromData) {
          // Call the role_permission_api to save role permission assignments
          const rolePermissionResponse = await role_permission_api(
            rolePermissionData
          );

          // Check the response or handle success/error as needed
          console.log("Role Permission Response:", rolePermissionResponse);
        }
        // Log success message
        console.log("Registration successful! , Data saved");
      } else {
        // Handle registration failure
        console.error("User registration failed:", registrationResponse);
        // Enable the save button immediately
        this.setState({ registrationSuccessful: false });
      }
    } catch (error) {
      console.error("Error saving user information:", error);
    }
    console.log("Form Data:", this.state.formData);
  };

  // Update the form data when input values change
  handleInputChange = (tab, field, value) => {
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [tab]: {
          ...prevState.formData[tab],
          [field]: value,
        },
      },
    }));
  };

  // Module Selection
  handleModuleSelect = (moduleId) => {
    const selectedModule = this.state.formData[
      "user-module"
    ].availableModules.find((module) => module.id === parseInt(moduleId, 10));

    if (selectedModule) {
      this.setState((prevState) => ({
        formData: {
          ...prevState.formData,
          "user-module": {
            ...prevState.formData["user-module"],
            assignedModules: [
              ...prevState.formData["user-module"].assignedModules,
              selectedModule,
            ],
            availableModules: prevState.formData[
              "user-module"
            ].availableModules.filter(
              (module) => module.id !== selectedModule.id
            ),
          },
        },
      }));
    }
  };

  handleRemoveModule = (moduleId) => {
    const removedModule = this.state.formData[
      "user-module"
    ].assignedModules.find((module) => module.id === moduleId);

    if (removedModule) {
      this.setState((prevState) => ({
        formData: {
          ...prevState.formData,
          "user-module": {
            ...prevState.formData["user-module"],
            assignedModules: prevState.formData[
              "user-module"
            ].assignedModules.filter((module) => module.id !== moduleId),
            availableModules: [
              ...prevState.formData["user-module"].availableModules,
              removedModule,
            ],
          },
        },
      }));
    }
  };

  // Role Selection
  handleRoleSelect = (roleId, moduleId) => {
    this.setState((prevState) => {
      const updatedModules = [
        ...prevState.formData["user-module"].assignedModules,
      ];

      updatedModules.forEach((module) => {
        if (module.id === moduleId) {
          const selectedRole = module.roles.availableRoles.find(
            (role) => role.id === parseInt(roleId, 10)
          );

          if (selectedRole) {
            module.roles.assignedRoles.push(selectedRole);
            module.roles.availableRoles = module.roles.availableRoles.filter(
              (role) => role.id !== selectedRole.id
            );
          }
        }
      });

      return {
        formData: {
          ...prevState.formData,
          "user-module": {
            ...prevState.formData["user-module"],
            assignedModules: updatedModules,
          },
        },
      };
    });
  };

  handleRemoveRole = (roleId, moduleId) => {
    this.setState((prevState) => {
      const updatedModules = [
        ...prevState.formData["user-module"].assignedModules,
      ];

      updatedModules.forEach((module) => {
        if (module.id === moduleId) {
          const removedRoleIndex = module.roles.assignedRoles.findIndex(
            (role) => role.id === roleId
          );

          if (removedRoleIndex !== -1) {
            const removedRole = module.roles.assignedRoles.splice(
              removedRoleIndex,
              1
            )[0];
            module.roles.availableRoles.push(removedRole);
          }
        }
      });

      return {
        formData: {
          ...prevState.formData,
          "user-module": {
            ...prevState.formData["user-module"],
            assignedModules: updatedModules,
          },
        },
      };
    });
  };

  // Role Permission Selection
  handleRolePermissionSelect = (permissionId, moduleId) => {
    this.setState((prevState) => {
      const updatedModules = [
        ...prevState.formData["user-module"].assignedModules,
      ];

      updatedModules.forEach((module) => {
        if (module.id === moduleId) {
          const selectedPermission =
            module.permissions.availablePermissions.find(
              (permission) => permission.id === parseInt(permissionId, 10)
            );

          if (selectedPermission) {
            module.permissions.availablePermissions =
              module.permissions.availablePermissions.filter(
                (permission) => permission.id !== selectedPermission.id
              );
            module.permissions.assignedPermissions.push(selectedPermission);
          }
        }
      });

      return {
        formData: {
          ...prevState.formData,
          "user-module": {
            ...prevState.formData["user-module"],
            assignedModules: updatedModules,
          },
        },
      };
    });
  };

  handleRemoveRolePermission = (permissionId, moduleId) => {
    this.setState((prevState) => {
      const updatedModules = [
        ...prevState.formData["user-module"].assignedModules,
      ];

      updatedModules.forEach((module) => {
        if (module.id === moduleId) {
          const removedPermissionIndex =
            module.permissions.assignedPermissions.findIndex(
              (permission) => permission.id === permissionId
            );

          if (removedPermissionIndex !== -1) {
            const removedPermission =
              module.permissions.assignedPermissions.splice(
                removedPermissionIndex,
                1
              )[0];
            module.permissions.availablePermissions.push(removedPermission);
          }
        }
      });

      return {
        formData: {
          ...prevState.formData,
          "user-module": {
            ...prevState.formData["user-module"],
            assignedModules: updatedModules,
          },
        },
      };
    });
  };

  // Helper function to compare arrays
  arraysAreEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  };

  render() {
    return template.call(this);
  }
}

export default registration;
