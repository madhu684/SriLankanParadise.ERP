import axios from 'axios'

//Import url from config file
const baseUrl = process.env.REACT_APP_API_BASEURL
const baseUrl2 = process.env.REACT_APP_API_BASEURL2
const sublink = process.env.REACT_APP_API_SUBLINK

export const API_BASE_URL = `${baseUrl}${sublink}`

const api = axios.create({
  baseURL: API_BASE_URL,
})

//purchase requisition apis
export const post_purchase_requisition_api = async (formData) => {
  try {
    const response = await api.post('/purchaseRequisition', formData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_purchase_requisitions_api = async () => {
  try {
    const response = await api.get('/purchaseRequisition', {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_purchase_requisitions_with_out_drafts_api = async (
  companyId
) => {
  try {
    const response = await api.get(
      `/purchaseRequisition/GetPurchaseRequisitionsWithoutDraftsByCompanyId/${companyId}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_purchase_requisitions_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/purchaseRequisition/GetPurchaseRequisitionsByUserId/${userId}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const post_purchase_requisition_detail_api = async (formData) => {
  try {
    const response = await api.post('/purchaseRequisitionDetail', formData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

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
    )
    return response.data
  } catch (error) {
    throw error
  }
}

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
    )
    return response.data
  } catch (error) {
    throw error
  }
}

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
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const delete_purchase_requisition_detail_api = async (
  purchaseRequisitionDetailId
) => {
  try {
    const response = await api.delete(
      `/purchaseRequisitionDetail/${purchaseRequisitionDetailId}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    throw error
  }
}

//purchase order apis
export const post_purchase_order_api = async (formData) => {
  try {
    const response = await api.post('/purchaseOrder', formData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_purchase_order_api = async () => {
  try {
    const response = await api.get('/purchaseOrder')
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_purchase_orders_with_out_drafts_api = async (companyId) => {
  try {
    const response = await api.get(
      `/purchaseOrder/GetPurchaseOrdersWithoutDraftsByCompanyId/${companyId}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_purchase_orders_api = async (companyId) => {
  try {
    const response = await api.get(
      `/purchaseOrder/GetPurchaseOrdersByCompanyId/${companyId}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_purchase_orders_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/purchaseOrder/GetPurchaseOrdersByUserId/${userId}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const post_purchase_order_detail_api = async (formData) => {
  try {
    const response = await api.post('/purchaseOrderDetail', formData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

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
    )
    return response.data
  } catch (error) {
    throw error
  }
}

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
    )
    return response.data
  } catch (error) {
    throw error
  }
}

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
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const delete_purchase_order_detail_api = async (
  purchaseOrderDetailId
) => {
  try {
    const response = await api.delete(
      `/purchaseOrderDetail/${purchaseOrderDetailId}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    throw error
  }
}

//grn apis
export const post_grn_master_api = async (formData) => {
  try {
    const response = await api.post('/grnMaster', formData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_grn_master_api = async () => {
  try {
    const response = await api.get('/grnMaster')
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_grn_masters_with_out_drafts_api = async (companyId) => {
  try {
    const response = await api.get(
      `/grnMaster/GetGrnMastersWithoutDraftsByCompanyId/${companyId}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_grn_masters_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/grnMaster/GetGrnMastersByUserId/${userId}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const post_grn_detail_api = async (formData) => {
  try {
    const response = await api.post('/grnDetail', formData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const put_grn_detail_api = async (grnDetailId, grnDetailData) => {
  try {
    const response = await api.put(`/grnDetail/${grnDetailId}`, grnDetailData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const approve_grn_master_api = async (grnMasterId, approvalData) => {
  try {
    const response = await api.patch(
      `/grnMaster/approve/${grnMasterId}`,
      approvalData,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const put_grn_master_api = async (grnMasterId, grnMasterData) => {
  try {
    const response = await api.put(`/grnMaster/${grnMasterId}`, grnMasterData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const delete_grn_detail_api = async (grnDetailId) => {
  try {
    const response = await api.delete(`/grnDetail/${grnDetailId}`, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    throw error
  }
}

//company locations api
export const get_company_locations_api = async (companyId) => {
  try {
    const response = await api.get('/location/GetLocationsByCompanyId', {
      params: { companyId: companyId },
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

//company suppliers api
export const get_company_suppliers_api = async (companyId) => {
  try {
    const response = await api.get('/supplier/GetSuppliersByCompanyId', {
      params: { companyId: companyId },
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const post_supplier_api = async (formData) => {
  try {
    const response = await api.post('/supplier', formData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

//requisition master apis
export const post_requisition_master_api = async (formData) => {
  try {
    const response = await api.post('/requisitionMaster', formData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_requisitions_masters_api = async () => {
  try {
    const response = await api.get('/requisitionMaster', {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_requisition_masters_with_out_drafts_api = async (
  companyId
) => {
  try {
    const response = await api.get(
      `/requisitionMaster/GetRequisitionMastersWithoutDraftsByCompanyId/${companyId}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_requisition_masters_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/requisitionMaster/GetRequisitionMastersByUserId/${userId}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

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
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const post_requisition_detail_api = async (formData) => {
  try {
    const response = await api.post('/requisitionDetail', formData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

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
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const post_charges_and_deductions_applied_api = async (formData) => {
  try {
    const response = await api.post('/chargesAndDeductionApplied', formData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_transaction_types_api = async () => {
  try {
    const response = await api.get('./transactionType/GetTransactionTypes', {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

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
    )
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

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
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const delete_charges_and_deductions_applied_api = async (
  chargesAndDeductionAppliedId
) => {
  try {
    const response = await api.delete(
      `/chargesAndDeductionApplied/${chargesAndDeductionAppliedId}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const get_grn_masters_by_purchase_order_id_api = async (
  purchaseOrderId
) => {
  try {
    const response = await api.get(
      `/grnMaster/GetGrnMastersByPurchaseOrderId/${purchaseOrderId}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

//item batch apis
export const post_batch_api = async (formData) => {
  try {
    const response = await api.post('/batch', formData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const post_batchHasGrnMaster_api = async (formData) => {
  try {
    const response = await api.post('/batchHasGrnMaster', formData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const post_itemBatch_api = async (formData) => {
  try {
    const response = await api.post('/itemBatch', formData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const post_itemBatchHasGrnDetail_api = async (formData) => {
  try {
    const response = await api.post('/itemBatchHasGrnDetail', formData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_item_batches_api = async (companyId) => {
  try {
    const response = await api.get(
      `/itemBatch/GetItemBatchesByCompanyId/${companyId}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

//issue master apis
export const post_issue_master_api = async (formData) => {
  try {
    const response = await api.post('/issueMaster', formData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_issues_masters_api = async () => {
  try {
    const response = await api.get('/issueMaster', {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_issue_masters_with_out_drafts_api = async (companyId) => {
  try {
    const response = await api.get(
      `/issueMaster/GetIssueMastersWithoutDraftsByCompanyId/${companyId}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_issue_masters_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/issueMaster/GetIssueMastersByUserId/${userId}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const approve_issue_master_api = async (issueMasterId, approvalData) => {
  try {
    const response = await api.patch(
      `/issueMaster/approve/${issueMasterId}`,
      approvalData,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    throw error
  }
}

//patch_issue_detail_api
export const patch_issue_detail_api = async (issueMasterId, formData) => {
  try {
    const response = await api.patch(
      `/issueDetail/update-received-quantity/${issueMasterId}`,
      formData,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

//get issue details api
export const get_issue_details_api = async (issueMasterId) => {
  try {
    const response = await api.get(`/issueDetail/${issueMasterId}`, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const post_issue_detail_api = async (formData) => {
  try {
    const response = await api.post('/issueDetail', formData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_issue_masters_by_requisition_master_id_api = async (
  requisitionMasterId
) => {
  try {
    const response = await api.get(
      `/issueMaster/GetIssueMastersByRequisitionMasterId/${requisitionMasterId}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

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
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

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
    )
    return response.data
  } catch (error) {
    throw error
  }
}

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
    )
    return response.data
  } catch (error) {
    throw error
  }
}

//supplier ralated apis
export const get_company_types_api = async () => {
  try {
    const response = await api.get('/companyType', {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_business_types_api = async () => {
  try {
    const response = await api.get('/businessType', {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const post_supplier_logo_api = async (uploadData) => {
  try {
    const formData = new FormData()
    formData.append('permissionId', uploadData.permissionId)
    formData.append('logoFile', uploadData.logoFile)

    const response = await api.post('/supplier/upload/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    })

    return response.data
  } catch (error) {
    throw error
  }
}

export const post_supplier_attachment_api = async (uploadData) => {
  try {
    const formData = new FormData()
    formData.append('permissionId', uploadData.permissionId)
    formData.append('attachmentFile', uploadData.attachmentFile)

    const response = await api.post('/supplier/upload/attachment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    })

    return response.data
  } catch (error) {
    throw error
  }
}

export const post_supplier_category_api = async (formData) => {
  try {
    const response = await api.post('/supplierCategory', formData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const post_supplier_attachment_info_api = async (formData) => {
  try {
    const response = await api.post('/supplierAttachment', formData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_supplier_logo_api = async (supplierId) => {
  try {
    const response = await api.get(`/supplier/logo/${supplierId}`, {
      responseType: 'blob', // Specify response type as blob
      withCredentials: true,
    })

    // Convert blob to base64
    const logoBlob = response.data
    const reader = new FileReader()
    reader.readAsDataURL(logoBlob)

    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const logoSrc = reader.result
        resolve(logoSrc)
      }
      reader.onerror = (error) => {
        console.error('Error reading the logo blob:', error)
        reject(error)
      }
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const put_supplier_api = async (supplierId, supplierData) => {
  try {
    const response = await api.put(`/supplier/${supplierId}`, supplierData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const delete_supplier_category_api = async (supplierCategoryId) => {
  try {
    const response = await api.delete(
      `/supplierCategory/${supplierCategoryId}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    throw error
  }
}

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
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const delete_supplier_api = async (supplierId) => {
  try {
    const response = await api.delete(`/supplier/${supplierId}`, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    throw error
  }
}

//user location apis
export const get_user_locations_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/userLocation/GetUserLocationsByUserId/${userId}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

//location inventory apis
export const post_location_inventory_api = async (formData) => {
  try {
    const response = await api.post('/locationInventory', formData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const post_location_inventory_movement_api = async (formData) => {
  try {
    const response = await api.post('/locationInventoryMovement', formData, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const post_location_inventory_goods_in_transit_api = async (
  formData
) => {
  try {
    const response = await api.post(
      '/locationInventoryGoodsInTransit',
      formData,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const get_locations_inventories_by_location_id_api = async (
  locationId
) => {
  try {
    const response = await api.get(
      `/locationInventory/GetLocationInventoriesByLocationId/${locationId}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

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
    )
    return response.data
  } catch (error) {
    throw error
  }
}

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
    )
    return response.data
  } catch (error) {
    throw error
  }
}
