namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class PermissionRequestModel
    {
        public string PermissionName { get; set; } = null!;

        public bool PermissionStatus { get; set; }

        public int ModuleId { get; set; }

        public int? CompanyId { get; set; }

        public int PermissionRequestId { get; set; }
    }
}
