namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class CategoryRequestModel
    {
        public string? CategoryName { get; set; }

        public bool Status { get; set; }

        public int? CompanyId { get; set; }

        public bool IsTreatment { get; set; } = false;

        public int PermissionId { get; set; }
    }
}
