using Newtonsoft.Json.Linq;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IAyuOMSService
    {
        Task<JArray> GetAppointmentScheduleByDateAsync(int companyId, DateTime date);
        Task<JObject> GetAppointmentDetailsByIdAsync(int companyId, int id);
    }
}
