import axios from "axios";

export const API_BASE_URL = "https://localhost:7287/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

//uit apis
export const get_units_by_company_id_api = async (companyId) => {
  try {
    const response = await api.get(`/unit/GetUnitsByCompanyId/${companyId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post_unit_api = async (formData) => {
  try {
    const response = await api.post("/unit", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//category apis
export const get_categories_by_company_id_api = async (companyId) => {
  try {
    const response = await api.get(
      `/category/GetCategoriesByCompanyId/${companyId}`,
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

export const post_category_api = async (formData) => {
  try {
    const response = await api.post("/category", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//item master apis
export const post_item_master_api = async (formData) => {
  try {
    const response = await api.post("/itemMaster", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const put_item_master_api = async (itemMasterId, itemMasterIdData) => {
  try {
    const response = await api.put(
      `/itemMaster/${itemMasterId}`,
      itemMasterIdData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const delete_item_master_api = async (itemMasterId) => {
  try {
    const response = await api.delete(`/itemMaster/${itemMasterId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
