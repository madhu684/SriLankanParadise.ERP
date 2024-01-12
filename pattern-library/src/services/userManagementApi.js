import axios from "axios";

export const API_BASE_URL = "https://localhost:7287/api";

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

//company apis
export const get_companies_api = async () => {
  try {
    const response = await api.get("/company");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_company_api = async (companyId) => {
  try {
    const response = await api.get(`/company/${companyId}`);
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
    const response = await api.get("/subscription");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_subscription_api = async (subscriptionId) => {
  try {
    const response = await api.get(`/subscription/${subscriptionId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post_subscription_api = async (subscriptionData) => {
  try {
    const response = await api.post("/subscription", subscriptionData);
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
      subscriptionData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//modules apis
export const get_modules_api = async () => {
  try {
    const response = await api.get("/module");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_module_api = async (moduleId) => {
  try {
    const response = await api.get(`/module/${moduleId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post_module_api = async (moduleData) => {
  try {
    const response = await api.post("/module", moduleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const put_module_api = async (moduleId, moduleData) => {
  try {
    const response = await api.put(`/module/${moduleId}`, moduleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//user permissions
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
