namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class ModuleWithIdDto
    {
        public int ModuleId { get; set; }
        public string ModuleName { get; set; } = null!;

        public bool Status { get; set; }

        public virtual IEnumerable<SubModuleDto?> SubModules { get; set; }
    }
}
