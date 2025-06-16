import axios from "axios";

//Import url from config file
const baseUrl = process.env.REACT_APP_API_BASEURL;
const baseUrl2 = process.env.REACT_APP_API_BASEURL2;
const sublink = process.env.REACT_APP_API_SUBLINK;

export const API_BASE_URL = `${baseUrl}${sublink}`;

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

export const get_all_units_by_company_id_api = async (companyId) => {
  try {
    const response = await api.get(
      `/unit/GetAllUnitsByCompanyId/${companyId}`,
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

export const put_unit_api = async (unitId, unitData) => {
  try {
    const response = await api.put(`/unit/${unitId}`, unitData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const delete_unit_api = async (unitId) => {
  try {
    const response = await api.delete(`/unit/${unitId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
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

export const get_all_categories_by_company_id_api = async (companyId) => {
  try {
    const response = await api.get(
      `/category/GetAllCategoriesByCompanyId/${companyId}`,
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

export const put_category_api = async (categoryId, categoryData) => {
  try {
    const response = await api.put(`/category/${categoryId}`, categoryData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const delete_category_api = async (categoryId) => {
  try {
    const response = await api.delete(`/category/${categoryId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
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

export const get_item_masters_by_company_id_api = async (companyId) => {
  try {
    const response = await api.get(
      `/itemMaster/GetItemMastersByCompanyId/${companyId}`,
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

export const get_item_masters_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/itemMaster/GetItemMastersByUserId/${userId}`,
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

export const get_item_masters_by_company_id_with_query_api = async (
  companyId,
  searchQuery,
  itemType
) => {
  try {
    const response = await api.get(
      `/itemMaster/GetItemMastersByCompanyIdWithQuery/${companyId}?searchQuery=${searchQuery}&itemType=${itemType}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const get_item_master_by_item_master_id_api = async (itemMasterId) => {
  try {
    const response = await api.get(
      `/itemMaster/GetItemMasterByItemMasterId/${itemMasterId}`,
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

export const get_sub_items_by_item_master_id_api = async (itemMasterId) => {
  try {
    const response = await api.get(
      `/itemMaster/GetSubItemsByItemMasterId/${itemMasterId}`,
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

export const get_sub_item_masters_by_item_master_id_api = async (
  itemMasterId
) => {
  try {
    const response = await api.get(
      `/SubItemMaster/GetSubItemMastersByItemMasterId/${itemMasterId}`,
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

//item types api
export const get_item_types_by_company_id_api = async (companyId) => {
  try {
    const response = await api.get(
      `/itemType/GetItemTypesByCompanyId/${companyId}`,
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

//measurement types api
export const get_measurement_types_by_company_id_api = async (companyId) => {
  try {
    const response = await api.get(
      `/measurementType/GetMeasurementTypesByCompanyId/${companyId}`,
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

export const get_stock_report_api = async (fromDate, toDate, locationId) => {
  try {
    const response = await api.get(
      `/report/StockReport/${fromDate}/${toDate}/${locationId}`,
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

export const get_Empty_Return_Item_locations_inventories_by_location_id_api =
  async (locationId) => {
    try {
      const response = await api.get(
        `/locationInventory/GetEmptyReturnItemLocationInventoriesByLocationId/${locationId}`,
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
