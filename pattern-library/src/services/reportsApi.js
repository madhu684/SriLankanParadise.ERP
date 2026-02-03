import axios from "axios";

//Import url from config file
const baseUrl = process.env.REACT_APP_API_BASEURL;
const sublink = process.env.REACT_APP_API_SUBLINK;

export const API_BASE_URL = `${baseUrl}${sublink}`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const get_collection_report_by_date_user_api = async (
  userId,
  date,
  cashierSessionId,
) => {
  const params = {
    date,
    cashierSessionId,
  };
  if (date) params.date = date;
  if (cashierSessionId) params.cashierSessionId = cashierSessionId;

  try {
    const response = await api.get(`/report/CollectionReport/${userId}`, {
      params,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_manager_collection_report_api = async (date) => {
  try {
    const response = await api.get(`/report/ManagerCollectionReport`, {
      params: { date },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_customer_invoices_by_customer_date_api = async ({
  name,
  phone,
  fromDate,
  toDate,
  pageNumber = 1,
  pageSize = 10,
}) => {
  try {
    const params = {
      name,
      phone,
      fromDate,
      toDate,
      pageNumber,
      pageSize,
    };

    if (name) params.name = name;
    if (phone) params.phone = phone;
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    const response = await api.get(`/report/GetCustomerInvoices`, {
      params,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_min_report_api = async ({
  companyId,
  issueType,
  locationId,
  startDate,
  endDate,
  pageNumber = 1,
  pageSize = 10,
}) => {
  try {
    const params = {
      issueType,
      locationId,
      startDate,
      endDate,
      pageNumber,
      pageSize,
    };

    if (issueType) params.issueType = issueType;
    if (locationId) params.locationId = locationId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get(
      `/issueMaster/GetPaginatedIssueMastersByCompanyIdLocationDateRange/${companyId}`,
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
