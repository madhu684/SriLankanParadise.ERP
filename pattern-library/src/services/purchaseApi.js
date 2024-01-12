import axios from "axios";

export const API_BASE_URL = "https://localhost:7287/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

//purchase requisition apis
export const post_purchase_requisition_api = async (formData) => {
  try {
    const response = await api.post("/purchaseRequisition", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_purchase_requisitions_api = async () => {
  try {
    const response = await api.get("/purchaseRequisition", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_purchase_requisitions_with_out_drafts_api = async () => {
  try {
    const response = await api.get(
      "/purchaseRequisition/GetPurchaseRequisitionsWithoutDrafts",
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

export const get_purchase_requisitions_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/purchaseRequisition/GetPurchaseRequisitionsByUserId/${userId}`,
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

export const post_purchase_requisition_detail_api = async (formData) => {
  try {
    const response = await api.post("/purchaseRequisitionDetail", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const approve_purchase_requisition_api = async (
  purchaseRequisitionId,
  approvalData
) => {
  try {
    const response = await api.patch(
      `/purchaseRequisition/approve/${purchaseRequisitionId}`,
      approvalData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//purchase order apis
export const post_purchase_order_api = async (formData) => {
  try {
    const response = await api.post("/purchaseOrder", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_purchase_order_api = async () => {
  try {
    const response = await api.get("/purchaseOrder");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post_purchase_order_detail_api = async (formData) => {
  try {
    const response = await api.post("/purchaseOrderDetail", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//grn apis
export const post_grn_master_api = async (formData) => {
  try {
    const response = await api.post("/grnMaster", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_grn_master_api = async () => {
  try {
    const response = await api.get("/grnMaster");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post_grn_detail_api = async (formData) => {
  try {
    const response = await api.post("/grnDetail", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//company locations api
export const get_company_locations_api = async (companyId) => {
  try {
    const response = await api.get("/location/GetLocationsByCompanyId", {
      params: { companyId: companyId },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//company suppliers api
export const get_company_suppliers_api = async (companyId) => {
  try {
    const response = await api.get("/supplier/GetSuppliersByCompanyId", {
      params: { companyId: companyId },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
