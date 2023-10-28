using Newtonsoft.Json;
using System.Net;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels
{
    public class ApiResponseModel
    {
        [JsonProperty(PropertyName = "data")]
        public dynamic Data { get; set; }

        public HttpStatusCode Status { get; set; }
        public string Message { get; set; }
    }
}
