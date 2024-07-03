import React from "react";
import template from "./registration.jsx";
import {
  company_modules_api,
  post_user_location_api,
  module_roles_api,
  module_permissions_api,
  user_registration_api,
  company_subscription_module_user_api,
  get_company_subscription_module_id_api,
  user_role_api,
  user_permission_api,
  role_permission_api,
} from "../../services/userManagementApi.js";
import { get_company_locations_api } from "../../services/purchaseApi";

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
          department: "",
          warehouse: [],
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
      fetchedAssignedModuleIds: [],
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
      locations: [],
      loading: false, // Flag to indicate loading state
    };
  }

  validateBasicTab = () => {
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

    // TODO : Add more validations for the password field as needed.
    if (!basic.password) {
      errors.password = "Password is required.";
    } else if (basic.password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    }

    if (!basic.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required.";
    } else if (basic.confirmPassword !== basic.password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (!basic.department) {
      errors.department = "Department is required.";
    }

    this.setState({
      validationErrors: { ...this.state.validationErrors, basic: errors },
      validFields: {
        ...this.state.validFields,
        basic: {
          ...this.state.validFields.basic,
          firstname: !errors.firstname,
          username: !errors.username,
          email: !errors.email,
          contactNo: !errors.contactNo,
          password: !errors.password,
          confirmPassword: !errors.confirmPassword,
          department: !errors.department,
        },
      },
    });

    return Object.keys(errors).length === 0;
  };

  validateUserModuleTab = () => {
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

  validateUserRoleTab = () => {
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

  validateRolePermissionTab = () => {
    const { "user-module": userModule } = this.state.formData;
    const errors = {};

    // Validate each assigned module
    userModule.assignedModules.forEach((module) => {
      if (module.permissions.assignedPermissions.length === 0) {
        errors[
          module.id
        ] = `Please assign at least one permission for module ${module.name.toLowerCase()}.`;
      }
    });

    this.setState((prevState) => ({
      validationErrors: {
        ...prevState.validationErrors,
        "role-permission": errors,
      },
    }));

    return Object.keys(errors).length === 0;
  };

  // Handle next button click
  handleNext = async () => {
    switch (this.state.activeTab) {
      case "basic":
        const isBasicTabValid = this.validateBasicTab();
        if (isBasicTabValid) {
          await this.fetchCompanyModules();
          this.setState({ activeTab: "user-module" });
        }
        break;
      case "user-module":
        const isUserModuleTabValid = this.validateUserModuleTab();
        if (isUserModuleTabValid) {
          await this.fetchRolesPermissions();
        }
        break;
      case "user-role":
        const isUserRoleTabValid = this.validateUserRoleTab();
        if (isUserRoleTabValid) {
          this.setState({ activeTab: "role-permission" });
        }
        break;
      default:
        break;
    }
  };

  // handle previous button click
  handlePrevious = () => {
    switch (this.state.activeTab) {
      case "user-module":
        this.resetValidationErrors("user-module");
        this.setState({ activeTab: "basic" });
        break;
      case "user-role":
        this.resetValidationErrors("user-role");
        this.setState({ activeTab: "user-module" });
        break;
      case "role-permission":
        this.resetValidationErrors("role-permission");
        this.setState({ activeTab: "user-role" });
        break;
      default:
        break;
    }
  };

  //Save the user data
  handleSave = async () => {
    const isBasicValid = this.validateBasicTab();
    const isUserModuleValid = this.validateUserModuleTab();
    const isUserRoleValid = this.validateUserRoleTab();
    const isRolePermissionValid = this.validateRolePermissionTab();

    if (
      isBasicValid &&
      isUserModuleValid &&
      isUserRoleValid &&
      isRolePermissionValid
    ) {
      // Set loading to true to show loading spinner
      this.setState({ loading: true });
      const saveSuccessful = await this.saveRegistrationData();
      if (saveSuccessful) {
        this.setState({ showSuccessAlert: true, loading: false });

        setTimeout(() => {
          this.setState({ showSuccessAlert: false, showFailureAlert: false });
          this.resetState();
        }, 3000);
      } else {
        this.setState({ showFailureAlert: true, loading: false });

        setTimeout(() => {
          this.setState({ showFailureAlert: false });
        }, 3000);
      }
    }
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

  async saveRegistrationData() {
    try {
      this.setState({ registrationSuccessful: true });

      // Extract assigned module IDs as a single number
      const assignedModuleIds = this.state.formData[
        "user-module"
      ].assignedModules.map((module) => module.id);
      const permissionId = 3;

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

        const permissionId = 1085;

        await this.postUserLocationData(userId, permissionId);

        // Extract assigned module IDs
        const assignedModuleIds = this.state.formData[
          "user-module"
        ].assignedModules.map((module) => module.id);

        // Fetch company subscription module IDs and prepare data
        const userModulesFromData = await Promise.all(
          assignedModuleIds.map(async (module) => {
            const response = await get_company_subscription_module_id_api(
              sessionStorage.getItem("companyId"),
              module
            );
            return {
              companySubscriptionModuleId: response.data.result,
              userId: userId,
              permissionId: permissionId,
            };
          })
        );

        // Loop through the prepared data and call the API for each row
        for (const userModuleData of userModulesFromData) {
          const userModuleResponse = await company_subscription_module_user_api(
            userModuleData
          );

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
          const userRoleResponse = await user_role_api(userRoleData);

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
          const userPermissionResponse = await user_permission_api(
            userPermissionData
          );

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
          const rolePermissionResponse = await role_permission_api(
            rolePermissionData
          );
          console.log("Role Permission Response:", rolePermissionResponse);
        }
        // Log success message
        console.log("Registration successful! , Data saved");
        this.setState({ showSuccessAlert: true });
        return true;
      } else {
        this.setState({ registrationSuccessful: false });
        console.error("User registration failed:", registrationResponse);
        return false;
      }
    } catch (error) {
      console.error("Error saving user information:", error);
      return false;
    }
  }

  async fetchRolesPermissions() {
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
        // Fetch roles and permissions for the assigned modules
        const rolesData = await module_roles_api(assignedModuleIds);
        const permissionData = await module_permissions_api(assignedModuleIds);
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
                    assignedRoles: [], // Keep assignedRoles
                  },
                  permissions: {
                    availablePermissions: modulePermissions.map(
                      (permission) => ({
                        id: permission.permissionId,
                        name: permission.permissionName,
                      })
                    ),
                    assignedPermissions: [], // Keep assignedPermissions
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
  }

  async fetchCompanyModules() {
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
          prevCompanyId: companyId, // Update prevCompanyId
        }));
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    } else {
      // If companyId has not changed, just move to the next tab
      this.setState({ activeTab: "user-module" });
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

  componentDidMount() {
    // Fetch locations when the component mounts
    this.fetchLocations();
    window.addEventListener("beforeunload", this.handleBeforeUnload);
  }

  fetchLocations = () => {
    get_company_locations_api(sessionStorage.getItem("companyId"))
      .then((response) => {
        const locations = response.data.result;
        this.setState({ locations });
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
      });
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
        },
        "user-module": {
          assignedModules: [],
          availableModules: [],
        },
      },
      activeTab: "basic",
      prevCompanyId: 0,
      fetchedAssignedModuleIds: [],
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

  prepareUserLocationData = (userId, permissionId) => {
    const { department, warehouse } = this.state.formData.basic;

    // Gather all location IDs
    const locationIds = [];
    if (department) {
      locationIds.push(department);
    }
    if (warehouse.length > 0) {
      locationIds.push(...warehouse);
    }

    // Format the data
    const userLocationData = locationIds.map((locationId) => ({
      locationId: locationId,
      userId: userId,
      permissionId: permissionId,
    }));

    return userLocationData;
  };

  postUserLocationData = async (userId, permissionId) => {
    const userLocationData = this.prepareUserLocationData(userId, permissionId);

    try {
      // Post each location data individually
      for (const data of userLocationData) {
        const response = await post_user_location_api(data);
        console.log("User location data posted successfully:", response);
      }
    } catch (error) {
      console.error("Error posting user location data:", error);
    }
  };

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
  }

  handleBeforeUnload = (e) => {
    if (this.state.loading) {
      e.preventDefault();
      e.returnValue = "";
    }
  };

  render() {
    return template.call(this);
  }
}

export default registration;
