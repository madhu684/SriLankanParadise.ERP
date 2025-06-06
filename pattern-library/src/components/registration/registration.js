import React from "react";
import template from "./registration.jsx";
import {
  company_modules_api,
  module_roles_api,
  user_registration_api,
  company_subscription_module_user_api,
  user_role_api,
  user_permission_api,
  post_user_location_api,
  role_permissions_api,
} from "../../services/userManagementApi.js";
import { get_company_locations_api } from "../../services/purchaseApi.js";

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        basic: {
          username: "",
          email: "",
          contactNo: "",
          firstname: "",
          lastname: "",
          companyId: sessionStorage.getItem("companyId") || "", // Default to sessionStorage value
          department: "",
          warehouse: "",
          // productionStages: [],
          status: false, // Initially empty, will be fetched later
        },
        "user-module": {
          availableModules: [], // Initially empty array for available modules
          assignedModules: [], // Initially empty array for assigned modules
        },
        "user-role": {
          assignedRoles: [],
        },
        permissions: {},
      },
      activeTab: "basic",
      prevCompanyId: 0,
      fetchedAssignedModuleIds: [],
      registrationSuccessful: false,
      showSuccessAlert: false,
      showFailureAlert: false,

      registrationErrorMessage: " ",

      validFields: {
        basic: {},
      },
      validationErrors: {
        basic: {},
        "user-module": {},
        "user-role": {},
        "role-permission": {},
      },
      locations: [], // Will be fetched later
    };
  }

  componentDidMount() {
    this.fetchInitialData();
  }

  /**
   * Fetches initial data (Production stages, locations) from the API and updates the component state.
   */
  fetchInitialData = async () => {
    get_company_locations_api(sessionStorage.getItem("companyId"))
      .then((response) => {
        this.setState((prev) => ({
          ...prev,
          locations: response.data.result,
        }));
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
      });
    await this.fetchCompanyModules();
  };

  /**
   * Handles the "Next" button click and navigates to the next tab.
   * */
  handleNext = async () => {
    switch (this.state.activeTab) {
      case "basic":
        const isBasicTabValid = this.validateUserInfoTab();
        if (isBasicTabValid) {
          this.setState((prev) => ({ ...prev, activeTab: "user-module" }));
        }
        break;
      case "user-module":
        const isUserModuleTabValid = this.validateUserModulesTab();
        if (isUserModuleTabValid) {
          await this.fetchModuleRoles();
          this.setState((prev) => ({ ...prev, activeTab: "user-role" }));
        }
        break;
      case "user-role":
        const isUserRoleTabValid = this.validateUserRolesTab();
        if (isUserRoleTabValid) {
          await this.fetchRolePermissions();
          this.setState((prev) => ({ ...prev, activeTab: "role-permission" }));
        }
        break;
      default:
        break;
    }
  };

  /**
   * Handles the "Previous" button click and navigates to the previous tab.
   */
  handlePrevious = () => {
    switch (this.state.activeTab) {
      case "user-module":
        this.resetValidationErrors("user-module");
        this.setState((prevState) => ({
          ...prevState,
          activeTab: "basic",
        }));
        break;
      case "user-role":
        this.resetValidationErrors("user-role");
        this.setState((prevState) => ({
          ...prevState,
          activeTab: "user-module",
        }));
        break;
      case "role-permission":
        this.resetValidationErrors("role-permission");
        this.setState((prevState) => ({
          ...prevState,
          activeTab: "user-role",
        }));
        break;
      default:
        break;
    }
  };

  /**
   * Handles input changes for form fields.
   */
  handleInputChange = (section, field, value) => {
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [section]: {
          ...prevState.formData[section],
          [field]: value,
        },
      },
    }));
  };

  /**
   * Handles the selection of a Module.
   */
  handleSelectModule = (moduleId) => {
    const selectedModule = this.state.formData[
      "user-module"
    ].availableModules.find((module) => module.id === parseInt(moduleId, 10));

    if (selectedModule) {
      const updatedAssignedModules = [
        ...this.state.formData["user-module"].assignedModules,
        selectedModule,
      ];

      const updatedAvailableModules = this.state.formData[
        "user-module"
      ].availableModules.filter((module) => module.id !== selectedModule.id);

      this.setState((prevState) => ({
        formData: {
          ...prevState.formData,
          "user-module": {
            ...prevState.formData["user-module"],
            assignedModules: updatedAssignedModules,
            availableModules: updatedAvailableModules,
          },
        },
      }));
    }
  };
  /**
   * Handles the removal of a Module.
   */
  handleRemoveModule = (moduleId) => {
    const removedModule = this.state.formData[
      "user-module"
    ].assignedModules.find((module) => module.id === moduleId);

    if (removedModule) {
      const updatedAssignedModules = this.state.formData[
        "user-module"
      ].assignedModules.filter((module) => module.id !== moduleId);

      const updatedAvailableModules = [
        ...this.state.formData["user-module"].availableModules,
        removedModule,
      ];

      this.setState((prevState) => ({
        formData: {
          ...prevState.formData,
          "user-module": {
            ...prevState.formData["user-module"],
            assignedModules: updatedAssignedModules,
            availableModules: updatedAvailableModules,
          },
        },
      }));
    }
  };
  /**
   * Handles the selection of a Role.
   */
  handleSelectRole = (roleId, moduleId) => {
    const updatedModules = this.state.formData[
      "user-module"
    ].assignedModules.map((module) => {
      if (module.id === moduleId) {
        const selectedRole = module.roles.availableRoles.find(
          (role) => role.id === parseInt(roleId, 10)
        );

        if (!selectedRole) return module;

        return {
          ...module,
          roles: {
            assignedRoles: [...module.roles.assignedRoles, selectedRole],
            availableRoles: module.roles.availableRoles.filter(
              (role) => role.id !== selectedRole.id
            ),
          },
        };
      }
      return module;
    });

    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        "user-module": {
          ...prevState.formData["user-module"],
          assignedModules: updatedModules,
        },
      },
    }));
  };

  /**
   * Handles the removal of a Role.
   */
  handleRemoveRole = (roleId, moduleId) => {
    const updatedModules = this.state.formData[
      "user-module"
    ].assignedModules.map((module) => {
      if (module.id === moduleId) {
        const removedRole = module.roles.assignedRoles.find(
          (role) => role.id === roleId
        );

        if (!removedRole) return module;

        return {
          ...module,
          roles: {
            assignedRoles: module.roles.assignedRoles.filter(
              (role) => role.id !== roleId
            ),
            availableRoles: [...module.roles.availableRoles, removedRole],
          },
        };
      }
      return module;
    });

    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        "user-module": {
          ...prevState.formData["user-module"],
          assignedModules: updatedModules,
        },
      },
    }));
  };

  /**
   * Handles the selection of a Permission.
   */
  handleSelectPermission = (moduleId, roleId, permissionId) => {
    permissionId = parseInt(permissionId, 10);

    const updatedModules = this.state.formData[
      "user-module"
    ].assignedModules.map((module) => {
      if (module.id !== moduleId) return module;

      return {
        ...module,
        roles: {
          ...module.roles,
          assignedRoles: module.roles.assignedRoles.map((role) => {
            if (role.id !== roleId) return role;

            const permissionToAssign =
              role.permissions.availablePermissions.find(
                (permission) => permission.id === permissionId
              );

            if (!permissionToAssign) return role;

            return {
              ...role,
              permissions: {
                assignedPermissions: [
                  ...role.permissions.assignedPermissions,
                  permissionToAssign,
                ],
                availablePermissions:
                  role.permissions.availablePermissions.filter(
                    (permission) => permission.id !== permissionId
                  ),
              },
            };
          }),
        },
      };
    });

    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        "user-module": {
          ...prevState.formData["user-module"],
          assignedModules: updatedModules,
        },
      },
    }));
  };

  /**
   * Handles the removal of a Permission.
   */
  handleRemovePermission = (moduleId, roleId, permissionId) => {
    permissionId = parseInt(permissionId, 10);

    const updatedModules = this.state.formData[
      "user-module"
    ].assignedModules.map((module) => {
      if (module.id !== moduleId) return module;

      return {
        ...module,
        roles: {
          ...module.roles,
          assignedRoles: module.roles.assignedRoles.map((role) => {
            if (role.id !== roleId) return role;

            const permissionToRemove =
              role.permissions.assignedPermissions.find(
                (permission) => permission.id === permissionId
              );

            if (!permissionToRemove) return role;

            return {
              ...role,
              permissions: {
                assignedPermissions:
                  role.permissions.assignedPermissions.filter(
                    (permission) => permission.id !== permissionId
                  ),
                availablePermissions: [
                  ...role.permissions.availablePermissions,
                  permissionToRemove,
                ],
              },
            };
          }),
        },
      };
    });

    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        "user-module": {
          ...prevState.formData["user-module"],
          assignedModules: updatedModules,
        },
      },
    }));
  };

  /**
   * Validates the User Information tab of the registration form.
   */
  validateUserInfoTab = () => {
    const { basic } = this.state.formData;
    const errors = {};

    if (!basic.firstname) {
      errors.firstname = "First name is required.";
    }

    if (!basic.email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(basic.email)) {
      errors.email = "Invalid email address.";
    }

    if (!basic.contactNo) {
      errors.contactNo = "Contact number is required.";
    } else if (!/^\d+$/.test(basic.contactNo)) {
      errors.contactNo = "Invalid contact number. Please enter only digits.";
    }

    if (!basic.username) {
      errors.username = "Username is required.";
    }

    if (!basic.password) {
      errors.password = "Password is required.";
    } else if (basic.password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    } else if (!/[A-Za-z]/.test(basic.password)) {
      errors.password = "Password must contain at least one letter.";
    } else if (!/[0-9]/.test(basic.password)) {
      errors.password = "Password must contain at least one number.";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(basic.password)) {
      errors.password = "Password must contain at least one special character.";
    }

    if (!basic.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required.";
    } else if (basic.confirmPassword !== basic.password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (!basic.department) {
      errors.department = "Department is required.";
    }

    // if (!basic.productionStages) {
    //   errors.productionStages = "At least one production stage is required.";
    // }

    this.setState((prevState) => ({
      validationErrors: {
        ...prevState.validationErrors,
        basic: errors,
      },
      validFields: {
        ...prevState.validFields,
        basic: {
          firstname: !!basic.firstname,
          email: !!basic.email,
          contactNo: !!basic.contactNo,
          username: !!basic.username,
          password: !!basic.password,
          confirmPassword: !!basic.confirmPassword,
          department: !!basic.department,
          //productionStages: !!basic.productionStages,
        },
      },
    }));

    return Object.keys(errors).length === 0;
  };

  /**
   * Validates the User Modules tab of the registration form.
   */
  validateUserModulesTab = () => {
    const { "user-module": userModule } = this.state.formData;
    const errors = {};

    if (userModule.assignedModules.length === 0) {
      errors.modules = "Please assign at least one module.";
    }

    this.setState((prevState) => ({
      validationErrors: {
        ...prevState.validationErrors,
        "user-module": errors,
      },
      validFields: {
        ...prevState.validFields,
        "user-module": {
          modules: userModule.assignedModules.length > 0,
        },
      },
    }));

    return userModule.assignedModules.length > 0;
  };

  /**
   * Validates the User Roles tab of the registration form.
   */
  validateUserRolesTab = () => {
    const { "user-module": userModule } = this.state.formData;
    const errors = {};

    // Validate each assigned module
    userModule.assignedModules.forEach((module) => {
      if (module.roles.assignedRoles.length === 0) {
        errors[
          module.id
        ] = `Please assign at least one role for module ${module.name.toLowerCase()}.`;
      }
    });

    this.setState((prevState) => ({
      validationErrors: { ...prevState.validationErrors, "user-role": errors },
    }));

    return Object.keys(errors).length === 0;
  };

  /**
   * Validates the Role Permissions tab of the registration form.
   */
  validateRolePermissionsTab = () => {
    const { "user-module": userModule } = this.state.formData;
    const errors = {};

    // Validate each assigned module
    userModule.assignedModules.forEach((module) => {
      module.roles.assignedRoles.forEach((role) => {
        if (role.permissions.assignedPermissions.length === 0) {
          errors[
            role.id
          ] = `Please assign at least one permission for role ${role.name.toLowerCase()}.`;
        }
      });
    });

    console.log(errors);

    this.setState((prevState) => ({
      validationErrors: {
        ...prevState.validationErrors,
        "role-permission": errors,
      },
    }));

    return Object.keys(errors).length === 0;
  };

  /**
   * Fetches Modules for the selected Company
   */
  async fetchCompanyModules() {
    const companyId = this.state.formData.basic.companyId;
    try {
      const modulesData = await company_modules_api(companyId);
      const modulesArray = modulesData.data.result || [];

      this.setState((prevState) => ({
        formData: {
          ...prevState.formData,
          "user-module": {
            ...prevState.formData["user-module"],
            assignedModules: [],
            availableModules: modulesArray.map((module) => ({
              id: module.subscriptionModule.moduleId,
              name: module.subscriptionModule.module.moduleName,
              subscriptionModuleId: module.subscriptionModuleId,
              roles: {
                assignedRoles: [],
                availableRoles: [],
              },
            })),
          },
        },
      }));
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  }

  /**
   * Fetches Roles for the assigned Modules
   */
  async fetchModuleRoles() {
    let isFetchRequired = false;
    this.state.formData["user-module"].assignedModules.forEach((module) => {
      if (module.roles.availableRoles.length === 0) {
        isFetchRequired = true;
      }
    });

    if (!isFetchRequired) {
      return;
    }

    const assignedModuleIds = this.state.formData[
      "user-module"
    ].assignedModules.map((module) => module.id);

    if (assignedModuleIds.length > 0) {
      try {
        const rolesData = await module_roles_api(assignedModuleIds);

        this.setState((prevState) => ({
          formData: {
            ...prevState.formData,
            "user-module": {
              ...prevState.formData["user-module"],
              assignedModules: prevState.formData[
                "user-module"
              ].assignedModules.map((assignedModule) => {
                const moduleId = assignedModule.id.toString();
                const moduleRoles = rolesData.data.result[moduleId];

                if (!moduleRoles) {
                  return assignedModule;
                }

                return {
                  ...assignedModule,
                  roles: {
                    availableRoles: moduleRoles.map((role) => ({
                      id: role.roleId,
                      name: role.roleName,
                      permissions: {
                        assignedPermissions: [],
                        availablePermissions: [],
                      },
                    })),
                    assignedRoles: [],
                  },
                };
              }),
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    }
  }

  /**
   * Fetches Permissions for the assigned Roles
   */
  async fetchRolePermissions() {
    let isFetchRequired = false;
    this.state.formData["user-module"].assignedModules.forEach((module) => {
      module.roles.assignedRoles.forEach((role) => {
        if (role.permissions.availablePermissions.length === 0) {
          isFetchRequired = true;
        }
      });
    });

    if (!isFetchRequired) {
      return;
    }

    const assignedRoleIds = this.state.formData[
      "user-module"
    ].assignedModules.flatMap((module) =>
      module.roles.assignedRoles.map((role) => role.id)
    );

    if (assignedRoleIds.length > 0) {
      try {
        const permissions = await role_permissions_api(assignedRoleIds);
        const permissionsData = permissions.data.result;

        this.setState((prevState) => ({
          formData: {
            ...prevState.formData,
            "user-module": {
              ...prevState.formData["user-module"],
              assignedModules: prevState.formData[
                "user-module"
              ].assignedModules.map((assignedModule) => {
                return {
                  ...assignedModule,
                  roles: {
                    ...assignedModule.roles,
                    assignedRoles: assignedModule.roles.assignedRoles.map(
                      (assignedRole) => {
                        const roleId = assignedRole.id.toString();
                        const rolePermissions = permissionsData[roleId];

                        if (!rolePermissions) {
                          console.error(
                            "No permissions found for role ID:",
                            roleId
                          );
                          return assignedRole;
                        }

                        return {
                          ...assignedRole,
                          permissions: {
                            assignedPermissions: [],
                            availablePermissions: rolePermissions.map(
                              (permission) => ({
                                id: permission.permission.permissionId,
                                name: permission.permission.permissionName,
                              })
                            ),
                          },
                        };
                      }
                    ),
                  },
                };
              }),
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    }
  }

  /**
   * Handles the Save button click
   */
  handleSave = async () => {
    const isBasicValid = this.validateUserInfoTab();
    const isUserModuleValid = this.validateUserModulesTab();
    const isUserRoleValid = this.validateUserRolesTab();
    const isRolePermissionValid = this.validateRolePermissionsTab();

    if (
      isBasicValid &&
      isUserModuleValid &&
      isUserRoleValid &&
      isRolePermissionValid
    ) {
      const saveSuccessful = await this.saveRegistrationData();
      if (saveSuccessful) {
        this.setState({ showSuccessAlert: true });

        setTimeout(() => {
          this.setState({ showSuccessAlert: false, showFailureAlert: false });
          this.resetState();
        }, 3000);

        window.location.href = "/main";
        // window.location.href = "/userAccount";
      } else {
        this.setState({ showFailureAlert: true });

        setTimeout(() => {
          this.setState({ showFailureAlert: false });
        }, 5000);
      }
    }
  };

  /**
   * Save the Registration data
   */
  async saveRegistrationData() {
    try {
      console.log("Starting registration process...");
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
        locationId: this.state.formData.basic.department,
        permissionId: permissionId,
      };

      console.log("Sending user registration data:", basicUserData);
      const registrationResponse = await user_registration_api(basicUserData);
      console.log("User registration response:", registrationResponse);

      if (
        registrationResponse.status === 201 &&
        registrationResponse.data &&
        registrationResponse.data.result &&
        registrationResponse.data.result.userId
      ) {
        const userId = registrationResponse.data.result.userId;

        const departmentLocationId = this.state.formData.basic.department;
        if (departmentLocationId) {
          console.log("Saving department location...");

          const locationData = {
            locationId: parseInt(departmentLocationId),
            userId: userId,
            permissionId: permissionId,
          };

          await post_user_location_api(locationData);
          console.log("Department location saved.");
        }

        // Save warehouse location
        const warehouseLocationId = this.state.formData.basic.warehouse;
        if (warehouseLocationId) {
          console.log("Saving warehouse location...");
          const locationData = {
            locationId: parseInt(warehouseLocationId),
            userId: userId,
            permissionId: permissionId,
          };

          await post_user_location_api(locationData);
          console.log("Warehouse location saved.");
        }

        const userModulesFromData = this.state.formData[
          "user-module"
        ].assignedModules.map((module, index) => ({
          companySubscriptionModuleId: module.subscriptionModuleId,
          userId: userId,
          permissionId: permissionId,
        }));

        for (const userModuleData of userModulesFromData) {
          console.log("Sending user module data:", userModuleData);
          const userModuleResponse = await company_subscription_module_user_api(
            userModuleData
          );
          console.log("User module response:", userModuleResponse);
        }

        // Prepare data for user_role_api
        const userRolesFromData = this.state.formData[
          "user-module"
        ].assignedModules
          .map((module) => module.roles.assignedRoles)
          .flat()
          .map((role) => ({
            userId: userId,
            roleId: role.id,
            permissionId: permissionId,
          }));

        for (const userRoleData of userRolesFromData) {
          console.log("Sending user role data:", userRoleData);
          const userRoleResponse = await user_role_api(userRoleData);
          console.log("User role response:", userRoleResponse);
        }

        // Prepare data for user_permission_api
        const userPermissionsFromData = [];
        this.state.formData["user-module"].assignedModules.forEach((module) => {
          module.roles.assignedRoles.forEach((role) => {
            role.permissions.assignedPermissions.forEach((permission) => {
              userPermissionsFromData.push({
                userId: userId,
                permissionId: permission.id,
              });
            });
          });
        });

        for (const userPermissionData of userPermissionsFromData) {
          console.log("Sending user permission data:", userPermissionData);
          const userPermissionResponse = await user_permission_api(
            userPermissionData
          );
          console.log("User permission response:", userPermissionResponse);
        }

        console.log("Registration successful! All data saved.");
        this.setState({ showSuccessAlert: true });
        return true;
      } else {
        this.setState({ registrationSuccessful: false });
        this.setState({
          registrationErrorMessage: registrationResponse.message,
        });
        console.error("User registration failed:", registrationResponse);
        return false;
      }
    } catch (error) {
      console.error("Error saving user information:", error);
      return false;
    }
  }

  resetValidationErrors = (tabName) => {
    this.setState((prevState) => ({
      validationErrors: {
        ...prevState.validationErrors,
        [tabName]: {},
      },
    }));
  };

  resetState = () => {
    this.setState({
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
          department: "",
          //productionStages: [],
        },
        "user-module": {
          assignedModules: [],
          availableModules: [],
        },
      },
      activeTab: "basic",
      registrationSuccessful: false,
      showSuccessAlert: false,
      showFailureAlert: false,
      validFields: {
        basic: {},
      },
      validationErrors: {
        basic: {},
        "user-module": {},
        "user-role": {},
        "role-permission": {},
      },
    });
  };

  render() {
    return template.call(this);
  }
}

export default Registration;
