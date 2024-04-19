import axios from "axios";

//Import url from config file
const baseUrl = process.env.REACT_APP_API_BASEURL;
const baseUrl2 = process.env.REACT_APP_API_BASEURL2;
const sublink = process.env.REACT_APP_API_SUBLINK;

export const API_BASE_URL = `${baseUrl}${sublink}`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

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
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//sales order apis
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
      }
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
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const put_sales_order_detail_api = async (
  salesOrderDetailId,
  salesOrderDetailData
) => {
  try {
    const response = await api.put(
      `/salesOrderDetail/${salesOrderDetailId}`,
      salesOrderDetailData,
      {
        withCredentials: true,
      }
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
      }
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
      }
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
      }
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

export const get_sales_invoices_with_out_drafts_api = async (companyId) => {
  try {
    const response = await api.get(
      `/salesInvoice/GetSalesInvoicesWithoutDraftsByCompanyId/${companyId}`,
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

export const get_sales_invoices_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/salesInvoice/GetSalesInvoicesByUserId/${userId}`,
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

export const put_sales_invoice_detail_api = async (
  salesInvoiceDetailId,
  salesInvoiceDetailData
) => {
  try {
    const response = await api.put(
      `/salesInvoiceDetail/${salesInvoiceDetailId}`,
      salesInvoiceDetailData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approve_sales_invoice_api = async (
  salesInvoiceId,
  approvalData
) => {
  try {
    const response = await api.patch(
      `/salesInvoice/approve/${salesInvoiceId}`,
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

export const put_sales_invoice_api = async (
  salesInvoiceId,
  salesInvoiceData
) => {
  try {
    const response = await api.put(
      `/salesInvoice/${salesInvoiceId}`,
      salesInvoiceData,
      {
        withCredentials: true,
      }
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
      }
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
      }
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

export const get_sales_receipts_with_out_drafts_api = async (companyId) => {
  try {
    const response = await api.get(
      `/salesReceipt/GetSalesReceiptsWithoutDraftsByCompanyId/${companyId}`,
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

export const get_sales_receipts_by_user_id_api = async (userId) => {
  try {
    const response = await api.get(
      `/salesReceipt/GetSalesReceiptsByUserId/${userId}`,
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

export const put_sales_receipt_api = async (
  salesReceiptId,
  salesReceiptData
) => {
  try {
    const response = await api.put(
      `/salesReceipt/${salesReceiptId}`,
      salesReceiptData,
      {
        withCredentials: true,
      }
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
  salesReceiptSalesInvoiceIdData
) => {
  try {
    const response = await api.put(
      `/salesReceiptSalesInvoice/${salesReceiptSalesInvoiceId}`,
      salesReceiptSalesInvoiceIdData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const delete_sales_receipt_sales_invoice_api = async (
  salesReceiptSalesInvoiceId
) => {
  try {
    const response = await api.delete(
      `/salesReceiptSalesInvoice/${salesReceiptSalesInvoiceId}`,
      {
        withCredentials: true,
      }
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
  cashierSessionData
) => {
  try {
    const response = await api.put(
      `/cashierSession/${cashierSessionId}`,
      cashierSessionData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
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
