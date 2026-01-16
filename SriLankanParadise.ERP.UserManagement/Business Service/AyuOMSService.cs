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
        private readonly string _baseUrl;
        private readonly string _baseUrlSigiriya;

        public AyuOMSService(IHttpClientHelper httpClientHelper, IConfiguration configuration)
        {
            _httpClientHelper = httpClientHelper;

            _baseUrl = configuration.GetValue<string>("AyuOMS:BaseUrl")
                ?? throw new InvalidOperationException("AyuOMS:BaseUrl configuration is missing");

            _baseUrlSigiriya = configuration.GetValue<string>("AyuOMS:BaseUrlSigiriya")
                ?? throw new InvalidOperationException("AyuOMS:BaseUrlSigiriya configuration is missing");
        }

        //public async Task<JObject> GetAppointmentDetailsByIdAsync(int id)
        //{
        //    var endpoint = $"{_ayuOMSUrl}/api/AppointmentSchedule/{id}";

        //    var jsonString = await _httpClientHelper.GetStringAsync(endpoint);
        //    var result = JObject.Parse(jsonString);
        //    return result;
        //}
        public async Task<JObject> GetAppointmentDetailsByIdAsync(int companyId, int id)
        {
            string baseUrl = companyId switch
            {
                1 => _baseUrl,
                2 => _baseUrlSigiriya,
                _ => throw new ArgumentException($"Invalid companyId: {companyId}. Expected 1 or 2.")
            };

            var endpoint = $"{baseUrl}/api/AppointmentSchedule/{id}";

            var jsonString = await _httpClientHelper.GetStringAsync(endpoint);
            var result = JObject.Parse(jsonString);
            return result;
        }

        //public async Task<JArray> GetAppointmentScheduleByDateAsync(DateTime date)
        //{
        //    var dateString = date.ToString("yyyy-MM-dd");
        //    var endpoint = $"{_ayuOMSUrl}/api/AppointmentSchedule/tokensbydate?date={dateString}";

        //    var jsonString = await _httpClientHelper.GetStringAsync(endpoint);
        //    var result = JArray.Parse(jsonString);
        //    return result;
        //}
        public async Task<JArray> GetAppointmentScheduleByDateAsync(int companyId, DateTime date)
        {
            string baseUrl = companyId switch
            {
                1 => _baseUrl,
                2 => _baseUrlSigiriya,
                _ => throw new ArgumentException($"Invalid companyId: {companyId}. Expected 1 or 2.")
            };

            var dateString = date.ToString("yyyy-MM-dd");
            var endpoint = $"{baseUrl}/api/AppointmentSchedule/tokensbydate?date={dateString}";

            var jsonString = await _httpClientHelper.GetStringAsync(endpoint);
            var result = JArray.Parse(jsonString);
            return result;
        }
    }
}
