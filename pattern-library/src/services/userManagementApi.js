import axios from "axios";

//Import url from config file
const baseUrl = process.env.REACT_APP_API_BASEURL;
const baseUrl2 = process.env.REACT_APP_API_BASEURL2;
const sublink = process.env.REACT_APP_API_SUBLINK;

export const API_BASE_URL = `${baseUrl}${sublink}`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

//authentication apis
export const login_api = async (formData) => {
  try {
    const response = await api.post("/user/login", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const logout_api = async () => {
  try {
    const response = await api.post("/user/logout", null, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//registration related apis
export const company_modules_api = async (companyId) => {
  try {
    const response = await api.get(
      `/companySubscriptionModule/modules/company/${companyId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const module_roles_api = async (moduleIds) => {
  try {
    const formattedModuleIds = moduleIds
      .map((id) => `moduleIds=${id}`)
      .join("&");

    const response = await api.get(
      `/role/GetRolesByModuleIds?${formattedModuleIds}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const module_permissions_api = async (moduleIds) => {
  try {
    const formattedModuleIds = moduleIds
      .map((id) => `moduleIds=${id}`)
      .join("&");

    const response = await api.get(
      `/permission/GetPermissionsByModuleIds?${formattedModuleIds}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const user_registration_api = async (userFromData) => {
  try {
    const response = await api.post("/user/register", userFromData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const user_role_api = async (userRoleFromData) => {
  try {
    const response = await api.post("/userRole", userRoleFromData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const user_permission_api = async (userPermissionFromData) => {
  try {
    const response = await api.post("/userPermission", userPermissionFromData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const role_permission_api = async (rolePermissionFromData) => {
  try {
    const response = await api.post("/rolePermission", rolePermissionFromData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const role_permissions_api = async (moduleIds) => {
  try {
    const formattedRoleIds = moduleIds.map((id) => `roleIds=${id}`).join("&");

    const response = await api.get(
      `/rolePermission/GetRolePermissionsByRoleIds?${formattedRoleIds}`
    );

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const delete_role_permission_api = async (roleId) => {
  try {
    const response = await api.delete(
      `/rolePermission/DeleteRolePermissionByRoleId/${roleId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Company Subscription Module User API's
export const company_subscription_module_user_api = async (
  userModulesFromData
) => {
  try {
    const response = await api.post(
      "/companySubscriptionModuleUser",
      userModulesFromData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const update_company_subscription_module_user_api = async (
  userModulesFromData
) => {
  try {
    const response = await api.put(
      "/companySubscriptionModuleUser",
      userModulesFromData
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const user_modules_api = async (userId) => {
  try {
    const response = await api.get("/module/GetModulesByUserId", {
      params: { userId: userId },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_company_subscription_module_id_api = async (
  companyId,
  moduleId
) => {
  try {
    const response = await api.get(
      `/companySubscriptionModule/companySubscriptionModuleId/${companyId}/${moduleId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const submodules_api = async (moduleId) => {
  try {
    const response = await api.get(`/submodule/${moduleId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//company apis
export const get_companies_api = async () => {
  try {
    const response = await api.get("/company", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_company_api = async (companyId) => {
  try {
    const response = await api.get(`/company/${companyId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post_company_api = async (companyData) => {
  try {
    const response = await api.post("/company", companyData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const put_company_api = async (companyId, companyData) => {
  try {
    const response = await api.put(`/company/${companyId}`, companyData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const post_company_logo_api = async (uploadData) => {
  try {
    const formData = new FormData();
    formData.append("permissionId", uploadData.permissionId);
    formData.append("logoFile", uploadData.logoFile);

    const response = await api.post("/company/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const delete_company_api = async (companyId) => {
  try {
    const response = await api.delete(`/company/${companyId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//subscription apis
export const get_subscriptions_api = async () => {
  try {
    const response = await api.get("/subscription", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_subscription_api = async (subscriptionId) => {
  try {
    const response = await api.get(`/subscription/${subscriptionId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post_subscription_api = async (subscriptionData) => {
  try {
    const response = await api.post("/subscription", subscriptionData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const put_subscription_api = async (
  subscriptionId,
  subscriptionData
) => {
  try {
    const response = await api.put(
      `/subscription/${subscriptionId}`,
      subscriptionData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

////User Module API'S
export const get_modules_api = async () => {
  try {
    const response = await api.get("/module", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_module_api = async (moduleId) => {
  try {
    const response = await api.get(`/module/${moduleId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post_module_api = async (moduleData) => {
  try {
    const response = await api.post("/module", moduleData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const put_module_api = async (moduleId, moduleData) => {
  try {
    const response = await api.put(`/module/${moduleId}`, moduleData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const get_user_modules_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/module/GetModulesByUserId?userId=${userId}`, // Use template literals to include userId in the URL
      {
        withCredentials: true, // Include credentials if necessary
      }
    );
    return response.data; // Return the response data
  } catch (error) {
    throw error; // Throw the error if there's an issue
  }
};

//User Permissions API'S
export const get_user_permissions_api = async (userId) => {
  try {
    const response = await api.get(
      "/userPermission/GetUserPermissionsByUserId",
      {
        params: { userId: userId },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_user_permissions_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/userPermission/GetUserPermissionsByUserId`,
      {
        params: { userId }, // Pass userId as a query parameter
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//User Locations API'S
export const post_user_location_api = async (userLocationData) => {
  try {
    const response = await api.post("/userLocation", userLocationData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const put_user_location_api = async (userId, locationId) => {
  try {
    const response = await api.put(`/userLocation/${userId}/${locationId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const delete_user_location_api = async (userId, locationId) => {
  try {
    const response = await api.delete(`/userLocation/${userId}/${locationId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserLocationsByUserId = async (userId) => {
  try {
    const response = await api.get(
      `/userLocation/GetUserLocationsByUserId/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user locations:", error);
    throw error;
  }
};

export const userLocations_update_api = async (userId, locationIds) => {
  try {
    const response = await api.put(
      `/userLocation/UpdateUserLocations/${userId}`,
      locationIds
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user locations:", error);
    throw error;
  }
};

//User Roles API's
export const get_roles_by_company_id_api = async (companyId) => {
  try {
    const response = await api.get(`/role/GetRolesByCompanyId/${companyId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const delete_role_api = async (roleId) => {
  try {
    const response = await api.delete(`/role/${roleId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const post_role_api = async (formData) => {
  try {
    const response = await api.post("/role", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const put_role_api = async (roleId, roleData) => {
  try {
    const response = await api.put(`/role/${roleId}`, roleData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const update_user_role_api = async (userId, roleIds) => {
  try {
    const response = await api.put(
      `/userRole/UpdateUserRole/${userId}`,
      roleIds,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const get_user_roles_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/userRole/GetUserRolesByUserId/${userId}`, // Use template literals to include userId in the URL
      {
        withCredentials: true, // Include credentials if necessary
      }
    );
    return response.data; // Return the response data
  } catch (error) {
    throw error; // Throw the error if there's an issue
  }
};

//User Permissions API'S
export const get_permissions_by_company_id_api = async (companyId) => {
  try {
    const response = await api.get(
      `/permission/GetPermissionsByCompanyId/${companyId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const delete_permission_api = async (permissionId) => {
  try {
    const response = await api.delete(`/permission/${permissionId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const update_user_permissions_api = async (userId, permissionIds) => {
  try {
    const response = await api.put(
      `/userPermission/UpdateUserPermissions/${userId}`,
      permissionIds,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//User API'S
export const get_all_users_by_company_id_api = async (companyId) => {
  try {
    const response = await api.get(
      `/user/GetAllUsersByCompanyId/${companyId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_user_by_user_id = async (userId) => {
  try {
    const response = await api.get(`/user/GetUserByUserId/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deactivate_user = async (userId) => {
  try {
    const response = await api.put(`/user/${userId}/deactivate`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const activate_user = async (userId) => {
  try {
    const response = await api.put(`/user/${userId}/activate`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const put_registration_api = async (userId, userData) => {
  try {
    const response = await api.put(`/user/${userId}`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Role Permissions API'S
export const post_permission_api = async (formData) => {
  try {
    const response = await api.post("/permission", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const put_permission_api = async (permissionId, permissionData) => {
  try {
    const response = await api.put(
      `/permission/${permissionId}`,
      permissionData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const role_permissions_api = async (moduleIds) => {
//   try {
//     const formattedRoleIds = moduleIds.map((id) => `roleIds=${id}`).join("&");

//     const response = await api.get(
//       `/rolePermission/GetRolePermissionsByRoleIds?${formattedRoleIds}`
//     );

//     return response.data;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };
