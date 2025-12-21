using Newtonsoft.Json.Linq;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IAyuOMSService
    {
        Task<JArray> GetAppointmentScheduleByDateAsync(DateTime date);

        Task<JObject> GetAppointmentDetailsByIdAsync(int id);
    }
}
