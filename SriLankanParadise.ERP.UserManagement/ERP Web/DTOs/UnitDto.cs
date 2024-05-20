using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class UnitDto
    {
        public int UnitId { get; set; }

        public string? UnitName { get; set; }

        public bool? Status { get; set; }

        public int? CompanyId { get; set; }

        public int? MeasurementTypeId { get; set; }

        public virtual MeasurementTypeDto? MeasurementType { get; set; }
    }
}
