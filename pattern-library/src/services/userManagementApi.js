import axios from "axios";

const API_BASE_URL = "https://localhost:7287/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const login_api = async (formData) => {
  try {
    const response = await api.post("/user/login", formData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const logout_api = async () => {
  try {
    const response = await api.post("/user/logout");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const company_modules_api = async (companyId) => {
  try {
    const response = await api.get(
      `/companySubscriptionModule/modules/company/${companyId}`
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
      `/role/GetRolesByModuleIds?${formattedModuleIds}`
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
      `/permission/GetPermissionsByModuleIds?${formattedModuleIds}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const user_registration_api = async (userFromData) => {
  try {
    const response = await api.post("/user/register", userFromData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const user_role_api = async (userRoleFromData) => {
  try {
    const response = await api.post("/userRole", userRoleFromData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const user_permission_api = async (userPermissionFromData) => {
  try {
    const response = await api.post("/userPermission", userPermissionFromData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const role_permission_api = async (rolePermissionFromData) => {
  try {
    const response = await api.post("/rolePermission", rolePermissionFromData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const company_subscription_module_user_api = async (
  userModulesFromData
) => {
  try {
    const response = await api.post(
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
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const submodules_api = async (moduleId) => {
  try {
    const response = await api.get(`/submodule/${moduleId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
