import api from "common/utility/api";

export const get_appointment_tokens_by_date_api = async (companyId, date) => {
  try {
    var response = await api.get(
      `/ayuOMS/GetTokensByDate?companyId=${companyId}&date=${date}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_appointment_by_id_api = async (companyId, id) => {
  try {
    var response = await api.get(
      `/ayuOMS/GetAppointmentById/${id}?companyId=${companyId}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
