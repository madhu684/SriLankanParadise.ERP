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
  cashierSessionId
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
