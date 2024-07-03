namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class LocationRequestModel
    {
        public int CompanyId { get; set; }

        public string? LocationName { get; set; }

        public bool? Status { get; set; }

        public int? LocationTypeId { get; set; }

        public int? ParentId { get; set; }

        public int PermissionId { get; set; }
    }
}
