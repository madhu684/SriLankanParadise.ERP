import axios from "axios";

//Import url from config file
const baseUrl = process.env.REACT_APP_API_BASEURL;
const baseUrl2 = process.env.REACT_APP_API_BASEURL2;
const sublink = process.env.REACT_APP_API_SUBLINK;

export const API_BASE_URL = `${baseUrl}${sublink}`;

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

export const get_purchase_requisitions_with_out_drafts_api = async (
  companyId
) => {
  try {
    const response = await api.get(
      `/purchaseRequisition/GetPurchaseRequisitionsWithoutDraftsByCompanyId/${companyId}`,
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

export const put_purchase_requisition_detail_api = async (
  purchaseRequisitionDetailId,
  purchaseRequisitionDetailData
) => {
  try {
    const response = await api.put(
      `/purchaseRequisitionDetail/${purchaseRequisitionDetailId}`,
      purchaseRequisitionDetailData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
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

export const put_purchase_requisition_api = async (
  purchaseRequisitionId,
  purchaseRequisitionData
) => {
  try {
    const response = await api.put(
      `/purchaseRequisition/${purchaseRequisitionId}`,
      purchaseRequisitionData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const delete_purchase_requisition_detail_api = async (
  purchaseRequisitionDetailId
) => {
  try {
    const response = await api.delete(
      `/purchaseRequisitionDetail/${purchaseRequisitionDetailId}`,
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

export const get_purchase_orders_with_out_drafts_api = async (companyId) => {
  try {
    const response = await api.get(
      `/purchaseOrder/GetPurchaseOrdersWithoutDraftsByCompanyId/${companyId}`,
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

export const get_purchase_orders_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/purchaseOrder/GetPurchaseOrdersByUserId/${userId}`,
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

export const put_purchase_order_detail_api = async (
  purchaseOrderDetailId,
  purchaseOrderDetailData
) => {
  try {
    const response = await api.put(
      `/purchaseOrderDetail/${purchaseOrderDetailId}`,
      purchaseOrderDetailData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approve_purchase_order_api = async (
  purchaseOrderId,
  approvalData
) => {
  try {
    const response = await api.patch(
      `/purchaseOrder/approve/${purchaseOrderId}`,
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

export const put_purchase_order_api = async (
  purchaseOrderId,
  purchaseOrderData
) => {
  try {
    const response = await api.put(
      `/purchaseOrder/${purchaseOrderId}`,
      purchaseOrderData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const delete_purchase_order_detail_api = async (
  purchaseOrderDetailId
) => {
  try {
    const response = await api.delete(
      `/purchaseOrderDetail/${purchaseOrderDetailId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
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

export const get_grn_masters_with_out_drafts_api = async (companyId) => {
  try {
    const response = await api.get(
      `/grnMaster/GetGrnMastersWithoutDraftsByCompanyId/${companyId}`,
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

export const get_grn_masters_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/grnMaster/GetGrnMastersByUserId/${userId}`,
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

export const put_grn_detail_api = async (grnDetailId, grnDetailData) => {
  try {
    const response = await api.put(`/grnDetail/${grnDetailId}`, grnDetailData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approve_grn_master_api = async (grnMasterId, approvalData) => {
  try {
    const response = await api.patch(
      `/grnMaster/approve/${grnMasterId}`,
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

export const put_grn_master_api = async (grnMasterId, grnMasterData) => {
  try {
    const response = await api.put(`/grnMaster/${grnMasterId}`, grnMasterData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const delete_grn_detail_api = async (grnDetailId) => {
  try {
    const response = await api.delete(`/grnDetail/${grnDetailId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
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