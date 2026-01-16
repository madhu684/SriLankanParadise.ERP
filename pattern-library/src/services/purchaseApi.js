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

export const delete_purchase_requisition_api = async (
  purchaseRequisitionId
) => {
  try {
    const response = await api.delete(
      `/purchaseRequisition/${purchaseRequisitionId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const get_purchase_requisition_by_id_api = async (
  purchaseRequisitionId
) => {
  try {
    const response = await api.get(
      `/purchaseRequisition/${purchaseRequisitionId}`,
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

export const get_purchase_orders_api = async (companyId) => {
  try {
    const response = await api.get(
      `/purchaseOrder/GetPurchaseOrdersByCompanyId/${companyId}`,
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

export const delete_purchase_order_api = async (purchaseOrderId) => {
  try {
    const response = await api.delete(`/purchaseOrder/${purchaseOrderId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const get_purchase_order_by_purchase_order_id_api = async (
  purchaseOrderId
) => {
  try {
    const response = await api.get(`/purchaseOrder/${purchaseOrderId}`, {
      withCredentials: true,
    });
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

export const get_paginated_grn_masters_api = async ({
  companyId,
  filter,
  pageNumber = 1,
  pageSize = 10,
}) => {
  try {
    const params = {
      pageNumber,
      pageSize,
    };

    if (filter && filter.trim() !== "") {
      params.filter = filter;
    }

    const response = await api.get(
      `/grnMaster/GetPaginatedGrnMastersByUserCompany/${companyId}`,
      {
        params,
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching GRN masters:", error);
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

export const post_supplier_api = async (formData) => {
  try {
    const response = await api.post("/supplier", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//requisition master apis
export const post_requisition_master_api = async (formData) => {
  try {
    const response = await api.post("/requisitionMaster", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_requisitions_masters_api = async () => {
  try {
    const response = await api.get("/requisitionMaster", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_requisition_masters_with_out_drafts_api = async (
  companyId
) => {
  try {
    const response = await api.get(
      `/requisitionMaster/GetRequisitionMastersWithoutDraftsByCompanyId/${companyId}`,
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

export const get_requisition_masters_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/requisitionMaster/GetRequisitionMastersByUserId/${userId}`,
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

export const approve_requisition_master_api = async (
  requisitionMasterId,
  approvalData
) => {
  try {
    const response = await api.patch(
      `/requisitionMaster/approve/${requisitionMasterId}`,
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

export const post_requisition_detail_api = async (formData) => {
  try {
    const response = await api.post("/requisitionDetail", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//ChargesAndDeduction apis
export const get_charges_and_deductions_by_company_id_api = async (
  companyId
) => {
  try {
    const response = await api.get(
      `/chargesAndDeduction/GetChargesAndDeductionsByCompanyId/${companyId}`,
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

export const post_charges_and_deductions_applied_api = async (formData) => {
  try {
    const response = await api.post("/chargesAndDeductionApplied", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_transaction_types_api = async () => {
  try {
    const response = await api.get("./transactionType/GetTransactionTypes", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_charges_and_deductions_applied_api = async (
  transactionTypeId,
  transactionId,
  companyId
) => {
  try {
    const response = await api.get(
      `/chargesAndDeductionApplied/GetChargesAndDeductionsApplied?transactionTypeId=${transactionTypeId}&transactionId=${transactionId}&companyId=${companyId}`,
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

export const put_charges_and_deductions_applied_api = async (
  chargesAndDeductionAppliedId,
  chargesAndDeductionAppliedrData
) => {
  try {
    const response = await api.put(
      `/chargesAndDeductionApplied/${chargesAndDeductionAppliedId}`,
      chargesAndDeductionAppliedrData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const delete_charges_and_deductions_applied_api = async (
  chargesAndDeductionAppliedId
) => {
  try {
    const response = await api.delete(
      `/chargesAndDeductionApplied/${chargesAndDeductionAppliedId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const get_grn_masters_by_purchase_order_id_api = async (
  purchaseOrderId
) => {
  try {
    const response = await api.get(
      `/grnMaster/GetGrnMastersByPurchaseOrderId/${purchaseOrderId}`,
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

//item batch apis
export const post_batch_api = async (formData) => {
  try {
    const response = await api.post("/batch", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_batches_by_companyId_api = async (companyId) => {
  try {
    const response = await api.get(
      `/batch/GetBatchesByCompanyId/${companyId}`,
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

export const post_batchHasGrnMaster_api = async (formData) => {
  try {
    const response = await api.post("/batchHasGrnMaster", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post_itemBatch_api = async (formData) => {
  try {
    const response = await api.post("/itemBatch", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post_itemBatchHasGrnDetail_api = async (formData) => {
  try {
    const response = await api.post("/itemBatchHasGrnDetail", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_item_batches_api = async (companyId) => {
  try {
    const response = await api.get(
      `/itemBatch/GetItemBatchesByCompanyId/${companyId}`,
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

export const get_item_batches_by_locationId_CompanyId = async (
  locationId,
  companyId
) => {
  try {
    const response = await api.get(
      `/itemBatch/GetItemBatchesByLocationIdCompanyId/${locationId}/${companyId}`,
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

//issue master apis
export const post_issue_master_api = async (formData) => {
  try {
    const response = await api.post("/issueMaster", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_issues_masters_api = async () => {
  try {
    const response = await api.get("/issueMaster", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_issue_masters_with_out_drafts_api = async (companyId) => {
  try {
    const response = await api.get(
      `/issueMaster/GetIssueMastersWithoutDraftsByCompanyId/${companyId}`,
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

export const get_issue_masters_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/issueMaster/GetIssueMastersByUserId/${userId}`,
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

export const approve_issue_master_api = async (issueMasterId, approvalData) => {
  try {
    const response = await api.patch(
      `/issueMaster/approve/${issueMasterId}`,
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

//======================
//patch_issue_detail_api
export const patch_issue_detail_api = async (issueMasterId, formData) => {
  try {
    const response = await api.patch(
      `/issueDetail/update-received-quantity/${issueMasterId}`,
      formData,
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

//get issue details api
export const get_issue_details_api = async (issueMasterId) => {
  try {
    const response = await api.get(`/issueDetail/${issueMasterId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//========================

export const post_issue_detail_api = async (formData) => {
  try {
    const response = await api.post("/issueDetail", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_issue_masters_by_requisition_master_id_api = async (
  requisitionMasterId
) => {
  try {
    const response = await api.get(
      `/issueMaster/GetIssueMastersByRequisitionMasterId/${requisitionMasterId}`,
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

//item batch update related apis
export const get_item_batches_by_item_master_id_api = async (
  itemMasterId,
  companyId
) => {
  try {
    const response = await api.get(
      `/itemBatch/GetItemBatchesByItemMasterId?itemMasterId=${itemMasterId}&companyId=${companyId}`,
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

export const put_item_batch_api = async (
  batchId,
  itemMasterId,
  itemBatchData
) => {
  try {
    const response = await api.put(
      `/itemBatch/${batchId}/${itemMasterId}`,
      itemBatchData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const patch_item_batch_api = async (
  batchId,
  itemMasterId,
  operation,
  itemBatchData
) => {
  try {
    const response = await api.patch(
      `/itemBatch/updateQty/${batchId}/${itemMasterId}/${operation}`,
      itemBatchData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const get_item_batch_by_itemMasterId_batchId_api = async (
  itemMasterId,
  batchId
) => {
  try {
    const response = await api.get(
      `/itemBatch/GetItemBatchByItemMasterIdBatchId/${itemMasterId}/${batchId}`,
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

//supplier ralated apis
export const get_company_types_api = async () => {
  try {
    const response = await api.get("/companyType", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_business_types_api = async () => {
  try {
    const response = await api.get("/businessType", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post_supplier_logo_api = async (uploadData) => {
  try {
    const formData = new FormData();
    formData.append("permissionId", uploadData.permissionId);
    formData.append("logoFile", uploadData.logoFile);

    const response = await api.post("/supplier/upload/logo", formData, {
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

export const post_supplier_attachment_api = async (uploadData) => {
  try {
    const formData = new FormData();
    formData.append("permissionId", uploadData.permissionId);
    formData.append("attachmentFile", uploadData.attachmentFile);

    const response = await api.post("/supplier/upload/attachment", formData, {
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

export const post_supplier_category_api = async (formData) => {
  try {
    const response = await api.post("/supplierCategory", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post_supplier_attachment_info_api = async (formData) => {
  try {
    const response = await api.post("/supplierAttachment", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_supplier_logo_api = async (supplierId) => {
  try {
    const response = await api.get(`/supplier/logo/${supplierId}`, {
      responseType: "blob", // Specify response type as blob
      withCredentials: true,
    });

    // Convert blob to base64
    const logoBlob = response.data;
    const reader = new FileReader();
    reader.readAsDataURL(logoBlob);

    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const logoSrc = reader.result;
        resolve(logoSrc);
      };
      reader.onerror = (error) => {
        console.error("Error reading the logo blob:", error);
        reject(error);
      };
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const put_supplier_api = async (supplierId, supplierData) => {
  try {
    const response = await api.put(`/supplier/${supplierId}`, supplierData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const delete_supplier_category_api = async (supplierCategoryId) => {
  try {
    const response = await api.delete(
      `/supplierCategory/${supplierCategoryId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const put_supplier_attachment_api = async (
  supplierAttachmentId,
  supplierAttachmentData
) => {
  try {
    const response = await api.put(
      `/supplierAttachment/${supplierAttachmentId}`,
      supplierAttachmentData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const delete_supplier_api = async (supplierId) => {
  try {
    const response = await api.delete(`/supplier/${supplierId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const get_supplier_by_company_id_with_query_api = async (
  companyId,
  searchQuery
) => {
  try {
    const response = await api.get(
      `/supplier/GetSuppliersByCompanyIdWithSearchQuery/${companyId}?searchQuery=${searchQuery}`,
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

export const post_supplier_item_api = async (formData) => {
  try {
    const response = await api.post("/supplierItem", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const update_supplier_item_api = async (supplierItemId, formData) => {
  try {
    const response = await api.put(
      `/supplierItem/${supplierItemId}`,
      formData,
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

export const delete_supplier_item_api = async (supplierItemId) => {
  try {
    const response = await api.delete(`/supplierItem/${supplierItemId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//user location apis
export const get_user_locations_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/userLocation/GetUserLocationsByUserId/${userId}`,
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

//location inventory apis
export const post_location_inventory_api = async (formData) => {
  try {
    const response = await api.post("/locationInventory", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post_location_inventory_movement_api = async (formData) => {
  try {
    const response = await api.post("/locationInventoryMovement", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post_location_inventory_goods_in_transit_api = async (
  formData
) => {
  try {
    const response = await api.post(
      "/locationInventoryGoodsInTransit",
      formData,
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

export const get_locations_inventories_by_location_id_api = async (
  locationId
) => {
  try {
    const response = await api.get(
      `/locationInventory/GetLocationInventoriesByLocationId/${locationId}`,
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

export const get_item_locations_inventories_by_location_id_api = async (
  locationId
) => {
  try {
    const response = await api.get(
      `/locationInventory/GetItemLocationInventoriesByLocationId/${locationId}`,
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

export const get_sum_of_item_inventory_by_location_id_api = async (
  locationId
) => {
  try {
    const response = await api.get(
      `/locationInventory/GetSumOfItemInventoryByLocationId/${locationId}`,
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

export const get_locations_inventories_by_location_id_item_master_id_api =
  async (locationId, itemMasterId) => {
    try {
      const response = await api.get(
        `/locationInventory/GetLocationInventoriesByLocationIdItemMasterId/${locationId}/${itemMasterId}`,
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

export const patch_location_inventory_api = async (
  locationId,
  itemMasterId,
  batchId,
  operation,
  locationInventoryData
) => {
  try {
    const response = await api.patch(
      `/locationInventory/updateStockInHand/${locationId}/${itemMasterId}/${batchId}/${operation}`,
      locationInventoryData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const patch_Empty_location_inventory_api = async (
  locationId,
  itemMasterId,
  operation,
  locationInventoryData
) => {
  try {
    const response = await api.patch(
      `/locationInventory/updateEmptyStockInHand/${locationId}/${itemMasterId}/${operation}`,
      locationInventoryData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const patch_location_inventory_goods_in_transit_api = async (
  toLocationId,
  fromLocationId,
  itemMasterId,
  batchId,
  locationInventoryGoodsInTransitData
) => {
  try {
    const response = await api.patch(
      `/locationInventoryGoodsInTransit/${toLocationId}/${fromLocationId}/${itemMasterId}/${batchId}`,
      locationInventoryGoodsInTransitData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const get_location_inventory_by_batch_id_api = async (batchId) => {
  try {
    const response = await api.get(
      `/locationInventory/GetLocationInventoryByBatchId/${batchId}`,
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

export const get_location_types_by_company_id_api = async () => {
  try {
    const response = await api.get(
      `/locationType/GetLocationTypesByCompanyId`,
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

export const get_location_inventory_by_locationInvemtoryId_api = async (
  locationInventoryId
) => {
  try {
    const response = await api.get(
      `/locationInventory/GetLocationInventoryByLocationInventoryId/${locationInventoryId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {}
};

//=============
export const get_sum_location_inventories_by_locationId_itemMasterId_api =
  async (itemMasterId, locationId = null) => {
    try {
      const response = await api.get(
        `/locationInventory/GetSumLocationInventoriesByLocationIdItemMasterId/${itemMasterId}`,
        {
          params: { locationId },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching sum location inventories:", error);
      throw error;
    }
  };

export const get_sum_location_inventories_by_locationId_itemCode_api = async (
  itemCode,
  locationId = null
) => {
  try {
    const response = await api.get(
      "/locationInventory/GetSumLocationInventoriesByLocationIdItemCode",
      {
        params: { itemCode, locationId },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching sum location inventories:", error);
    throw error;
  }
};

export const get_sum_location_inventories_by_itemMasterId_api = async (
  itemMasterId
) => {
  try {
    const response = await api.get(
      `/locationInventory/GetSumLocationInventoriesByLocationIdItemMasterId?itemMasterId=${itemMasterId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching sum location inventories for all locations:",
      error
    );
    throw error;
  }
};

export const get_Low_Stock_Items_api = async (
  supplierId = null,
  locationId = null
) => {
  try {
    const response = await api.get(`/locationInventory/GetLowStockItems`, {
      params: { supplierId, locationId },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    throw error;
  }
};

export const post_reduce_inventory_fifo_api = async (requestData) => {
  try {
    const response = await api.post(
      `/locationInventory/reduce-inventory-fifo`,
      requestData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const post_increase_inventory_fifo_api = async (requestData) => {
  try {
    console.log("API called with:", requestData);
    const response = await api.post(
      `/locationInventory/increase-inventory-fifo`,
      requestData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const get_Low_Stock_Items_for_location_api = async (locationId) => {
  try {
    const response = await api.get(
      `/locationInventory/GetLowStockItemsByLocationOnly/${locationId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    throw error;
  }
};

export const get_Location_Inventory_Summary_By_Item_Name_api = async (
  companyId,
  locationId = null,
  itemName = "",
  supplierId = null
) => {
  try {
    const response = await api.get(
      `/locationInventory/GetLocationInventorySummaryByItemName`,
      {
        params: { locationId, itemName, supplierId },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching location inventory summary by item name:",
      error
    );
    throw error;
  }
};

export const post_comapny_location_api = async (locationData) => {
  try {
    const response = await api.post("/location", locationData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const put_company_location_api = async (locationId, locationData) => {
  try {
    const response = await api.put(`/location/${locationId}`, locationData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const get_supply_return_masters_by_companyId = async (companyId) => {
  try {
    const response = await api.get(
      `/supplyReturnMaster/GetSupplyReturnMasterByCompanyId/${companyId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const get_approved_supply_return_masters_by_companyId = async (
  companyId
) => {
  try {
    const response = await api.get(
      `/supplyReturnMaster/GetApprovedSupplyReturnMasterByCompanyId/${companyId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const create_supply_return_master_api = async (formData) => {
  try {
    const response = await api.post("/supplyReturnMaster", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const create_supply_return_detail_api = async (formData) => {
  try {
    const response = await api.post("/supplyReturnDetail", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const put_supply_return_master_api = async (id, formData) => {
  try {
    const response = await api.put(`/supplyReturnMaster/${id}`, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approve_supply_return_master_api = async (id, formData) => {
  try {
    const response = await api.patch(
      `/supplyReturnMaster/approve/${id}`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const delete_supply_return_detail_api = async (id) => {
  try {
    const response = await api.delete(`/supplyReturnDetail/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const put_supply_return_detail_api = async (id, formData) => {
  try {
    const response = await api.put(`/supplyReturnDetail/${id}`, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const get_supply_return_masters_by_supplyReturnMasterId = async (
  supplyReturnMasterId
) => {
  try {
    const response = await api.get(
      `/supplyReturnMaster/GetSupplyReturnMasterBySupplyReturnMasterId/${supplyReturnMasterId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const put_location_inventory_by_id_api = async (id, formData) => {
  try {
    const response = await api.put(`/locationInventory/${id}`, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const update_min_state_in_mrn_api = async (id, formData) => {
  try {
    const response = await api.patch(
      `/requisitionMaster/patchMinApproved/${id}`,
      formData,
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

export const get_batches_by_batchRef_api = async (batchRef) => {
  try {
    const response = await api.get(`/batch/GetBatchesByBatchRef/${batchRef}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const update_reorderlevel_maxorder_level_api = async (
  locationId,
  itemMasterId,
  formData
) => {
  try {
    const response = await api.patch(
      `/locationInventory/updateReorderLevelMaxStockLevel/${locationId}/${itemMasterId}`,
      formData,
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
