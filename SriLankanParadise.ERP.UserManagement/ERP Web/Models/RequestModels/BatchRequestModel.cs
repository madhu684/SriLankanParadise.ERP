namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class BatchRequestModel
    {
        public DateTime? Date { get; set; }

        public int? CompanyId { get; set; }

        public int PermissionId { get; set; }
    }
}
