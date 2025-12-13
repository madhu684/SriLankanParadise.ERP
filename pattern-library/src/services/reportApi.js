import axios from "axios";

//Import url from config file
const baseUrl = process.env.REACT_APP_API_BASEURL;
const sublink = process.env.REACT_APP_API_SUBLINK;

export const API_BASE_URL = `${baseUrl}${sublink}`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const get_sales_invoice_by_date_range_api = async ({
  fromDate,
  toDate,
  customerId = null,
  regionId = null,
  salesPersonId = null,
  pageNumber = 1,
  pageSize = 10,
}) => {
  try {
    const params = {
      fromDate,
      toDate,
      pageNumber,
      pageSize,
    };

    if (customerId) params.customerId = customerId;
    if (regionId) params.regionId = regionId;
    if (salesPersonId) params.salesPersonId = salesPersonId;

    const response = await api.get(`/report/GetSalesReportByDateRange`, {
      params,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching sales report:", error);
    throw error;
  }
};

export const get_age_analysis_report = async ({
  asOfDate = new Date().toISOString(),
  slabs = [
    { fromDays: 0, toDays: 30, label: "0-30 Days" },
    { fromDays: 31, toDays: 60, label: "31-60 Days" },
    { fromDays: 61, toDays: 90, label: "61-90 Days" },
    { fromDays: 91, toDays: 120, label: "91-120 Days" },
    { fromDays: 121, toDays: null, label: "Over 120 Days" },
  ],
  customerIds = null,
  regionIds = null,
  salesPersonIds = null,
  pageNumber = 1,
  pageSize = 20,
}) => {
  try {
    const payload = {
      asOfDate,
      slabs,
      pageNumber,
      pageSize,
    };

    // Only add arrays if they exist and have values
    if (customerIds && customerIds.length > 0)
      payload.customerIds = customerIds;
    if (regionIds && regionIds.length > 0) payload.regionIds = regionIds;
    if (salesPersonIds && salesPersonIds.length > 0)
      payload.salesPersonIds = salesPersonIds;

    const response = await api.post("/report/age-analysis", payload, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching age analysis report:", error);
    throw error;
  }
};
