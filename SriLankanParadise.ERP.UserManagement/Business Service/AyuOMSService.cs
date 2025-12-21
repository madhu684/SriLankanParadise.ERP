using Newtonsoft.Json.Linq;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.Utility;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class AyuOMSService : IAyuOMSService
    {
        private readonly IHttpClientHelper _httpClientHelper;
        private readonly string _ayuOMSUrl;

        public AyuOMSService(IHttpClientHelper httpClientHelper, IConfiguration configuration)
        {
            _httpClientHelper = httpClientHelper;
            _ayuOMSUrl = configuration.GetValue<string>("AyuOMS:BaseUrl")
                ?? throw new InvalidOperationException("AyuOMS:BaseUrl configuration is missing");
        }

        public async Task<JObject> GetAppointmentDetailsByIdAsync(int id)
        {
            var endpoint = $"{_ayuOMSUrl}/api/AppointmentSchedule/{id}";

            var jsonString = await _httpClientHelper.GetStringAsync(endpoint);
            var result = JObject.Parse(jsonString);
            return result;
        }

        public async Task<JArray> GetAppointmentScheduleByDateAsync(DateTime date)
        {
            var dateString = date.ToString("yyyy-MM-dd");
            var endpoint = $"{_ayuOMSUrl}/api/AppointmentSchedule/tokensbydate?date={dateString}";

            var jsonString = await _httpClientHelper.GetStringAsync(endpoint);
            var result = JArray.Parse(jsonString);
            return result;
        }
    }
}
