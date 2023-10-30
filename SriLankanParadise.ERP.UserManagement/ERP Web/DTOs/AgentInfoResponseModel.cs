using System.Net;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class AgentInfoResponseModel
    {
        public AgentInfoResponse Data { get; set; }
        public HttpStatusCode Status { get; set; }
    }

    public class AgentInfoResponse
    {
        public dynamic Result { get; set; }
    }
}
