import axios from "axios";

//Import url from config file
const baseUrl = process.env.REACT_APP_API_BASEURL;
const sublink = process.env.REACT_APP_API_SUBLINK;

export const API_BASE_URL = `${baseUrl}${sublink}`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const get_appointment_tokens_by_date_api = async (date) => {
  try {
    var response = await api.get(`/ayuOMS/GetTokensByDate?date=${date}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_appointment_by_id_api = async (id) => {
  try {
    var response = await api.get(`/ayuOMS/GetAppointmentById/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
