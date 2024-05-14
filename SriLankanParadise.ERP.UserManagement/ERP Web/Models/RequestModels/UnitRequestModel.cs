namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class UnitRequestModel
    {
        public string? UnitName { get; set; }

        public bool? Status { get; set; }

        public int? CompanyId { get; set; }

        public int? MeasurementTypeId { get; set; }

        public int PermissionId { get; set; }
    }
}
