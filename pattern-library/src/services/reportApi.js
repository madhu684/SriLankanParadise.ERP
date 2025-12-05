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

    // Optional filters
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
