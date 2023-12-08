namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class SubModuleRequestModel
    {

        public string SubModuleName { get; set; } = null!;

        public bool Status { get; set; }

        public int? ModuleId { get; set; }

        public int PermissionId { get; set; }
    }
}
