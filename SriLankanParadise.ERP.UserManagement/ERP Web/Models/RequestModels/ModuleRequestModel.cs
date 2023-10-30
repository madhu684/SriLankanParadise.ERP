namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class ModuleRequestModel
    {
        public string ModuleName { get; set; } = null!;
        public bool Status { get; set; }
        public int PermissionId { get; set; }
    }
}
