import React from "react";
import template from "./registeredUserUpdate.jsx";
import {
  company_modules_api,
  module_roles_api,
  get_user_permissions_by_user_id_api,
  put_registration_api,
  get_user_by_user_id,
  get_user_modules_by_user_id_api,
  get_user_roles_by_user_id_api,
  getUserLocationsByUserId,
  userLocations_update_api,
  update_company_subscription_module_user_api,
  update_user_role_api,
  update_user_permissions_api,
  role_permissions_api,
} from "../../../services/userManagementApi.js";
import { get_company_locations_api } from "../../../services/purchaseApi.js";

class UpdateRegistration extends React.Component {
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
          companyId: sessionStorage.getItem("companyId") || "",
          department: "",
          warehouse: "",
          productionStages: [],
          status: false,
        },
        "user-module": {
          availableModules: [],
          assignedModules: [],
        },
        "user-role": {
          assignedRoles: [],
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
      locations: [],
      availableProductionStages: [],
      selectedProductionStageId: "",
      isAssignedModulesFetched: false,
      isAssignedRolesFetched: false,
      isAssignedPermissionsFetched: false,
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchInitialData();
  }

  /**
   * Fetches initial data (Production stages, locations) from the API and updates the component state.
   */
  fetchInitialData = async () => {
    const companyId = sessionStorage.getItem("companyId");
    const userId = this.props.userId;

    //const productionStages = await get_production_stage();
    const locations = await get_company_locations_api(companyId);
    await this.fetchCompanyModules();

    //const assignedProductionStagesData =
    //   await get_user_production_stage_mapping_by_user_id_api(userId);
    // const assignedProductionStages =
    //   assignedProductionStagesData.data.result.map((item) => ({
    //     id: item.productionStage.id,
    //     name: item.productionStage.name,
    //   }));

    const assignedUserInfoData = await get_user_by_user_id(parseInt(userId));
    const assignedUserInfo = assignedUserInfoData.data.result;
    const userLocations = await getUserLocationsByUserId(userId);
    const userDepartment = userLocations.data.result?.find(
      (item) => item.location.locationTypeId === 3
    );
    const userWarehouse = userLocations.data.result?.find(
      (item) => item.location.locationTypeId === 2
    );

    this.setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        basic: {
          ...prev.formData.basic,
          firstname: assignedUserInfo.firstname,
          lastname: assignedUserInfo.lastname,
          username: assignedUserInfo.username,
          status: assignedUserInfo.status ? "active" : "inactive",
          email: assignedUserInfo.email,
          contactNo: assignedUserInfo.contactNo,
          department: userDepartment?.locationId,
          warehouse: userWarehouse?.locationId,
          companyId: assignedUserInfo.companyId,
          //productionStages: assignedProductionStages,
        },
      },
      //availableProductionStages: productionStages.data.result,
      locations: locations.data.result,
    }));
  };

  /**
   * Handles the "Next" button click and navigates to the next tab.
   * */
  handleNext = async () => {
    switch (this.state.activeTab) {
      case "basic":
        const isBasicTabValid = this.validateUserInfoTab();
        if (isBasicTabValid) {
          if (!this.state.isAssignedModulesFetched) {
            await this.fetchAssignedModules();
          }
          this.setState((prev) => ({ ...prev, activeTab: "user-module" }));
        }
        break;
      case "user-module":
        const isUserModuleTabValid = this.validateUserModulesTab();
        if (isUserModuleTabValid) {
          await this.fetchModuleRoles();
          if (!this.state.isAssignedRolesFetched) {
            await this.fetchAssignedRoles();
          }
          this.setState((prev) => ({ ...prev, activeTab: "user-role" }));
        }
        break;
      case "user-role":
        const isUserRoleTabValid = this.validateUserRolesTab();
        if (isUserRoleTabValid) {
          await this.fetchRolePermissions();
          if (!this.state.isAssignedPermissionsFetched) {
            await this.fetchAssignedPermissions();
          }
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
   * Handles the selection of a production stage.
   */
  handleSelectProductionStage = (e) => {
    const selectedStageId = e.target.value;

    const existingStage = this.state.formData.basic.productionStages.find(
      (stage) => stage.id === Number(selectedStageId)
    );

    if (existingStage) return;

    const selectedStage = this.state.availableProductionStages.find(
      (stage) => stage.id === Number(selectedStageId)
    );

    if (selectedStage) {
      const latestProStages = [
        ...this.state.formData.basic.productionStages,
        {
          id: selectedStage.id,
          name: selectedStage.name,
        },
      ];

      this.setState((prevState) => ({
        formData: {
          ...prevState.formData,
          basic: {
            ...prevState.formData.basic,
            productionStages: latestProStages,
          },
        },
      }));
    }
  };

  /**
   * Handles the removal of a production stage.
   */
  handleRemoveProductionStage = (stageId) => {
    const latestProStages = this.state.formData.basic.productionStages.filter(
      (stage) => stage.id !== stageId
    );

    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        basic: {
          ...prevState.formData.basic,
          productionStages: latestProStages,
        },
      },
    }));
  };

  /**
   * Handles the selection of a Module.
   */
  // handleSelectModule = (moduleId) => {
  //   const selectedModule = this.state.formData[
  //     "user-module"
  //   ].availableModules.find((module) => module.id === parseInt(moduleId, 10));

  //   if (selectedModule) {
  //     if (
  //       this.state.formData["user-module"].assignedModules.some(
  //         (module) => module.id === selectedModule.id
  //       )
  //     ) {
  //       return;
  //     }

  //     const latestModules = [
  //       ...this.state.formData["user-module"].assignedModules,
  //       selectedModule,
  //     ];

  //     this.setState((prevState) => ({
  //       formData: {
  //         ...prevState.formData,
  //         "user-module": {
  //           ...prevState.formData["user-module"],
  //           assignedModules: latestModules,
  //         },
  //       },
  //     }));
  //   }
  // };

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
  // handleRemoveModule = (moduleId) => {
  //   const latestModules = this.state.formData[
  //     "user-module"
  //   ].assignedModules.filter((module) => module.id !== moduleId);

  //   this.setState((prevState) => ({
  //     formData: {
  //       ...prevState.formData,
  //       "user-module": {
  //         ...prevState.formData["user-module"],
  //         assignedModules: latestModules,
  //       },
  //     },
  //   }));
  // };

  handleRemoveModule = (moduleId) => {
    const moduleToRemove = this.state.formData[
      "user-module"
    ].assignedModules.find((module) => module.id === moduleId);

    const updatedAssignedModules = this.state.formData[
      "user-module"
    ].assignedModules.filter((module) => module.id !== moduleId);

    const updatedAvailableModules = [
      ...this.state.formData["user-module"].availableModules,
      moduleToRemove,
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
  };

  /**
   * Handles the selection of a Role.
   */
  // handleSelectRole = (roleId, moduleId) => {
  //   const selectedModule = this.state.formData[
  //     "user-module"
  //   ].assignedModules.find((module) => module.id === moduleId);

  //   if (!selectedModule) return;

  //   const selectedRole = selectedModule.roles.availableRoles.find(
  //     (role) => role.id === parseInt(roleId, 10)
  //   );

  //   if (!selectedRole) return;

  //   const existingRole = selectedModule.roles.assignedRoles.find(
  //     (role) => role.id === selectedRole.id
  //   );

  //   if (existingRole) return;

  //   const updatedModules = this.state.formData[
  //     "user-module"
  //   ].assignedModules.map((module) => {
  //     if (module.id === moduleId) {
  //       module.roles.assignedRoles.push(selectedRole);
  //     }
  //     return module;
  //   });

  //   this.setState((prevState) => ({
  //     formData: {
  //       ...prevState.formData,
  //       "user-module": {
  //         ...prevState.formData["user-module"],
  //         assignedModules: updatedModules,
  //       },
  //     },
  //   }));
  // };

  handleSelectRole = (roleId, moduleId) => {
    const selectedModule = this.state.formData[
      "user-module"
    ].assignedModules.find((module) => module.id === moduleId);
    if (!selectedModule) return;

    const selectedRole = selectedModule.roles.availableRoles.find(
      (role) => role.id === parseInt(roleId, 10)
    );
    if (!selectedRole) return;

    const existingRole = selectedModule.roles.assignedRoles.find(
      (role) => role.id === selectedRole.id
    );
    if (existingRole) return;

    const updatedModules = this.state.formData[
      "user-module"
    ].assignedModules.map((module) => {
      if (module.id === moduleId) {
        return {
          ...module,
          roles: {
            assignedRoles: [...module.roles.assignedRoles, selectedRole],
            availableRoles: module.roles.availableRoles.filter(
              (role) => role.id !== selectedRole.id
            ), // ✅ FIX
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
  // handleRemoveRole = (roleId, moduleId) => {
  //   const updatedModules = this.state.formData["user-module"].assignedModules;

  //   updatedModules.forEach((module) => {
  //     if (module.id === moduleId) {
  //       module.roles.assignedRoles = module.roles.assignedRoles.filter(
  //         (role) => role.id !== roleId
  //       );
  //     }
  //   });

  //   this.setState((prevState) => ({
  //     formData: {
  //       ...prevState.formData,
  //       "user-module": {
  //         ...prevState.formData["user-module"],
  //         assignedModules: updatedModules,
  //       },
  //     },
  //   }));
  // };

  handleRemoveRole = (roleId, moduleId) => {
    const updatedModules = this.state.formData[
      "user-module"
    ].assignedModules.map((module) => {
      if (module.id === moduleId) {
        const removedRole = module.roles.assignedRoles.find(
          (role) => role.id === roleId
        );

        return {
          ...module,
          roles: {
            assignedRoles: module.roles.assignedRoles.filter(
              (role) => role.id !== roleId
            ),
            availableRoles: [...module.roles.availableRoles, removedRole], // ✅ FIX: return it to available
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
  // handleSelectPermission = (moduleId, roleId, permissionId) => {
  //   permissionId = parseInt(permissionId, 10);

  //   let updatedModules = this.state.formData["user-module"].assignedModules;

  //   updatedModules = updatedModules.map((module) => {
  //     if (module.id === moduleId) {
  //       return {
  //         ...module,
  //         roles: {
  //           ...module.roles,
  //           assignedRoles: module.roles.assignedRoles.map((role) => {
  //             if (role.id === roleId) {
  //               if (
  //                 role.permissions.assignedPermissions.find(
  //                   (permission) => permission.id === permissionId
  //                 )
  //               ) {
  //                 return role;
  //               }

  //               const permissionName =
  //                 role.permissions.availablePermissions.find(
  //                   (permission) => permission.id === permissionId
  //                 ).name;

  //               return {
  //                 ...role,
  //                 permissions: {
  //                   ...role.permissions,
  //                   assignedPermissions: [
  //                     ...role.permissions.assignedPermissions,
  //                     {
  //                       id: permissionId,
  //                       name: permissionName,
  //                     },
  //                   ],
  //                 },
  //               };
  //             }
  //             return role;
  //           }),
  //         },
  //       };
  //     }
  //     return module;
  //   });

  //   this.setState((prevState) => ({
  //     formData: {
  //       ...prevState.formData,
  //       "user-module": {
  //         ...prevState.formData["user-module"],
  //         assignedModules: updatedModules,
  //       },
  //     },
  //   }));
  // };

  // handleSelectPermission = (moduleId, roleId, permissionId) => {
  //   permissionId = parseInt(permissionId, 10);
  //   console.log(`[SELECT] Selecting permission ${permissionId} for role ${roleId} in module ${moduleId}`);

  //   const updatedModules = this.state.formData["user-module"].assignedModules.map((module) => {
  //     if (module.id === moduleId) {
  //       return {
  //         ...module,
  //         roles: {
  //           ...module.roles,
  //           assignedRoles: module.roles.assignedRoles.map((role) => {
  //             if (role.id === roleId) {
  //               const permission = role.permissions.availablePermissions.find(p => p.id === permissionId);

  //               if (!permission) {
  //                 console.warn(`[SELECT] Permission ID ${permissionId} not found in availablePermissions.`);
  //                 return role;
  //               }

  //               return {
  //                 ...role,
  //                 permissions: {
  //                   assignedPermissions: [...role.permissions.assignedPermissions, permission],
  //                   availablePermissions: role.permissions.availablePermissions.filter(p => p.id !== permissionId),
  //                 },
  //               };
  //             }
  //             return role;
  //           }),
  //         },
  //       };
  //     }
  //     return module;
  //   });

  //   this.setState((prevState) => ({
  //     formData: {
  //       ...prevState.formData,
  //       "user-module": {
  //         ...prevState.formData["user-module"],
  //         assignedModules: updatedModules,
  //       },
  //     },
  //   }));
  // };

  handleSelectPermission = (moduleId, roleId, permissionId) => {
    permissionId = parseInt(permissionId, 10);
    console.log(
      `[SELECT] Selecting permission ${permissionId} for role ${roleId} in module ${moduleId}`
    );

    const updatedModules = this.state.formData[
      "user-module"
    ].assignedModules.map((module) => {
      if (module.id === moduleId) {
        return {
          ...module,
          roles: {
            ...module.roles,
            assignedRoles: module.roles.assignedRoles.map((role) => {
              if (role.id === roleId) {
                const { assignedPermissions, availablePermissions } =
                  role.permissions;

                // Filter out from availablePermissions
                const updatedAvailable = availablePermissions.filter(
                  (p) => p.id !== permissionId
                );

                // Prevent duplicates in assignedPermissions
                const alreadyAssigned = assignedPermissions.some(
                  (p) => p.id === permissionId
                );
                if (alreadyAssigned) {
                  console.warn(
                    `[SELECT] Permission ${permissionId} already assigned, skipping.`
                  );
                  return role;
                }

                // Find the permission to add
                const permissionToAdd = availablePermissions.find(
                  (p) => p.id === permissionId
                );
                if (!permissionToAdd) {
                  console.warn(
                    `[SELECT] Permission ${permissionId} not found in availablePermissions.`
                  );
                  return role;
                }

                return {
                  ...role,
                  permissions: {
                    assignedPermissions: [
                      ...assignedPermissions,
                      permissionToAdd,
                    ],
                    availablePermissions: updatedAvailable,
                  },
                };
              }
              return role;
            }),
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

  // handleRemovePermission = (moduleId, roleId, permissionId) => {
  //   permissionId = parseInt(permissionId, 10);

  //   let updatedModules = this.state.formData["user-module"].assignedModules;

  //   updatedModules = updatedModules.map((module) => {
  //     if (module.id === moduleId) {
  //       return {
  //         ...module,
  //         roles: {
  //           ...module.roles,
  //           assignedRoles: module.roles.assignedRoles.map((role) => {
  //             if (role.id === roleId) {
  //               if (
  //                 !role.permissions.assignedPermissions.find(
  //                   (permission) => permission.id === permissionId
  //                 )
  //               ) {
  //                 return role;
  //               }

  //               return {
  //                 ...role,
  //                 permissions: {
  //                   ...role.permissions,
  //                   assignedPermissions:
  //                     role.permissions.assignedPermissions.filter(
  //                       (permission) => permission.id !== permissionId
  //                     ),
  //                 },
  //               };
  //             }
  //             return role;
  //           }),
  //         },
  //       };
  //     }
  //     return module;
  //   });

  //   this.setState((prevState) => ({
  //     formData: {
  //       ...prevState.formData,
  //       "user-module": {
  //         ...prevState.formData["user-module"],
  //         assignedModules: updatedModules,
  //       },
  //     },
  //   }));
  // };

  // handleRemovePermission = (moduleId, roleId, permissionId) => {
  //   permissionId = parseInt(permissionId, 10);
  //   console.log(`[REMOVE] Removing permission ${permissionId} from role ${roleId} in module ${moduleId}`);

  //   const updatedModules = this.state.formData["user-module"].assignedModules.map((module) => {
  //     if (module.id === moduleId) {
  //       return {
  //         ...module,
  //         roles: {
  //           ...module.roles,
  //           assignedRoles: module.roles.assignedRoles.map((role) => {
  //             if (role.id === roleId) {
  //               const permission = role.permissions.assignedPermissions.find(p => p.id === permissionId);

  //               if (!permission) {
  //                 console.warn(`[REMOVE] Permission ID ${permissionId} not found in assignedPermissions.`);
  //                 return role;
  //               }

  //               return {
  //                 ...role,
  //                 permissions: {
  //                   assignedPermissions: role.permissions.assignedPermissions.filter(p => p.id !== permissionId),
  //                   availablePermissions: [...role.permissions.availablePermissions, permission],
  //                 },
  //               };
  //             }
  //             return role;
  //           }),
  //         },
  //       };
  //     }
  //     return module;
  //   });

  //   this.setState((prevState) => ({
  //     formData: {
  //       ...prevState.formData,
  //       "user-module": {
  //         ...prevState.formData["user-module"],
  //         assignedModules: updatedModules,
  //       },
  //     },
  //   }));
  // };

  handleRemovePermission = (moduleId, roleId, permissionId) => {
    permissionId = parseInt(permissionId, 10);
    console.log(
      `[REMOVE] Removing permission ${permissionId} from role ${roleId} in module ${moduleId}`
    );

    const updatedModules = this.state.formData[
      "user-module"
    ].assignedModules.map((module) => {
      if (module.id === moduleId) {
        return {
          ...module,
          roles: {
            ...module.roles,
            assignedRoles: module.roles.assignedRoles.map((role) => {
              if (role.id === roleId) {
                const { assignedPermissions, availablePermissions } =
                  role.permissions;

                // Filter out from assignedPermissions
                const updatedAssigned = assignedPermissions.filter(
                  (p) => p.id !== permissionId
                );

                // Prevent duplicates in availablePermissions
                const alreadyAvailable = availablePermissions.some(
                  (p) => p.id === permissionId
                );
                if (alreadyAvailable) {
                  console.warn(
                    `[REMOVE] Permission ${permissionId} already available, skipping.`
                  );
                  return role;
                }

                // Find the permission to move back
                const permissionToMove = assignedPermissions.find(
                  (p) => p.id === permissionId
                );
                if (!permissionToMove) {
                  console.warn(
                    `[REMOVE] Permission ${permissionId} not found in assignedPermissions.`
                  );
                  return role;
                }

                return {
                  ...role,
                  permissions: {
                    assignedPermissions: updatedAssigned,
                    availablePermissions: [
                      ...availablePermissions,
                      permissionToMove,
                    ],
                  },
                };
              }
              return role;
            }),
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

    if (!basic.department) {
      errors.department = "Department is required.";
    }

    if (!basic.productionStages) {
      errors.productionStages = "At least one production stage is required.";
    }

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
          department: !!basic.department,
          productionStages: !!basic.productionStages,
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
              subscriptionModuleId:
                module.subscriptionModule.subscriptionModuleId,
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
   * Fetches already assigned Modules
   */
  // async fetchAssignedModules() {
  //   const assignedModulesData = await get_user_modules_by_user_id_api(
  //     this.props.userId
  //   );
  //   const assignedModules = assignedModulesData.data.result;

  //   console.log(
  //     assignedModules,
  //     this.state.formData["user-module"].availableModules
  //   );
  //   const detailedAssignedModules = assignedModules.map((module) => {
  //     const alreadyAvailableModule = this.state.formData[
  //       "user-module"
  //     ].availableModules.find(
  //       (availableModule) => availableModule.id === module.moduleId
  //     );

  //     return {
  //       id: module.moduleId,
  //       name: module.moduleName,
  //       status: module.status,
  //       subscriptionModuleId: alreadyAvailableModule.subscriptionModuleId,
  //       subModules: module.subModules,
  //       handShake: module.handShake,
  //       roles: {
  //         assignedRoles: [],
  //         availableRoles: [],
  //       },
  //     };
  //   });

  //   const assignedIds = detailedAssignedModules.map((m) => m.id);
  //   const availableModules = this.state.formData["user-module"].availableModules.filter((m) => !assignedIds.includes(m.moduleId));
  //   console.log("availableModules", availableModules);
  //   console.log("detailedAssignedModules", detailedAssignedModules);
  //   console.log("assignedIds", assignedIds);
  //   console.log("formData.userModule List" , this.state.formData["user-module"]);

  //   this.setState((prevState) => ({
  //     formData: {
  //       ...prevState.formData,
  //       "user-module": {
  //         ...prevState.formData["user-module"],
  //         assignedModules: detailedAssignedModules,
  //         // availableModules: availableModules,
  //       },
  //     },
  //     isAssignedModulesFetched: true,
  //   }));
  // }

  async fetchAssignedModules() {
    const assignedModulesData = await get_user_modules_by_user_id_api(
      this.props.userId
    );
    const assignedModules = assignedModulesData.data.result;

    const availableModules =
      this.state.formData["user-module"].availableModules;

    const detailedAssignedModules = assignedModules.map((module) => {
      const alreadyAvailableModule = availableModules.find(
        (availableModule) => availableModule.id === module.moduleId
      );

      return {
        id: module.moduleId,
        name: module.moduleName,
        status: module.status,
        subscriptionModuleId:
          alreadyAvailableModule?.subscriptionModuleId || null,
        subModules: module.subModules,
        handShake: module.handShake,
        roles: {
          assignedRoles: [],
          availableRoles: [],
        },
      };
    });

    const assignedIds = detailedAssignedModules.map((m) => m.id);

    const filteredAvailableModules = availableModules.filter(
      (module) => !assignedIds.includes(module.id)
    );

    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        "user-module": {
          ...prevState.formData["user-module"],
          assignedModules: detailedAssignedModules,
          availableModules: filteredAvailableModules,
        },
      },
      isAssignedModulesFetched: true,
    }));
  }

  /**
   * Fetches Roles for the assigned Modules
   */
  async fetchModuleRoles() {
    const companyId = sessionStorage.getItem("companyId");

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
        const rolesData = await module_roles_api(companyId, assignedModuleIds);

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
   * Fetches already assigned Roles
   */
  // async fetchAssignedRoles() {
  //   const assignedRolesData = await get_user_roles_by_user_id_api(
  //     this.props.userId
  //   );
  //   const assignedRoles = assignedRolesData.data.result;

  //   const detailedAssignedRoles = assignedRoles.map((role) => ({
  //     id: role.roleId,
  //     name: role.roleName,
  //     moduleId: role.moduleId,
  //     moduleName: role.module.moduleName,
  //     status: role.status,
  //     companyId: role.companyId,
  //     handShake: role.handShake,
  //     permissions: {
  //       assignedPermissions: [],
  //       availablePermissions: [],
  //     },
  //   }));

  //   const updatedModules = this.state.formData[
  //     "user-module"
  //   ].assignedModules.map((module) => ({
  //     ...module,
  //     roles: {
  //       ...module.roles,
  //       assignedRoles: detailedAssignedRoles.filter(
  //         (assignedRole) => assignedRole.moduleId === module.id
  //       ),
  //     },
  //   }));

  //   this.setState((prevState) => ({
  //     formData: {
  //       ...prevState.formData,
  //       "user-module": {
  //         ...prevState.formData["user-module"],
  //         assignedModules: updatedModules,
  //       },
  //     },
  //     isAssignedRolesFetched: true,
  //   }));
  // }

  async fetchAssignedRoles() {
    const assignedRolesData = await get_user_roles_by_user_id_api(
      this.props.userId
    );
    const assignedRoles = assignedRolesData.data.result;

    const detailedAssignedRoles = assignedRoles.map((role) => ({
      id: role.roleId,
      name: role.roleName,
      moduleId: role.moduleId,
      moduleName: role.module.moduleName,
      status: role.status,
      companyId: role.companyId,
      handShake: role.handShake,
      permissions: {
        assignedPermissions: [],
        availablePermissions: [],
      },
    }));

    const updatedModules = this.state.formData[
      "user-module"
    ].assignedModules.map((module) => {
      const assigned = detailedAssignedRoles.filter(
        (role) => role.moduleId === module.id
      );
      const assignedRoleIds = assigned.map((r) => r.id);

      const available = (module.roles.availableRoles || []).filter(
        (role) => !assignedRoleIds.includes(role.id)
      );

      return {
        ...module,
        roles: {
          assignedRoles: assigned,
          availableRoles: available, // ✅ FIX: now filtered
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
      isAssignedRolesFetched: true,
    }));
  }

  /**
   * Fetches already assigned Permissions
   */
  // async fetchAssignedPermissions() {
  //   const assignedPermissionsData = await get_user_permissions_by_user_id_api(
  //     this.props.userId
  //   );
  //   const assignedPermissions = assignedPermissionsData.data.result;
  //   console.log("=====>", assignedPermissions);

  //   const detailedAssignedPermissions = assignedPermissions.map(
  //     (permission) => ({
  //       id: permission.permission.permissionId,
  //       name: permission.permission.permissionName,
  //       moduleId: permission.permission.moduleId,
  //     })
  //   );
  //   console.log("=====>", detailedAssignedPermissions);

  //   const updatedModules = this.state.formData[
  //     "user-module"
  //   ].assignedModules.map((module) => ({
  //     ...module,
  //     roles: {
  //       ...module.roles,
  //       assignedRoles: module.roles.assignedRoles.map((assignedRole) => {
  //         const availablePermissions =
  //           assignedRole.permissions.availablePermissions.map(
  //             (permission) => permission.id
  //           );
  //         console.log("=====>", availablePermissions);

  //         const relatedPermissions = detailedAssignedPermissions.filter(
  //           (assignedPermission) => assignedPermission.moduleId === module.id
  //         );
  //         console.log("=====>", relatedPermissions);

  //         const filteredPermissions = relatedPermissions.filter((permission) =>
  //           availablePermissions.includes(permission.id)
  //         );
  //         console.log("=====>", filteredPermissions);

  //         assignedRole.permissions.assignedPermissions = filteredPermissions;
  //         return assignedRole;
  //       }),
  //     },
  //   }));

  //   this.setState((prevState) => ({
  //     formData: {
  //       ...prevState.formData,
  //       "user-module": {
  //         ...prevState.formData["user-module"],
  //         assignedModules: updatedModules,
  //       },
  //     },
  //     isAssignedRolesFetched: true,
  //   }));
  // }

  // async fetchAssignedPermissions() {
  //   const assignedPermissionsData = await get_user_permissions_by_user_id_api(this.props.userId);
  //   const assignedPermissions = assignedPermissionsData.data.result;

  //   console.log("=====>assignedPermissions dinusha", assignedPermissions);

  //   const detailedAssignedPermissions = assignedPermissions.map((permission) => ({
  //     id: permission.permission.permissionId,
  //     name: permission.permission.permissionName,
  //     moduleId: permission.permission.moduleId,
  //   }));

  //   const updatedModules = this.state.formData["user-module"].assignedModules.map((module) => {
  //     return {
  //        ...module,
  //       roles: {
  //         ...module.roles,
  //         assignedRoles: module.roles.assignedRoles.map((assignedRole) => {
  //           const availablePermissionIds = assignedRole.permissions.availablePermissions.map(
  //             (permission) => permission.id
  //           );

  //           const relatedPermissions = detailedAssignedPermissions.filter(
  //             (assignedPermission) =>
  //               assignedPermission.moduleId === module.id
  //           );

  //           const assignedPermissionsForRole = relatedPermissions.filter((permission) =>
  //             availablePermissionIds.includes(permission.id)
  //           );

  //           // Log Assigned Permissions
  //           console.log(`\n🔐 Role:${assignedRole.id} - ${assignedRole.name} - ASSIGNED Permissions:`);
  //           assignedPermissionsForRole.forEach((p) =>
  //             console.log(`✔️[RoleID: ${assignedRole.id}] [PID: ${p.id}] ${p.name}`)
  //           );

  //           // Filter out assigned ones from available list
  //           const availablePermissionsForRole = assignedRole.permissions.availablePermissions.filter(
  //             (permission) => !assignedPermissionsForRole.find((p) => p.id === permission.id)
  //           );

  //           // Log Available Permissions
  //           console.log(`\n🟢 Role:${assignedRole.id} - ${assignedRole.name} - AVAILABLE Permissions:`);
  //           availablePermissionsForRole.forEach((p) =>
  //             console.log(`➕[RoleID: ${assignedRole.id}] [PID: ${p.id}] ${p.name}`)
  //           );

  //           return {
  //             ...assignedRole,
  //             permissions: {
  //               ...assignedRole.permissions,
  //               availablePermissions: availablePermissionsForRole,
  //               assignedPermissions: assignedPermissionsForRole,
  //             },
  //           };
  //         }),
  //       },
  //     };
  //   });

  //   this.setState((prevState) => ({
  //     formData: {
  //       ...prevState.formData,
  //       "user-module": {
  //         ...prevState.formData["user-module"],
  //         assignedModules: updatedModules,
  //       },
  //     },
  //     isAssignedRolesFetched: true,
  //   }));
  // }

  async fetchAssignedPermissions() {
    const assignedPermissionsData = await get_user_permissions_by_user_id_api(
      this.props.userId
    );
    const assignedPermissions = assignedPermissionsData.data.result;

    console.log("=====> Assigned Permissions (Dinusha)", assignedPermissions);

    const detailedAssignedPermissions = assignedPermissions.map(
      (permission) => ({
        id: permission.permission.permissionId,
        name: permission.permission.permissionName,
        moduleId: permission.permission.moduleId,
      })
    );

    const updatedModules = this.state.formData[
      "user-module"
    ].assignedModules.map((module) => {
      return {
        ...module,
        roles: {
          ...module.roles,
          assignedRoles: module.roles.assignedRoles.map((assignedRole) => {
            const allAvailable =
              assignedRole.permissions.availablePermissions || [];

            // Match assigned permissions for this module
            const relatedPermissions = detailedAssignedPermissions.filter(
              (assignedPermission) => assignedPermission.moduleId === module.id
            );

            // Assigned permissions that exist in available list
            const assignedPermissionsForRole = relatedPermissions.filter(
              (assignedPermission) =>
                allAvailable.some((p) => p.id === assignedPermission.id)
            );

            // Filter out assigned from available
            const availablePermissionsForRole = allAvailable.filter(
              (p) => !assignedPermissionsForRole.find((ap) => ap.id === p.id)
            );

            // LOGGING
            console.log(
              `\n🔐 Role: ${assignedRole.id} - ${assignedRole.name} - ASSIGNED Permissions:`
            );
            assignedPermissionsForRole.forEach((p) =>
              console.log(
                `✔️ [RoleID: ${assignedRole.id}] [PID: ${p.id}] ${p.name}`
              )
            );

            console.log(
              `\n🟢 Role: ${assignedRole.id} - ${assignedRole.name} - AVAILABLE Permissions:`
            );
            availablePermissionsForRole.forEach((p) =>
              console.log(
                `➕ [RoleID: ${assignedRole.id}] [PID: ${p.id}] ${p.name}`
              )
            );

            return {
              ...assignedRole,
              permissions: {
                assignedPermissions: assignedPermissionsForRole,
                availablePermissions: availablePermissionsForRole,
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
      isAssignedRolesFetched: true,
    }));
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
    this.state.loading = true;
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
          this.state.loading = false;
          this.props.handleClose();
          this.props.handleRefetchTrue();
        }, 3000);
      } else {
        this.setState({ showFailureAlert: true });

        setTimeout(() => {
          this.setState({ showFailureAlert: false });
        }, 3000);
      }
    }
  };

  /**
   * Save the Registration data
   */
  async saveRegistrationData() {
    const userId = this.props.userId;
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
        email: this.state.formData.basic.email,
        contactNo: this.state.formData.basic.contactNo,
        firstname: this.state.formData.basic.firstname,
        lastname: this.state.formData.basic.lastname,
        companyId: this.state.formData.basic.companyId,
        locationId: this.state.formData.basic.department,
        status: this.state.formData.basic.status === "active" ? true : false,
        permissionId: permissionId,
      };

      const registrationResponse = await put_registration_api(
        userId,
        basicUserData
      );

      if (registrationResponse.status === 200) {
        const productionStageIds = this.state.formData.basic.productionStages
          .map((stage) => {
            if (stage && stage.id) {
              return stage.id; // Extract ID from valid stage objects
            } else {
              console.warn("Invalid stage object found:", stage);
              return null; // Handle invalid entries
            }
          })
          .filter((id) => id !== null); // Filter out invalid entries

        const departmentLocationId = this.state.formData.basic.department;
        const warehouseLocationId = this.state.formData.basic.warehouse;

        let locationIds = [];

        if (departmentLocationId) {
          locationIds.push(departmentLocationId);
        }
        if (warehouseLocationId) {
          locationIds.push(warehouseLocationId);
        }

        if (locationIds.length > 0) {
          await userLocations_update_api(userId, locationIds);
        }

        // await update_user_production_stage_mapping_api(
        //   userId,
        //   productionStageIds
        // );

        const userModulesFromData = {
          companySubscriptionModuleIds: this.state.formData[
            "user-module"
          ].assignedModules.map((module) => module.subscriptionModuleId),
          userId: userId,
        };
        await update_company_subscription_module_user_api(userModulesFromData);

        const userRoles = this.state.formData["user-module"].assignedModules
          .map((module) => module.roles.assignedRoles)
          .flat()
          .map((role) => role.id);

        await update_user_role_api(userId, userRoles);

        // Prepare data for user_permission_api
        const userPermissionsFromData = [];
        this.state.formData["user-module"].assignedModules.forEach((module) => {
          module.roles.assignedRoles.forEach((role) => {
            role.permissions.assignedPermissions.forEach((permission) => {
              userPermissionsFromData.push(permission.id);
            });
          });
        });

        await update_user_permissions_api(userId, userPermissionsFromData);

        console.log("Registration successful! All data saved.");
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
          contactNo: "",
          firstname: "",
          lastname: "",
          companyId: sessionStorage.getItem("companyId"),
          department: "",
          productionStages: [],
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

export default UpdateRegistration;
