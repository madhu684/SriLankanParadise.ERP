namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class SubModuleWithIdDto
    {
        public int SubModuleId { get; set; }

        public string SubModuleName { get; set; } = null!;

        public bool Status { get; set; }

        public int? ModuleId { get; set; }
    }
}
