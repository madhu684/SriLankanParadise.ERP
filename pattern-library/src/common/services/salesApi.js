import api from "common/utility/api";

//customer apis
export const post_customer_api = async (formData) => {
  try {
    const response = await api.post("/customer", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_customers_by_company_id_api = async (companyId) => {
  try {
    const response = await api.get(
      `/customer/GetCustomersByCompanyId/${companyId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_customers_by_customer_type_api = async (
  companyId,
  customerType,
) => {
  try {
    const response = await api.get(
      `/customer/GetCustomersByCustomerTypeCompanyId/${companyId}`,
      {
        params: { customerType },
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_all_customers_api = async () => {
  try {
    const response = await api.get("/customer");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const put_customer_api = async (customerId, formData) => {
  try {
    const response = await api.put(`/customer/${customerId}`, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const activate_deactivate_customer_api = async (
  customerId,
  formData,
) => {
  try {
    const response = await api.patch(
      `/customer/ActiveDeactiveUser/${customerId}`,
      formData,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_paginated_customers_by_companyId_api = async ({
  companyId,
  customerType,
  searchQuery,
  pageNumber = 1,
  pageSize = 10,
}) => {
  try {
    const params = {
      customerType,
      searchQuery,
      pageNumber,
      pageSize,
    };

    if (customerType) params.customerType = customerType;
    if (searchQuery) params.searchQuery = searchQuery;

    const response = await api.get(
      `/customer/GetPaginatedCustomersByCompanyId/${companyId}`,
      {
        params,
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching sales report:", error);
    throw error;
  }
};

export const search_customers_by_name_phone = async (searchQuery) => {
  try {
    const response = await api.get(
      `/customer/search-customers?searchTerm=${searchQuery}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//sales person apis
export const get_sales_persons_by_company_id_api = async (companyId) => {
  try {
    const response = await api.get(
      `/user/GetAllUsersByCompanyId/${companyId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_sales_persons_by_user_id_api = async (userId) => {
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

//sales order apis
export const get_sales_order_details_by_sales_order_id = async (
  salesOrderId,
) => {
  try {
    const response = await api.get(
      `/salesOrderDetail/GetSalesOrderDetailsBySalesOrderId/${salesOrderId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post_sales_order_api = async (formData) => {
  try {
    const response = await api.post("/salesOrder", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post_sales_order_detail_api = async (formData) => {
  try {
    const response = await api.post("/salesOrderDetail", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_sales_orders_api = async () => {
  try {
    const response = await api.get("/salesOrder");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_sales_orders_with_out_drafts_api = async (companyId) => {
  try {
    const response = await api.get(
      `/salesOrder/GetSalesOrdersWithoutDraftsByCompanyId/${companyId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_sales_orders_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/salesOrder/GetSalesOrdersByUserId/${userId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const put_sales_order_detail_api = async (
  salesOrderDetailId,
  salesOrderDetailData,
) => {
  try {
    const response = await api.put(
      `/salesOrderDetail/${salesOrderDetailId}`,
      salesOrderDetailData,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approve_sales_order_api = async (salesOrderId, approvalData) => {
  try {
    const response = await api.patch(
      `/salesOrder/approve/${salesOrderId}`,
      approvalData,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const put_sales_order_api = async (salesOrderId, salesOrderData) => {
  try {
    const response = await api.put(
      `/salesOrder/${salesOrderId}`,
      salesOrderData,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const delete_sales_order_detail_api = async (salesOrderDetailId) => {
  try {
    const response = await api.delete(
      `/salesOrderDetail/${salesOrderDetailId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const get_sales_orders_with_details_by_date_range = async (
  fromDate,
  toDate,
) => {
  try {
    const response = await api.get(
      `/salesOrder/SalesOrderDetailsByOrderDateRange?fromDate=${fromDate}&toDate=${toDate}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//sales invoice apis
export const post_sales_invoice_api = async (formData) => {
  try {
    const response = await api.post("/salesInvoice", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post_sales_invoice_detail_api = async (formData) => {
  try {
    const response = await api.post("/salesInvoiceDetail", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_sales_invoice_api = async () => {
  try {
    const response = await api.get("/salesInvoice");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_sales_invoices_with_out_drafts_api = async ({
  companyId,
  date,
  searchQuery,
  filter,
  status,
}) => {
  try {
    const params = {
      date,
      searchQuery,
      filter,
      status,
    };

    if (date) params.date = date;
    if (searchQuery) params.searchQuery = searchQuery;
    if (filter) params.filter = filter;
    if (status) params.status = status;

    const response = await api.get(
      `/salesInvoice/GetSalesInvoicesWithoutDraftsByCompanyId/${companyId}`,
      {
        params,
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_sales_invoices_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/salesInvoice/GetSalesInvoicesByUserId/${userId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const put_sales_invoice_detail_api = async (
  salesInvoiceDetailId,
  salesInvoiceDetailData,
) => {
  try {
    const response = await api.put(
      `/salesInvoiceDetail/${salesInvoiceDetailId}`,
      salesInvoiceDetailData,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approve_sales_invoice_api = async (
  salesInvoiceId,
  approvalData,
) => {
  try {
    const response = await api.patch(
      `/salesInvoice/approve/${salesInvoiceId}`,
      approvalData,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const put_sales_invoice_api = async (
  salesInvoiceId,
  salesInvoiceData,
) => {
  try {
    const response = await api.put(
      `/salesInvoice/${salesInvoiceId}`,
      salesInvoiceData,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const delete_sales_invoice_detail_api = async (salesInvoiceDetailId) => {
  try {
    const response = await api.delete(
      `/salesInvoiceDetail/${salesInvoiceDetailId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const delete_sales_invoice_api = async (salesInvoiceId) => {
  try {
    const response = await api.delete(`/salesInvoice/${salesInvoiceId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const get_paginated_sales_invoice_by_companyId = async ({
  companyId,
  date,
  searchQuery,
  filter,
  pageNumber = 1,
  pageSize = 10,
}) => {
  try {
    const params = {
      date,
      searchQuery,
      filter,
      pageNumber,
      pageSize,
    };

    if (date) params.date = date;
    if (searchQuery) params.searchQuery = searchQuery;
    if (filter) params.filter = filter;

    const response = await api.get(
      `/salesInvoice/PaginatedSalesInvoiceByCompanyId/${companyId}`,
      {
        params,
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//packing slips apis

export const get_packing_slips_details_by_packing_slip_id = async (
  packingSlipId,
) => {
  try {
    const response = await api.get(
      `/packingSlipDetail/GetPackingSlipDetailsByPackingSlipId/${packingSlipId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post_packing_slip_api = async (formData) => {
  try {
    const response = await api.post("/packingSlip", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post_packing_slip_detail_api = async (formData) => {
  try {
    const response = await api.post("/packingSlipDetail", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_packing_slips_api = async () => {
  try {
    const response = await api.get("/packingSlip");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_packing_slips_with_out_drafts_api = async (companyId) => {
  try {
    const response = await api.get(
      `/packingSlip/GetPackingSlipsWithoutDraftsByCompanyId/${companyId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_packing_slips_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/packingSlip/GetPackingSlipsByUserId/${userId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const put_packing_slip_detail_api = async (
  packingSlipDetailId,
  packingSlipDetailData,
) => {
  try {
    const response = await api.put(
      `/packingSlipDetail/${packingSlipDetailId}`,
      packingSlipDetailData,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approve_packing_slip_api = async (packingSlipId, approvalData) => {
  try {
    const response = await api.patch(
      `/packingSlip/approve/${packingSlipId}`,
      approvalData,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const put_packing_slip_api = async (packingSlipId, packingSlipData) => {
  try {
    const response = await api.put(
      `/packingSlip/${packingSlipId}`,
      packingSlipData,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const delete_packing_slip_detail_api = async (packingSlipDetailId) => {
  try {
    const response = await api.delete(
      `/packingSlipDetail/${packingSlipDetailId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//payment modes api
export const get_payment_modes_api = async (companyId) => {
  try {
    const response = await api.get(
      `/paymentMode/GetPaymentModesByCompanyId/${companyId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//sales receipt apis
export const post_sales_receipt_api = async (formData) => {
  try {
    const response = await api.post("/salesReceipt", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_sales_receipt_api = async () => {
  try {
    const response = await api.get("/salesReceipt");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_sales_receipts_with_out_drafts_api = async ({
  companyId,
  date,
  createdUserId,
  filter,
  searchQuery,
  pageNumber = 1,
  pageSize = 10,
}) => {
  const params = {
    date,
    createdUserId,
    filter,
    searchQuery,
    pageNumber,
    pageSize,
  };

  if (date) params.date = date;
  if (createdUserId) params.createdUserId = createdUserId;
  if (filter) params.filter = filter;
  if (searchQuery) params.searchQuery = searchQuery;

  try {
    const response = await api.get(
      `/salesReceipt/GetSalesReceiptsWithoutDraftsByCompanyId/${companyId}`,
      {
        params,
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_sales_receipts_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/salesReceipt/GetSalesReceiptsByUserId/${userId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_sales_receipts_by_cashier_session_id_api = async (
  sessionId,
) => {
  try {
    const response = await api.get(
      `/salesReceipt/GetSalesReceiptsBySessionId/${sessionId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const put_sales_receipt_api = async (
  salesReceiptId,
  salesReceiptData,
) => {
  try {
    const response = await api.put(
      `/salesReceipt/${salesReceiptId}`,
      salesReceiptData,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//SalesReceiptSalesInvoice apis
export const post_sales_receipt_sales_invoice_api = async (formData) => {
  try {
    const response = await api.post("/salesReceiptSalesInvoice", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const put_sales_receipt_sales_invoice_api = async (
  salesReceiptSalesInvoiceId,
  salesReceiptSalesInvoiceIdData,
) => {
  try {
    const response = await api.put(
      `/salesReceiptSalesInvoice/${salesReceiptSalesInvoiceId}`,
      salesReceiptSalesInvoiceIdData,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const delete_sales_receipt_sales_invoice_api = async (
  salesReceiptSalesInvoiceId,
) => {
  try {
    const response = await api.delete(
      `/salesReceiptSalesInvoice/${salesReceiptSalesInvoiceId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//cashier session apis
export const post_cashier_session_api = async (formData) => {
  try {
    const response = await api.post("/cashierSession", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const put_cashier_session_api = async (
  cashierSessionId,
  cashierSessionData,
) => {
  try {
    const response = await api.put(
      `/cashierSession/${cashierSessionId}`,
      cashierSessionData,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const get_cashier_session_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/cashierSession/GetActiveCashierSession/${userId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_cashier_session_by_user_date_api = async (userId, date) => {
  try {
    const response = await api.get(
      `/cashierSession/GetCashierSessionsByUserIdAndDate/${userId}/${date}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post_cashier_expense_out_api = async (formData) => {
  try {
    const response = await api.post("/cashierExpenseOut", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_cashier_expense_outs_by_userId_date_api = async (
  date,
  userId,
  cashierSessionId,
) => {
  const params = {
    userId,
    cashierSessionId,
  };

  if (userId) params.userId = userId;
  if (cashierSessionId) params.cashierSessionId = cashierSessionId;

  try {
    const response = await api.get(
      `/cashierExpenseOut/GetCashierExpenseOutsByUserIdDate/${date}`,
      {
        params,
        withCredentials: true,
      },
    );
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

//expense out requisition apis
export const post_expense_out_requisition_api = async (formData) => {
  try {
    const response = await api.post("/expenseOutRequisition", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_expense_out_requisitions_api = async (companyId) => {
  try {
    const response = await api.get(
      `/expenseOutRequisition/GetExpenseOutRequisitionsByCompanyId/${companyId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_approved_expense_out_requisitions = async (
  companyId,
  status,
  query,
) => {
  try {
    const response = await api.get(
      `/expenseOutRequisition/GetApprovedExpenseOutRequisitio/${companyId}/${status}?query=${query}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_expense_out_requisitions_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/expenseOutRequisition/GetExpenseOutRequisitionsByUserId/${userId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const put_expense_out_requisition_api = async (
  expenseOutRequisitionId,
  expenseOutRequisitionData,
) => {
  try {
    const response = await api.put(
      `/expenseOutRequisition/${expenseOutRequisitionId}`,
      expenseOutRequisitionData,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const get_cashier_expense_outs_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/cashierExpenseOut/GetCashierExpenseOutsByUserId/${userId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Sales Customers API
export const get_sales_customers_by_company_id_api = async (companyId) => {
  try {
    const response = await api.get(
      `/salesCustomer/GetByCompanyId/${companyId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
