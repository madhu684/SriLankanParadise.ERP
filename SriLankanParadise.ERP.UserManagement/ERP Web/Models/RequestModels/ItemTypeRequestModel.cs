namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class ItemTypeRequestModel
    {
        public string? Name { get; set; }

        public bool? Status { get; set; }

        public int? CompanyId { get; set; }

        public int PermissionId { get; set; }
    }
}
