namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class CategoryRequestModel
    {
        public string? CategoryName { get; set; }

        public bool Status { get; set; }

        public int? CompanyId { get; set; }

        public int PermissionId { get; set; }
    }
}
