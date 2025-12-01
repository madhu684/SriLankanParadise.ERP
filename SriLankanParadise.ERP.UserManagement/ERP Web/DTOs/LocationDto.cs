namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class LocationDto
    {
        public int LocationId { get; set; }

        public int CompanyId { get; set; }

        public string? LocationName { get; set; }

        public bool? Status { get; set; }

        public int? LocationTypeId { get; set; }

        public int? ParentId { get; set; }

        public int? PriceMasterId { get; set; }

        public string? Alias { get; set; }
        public virtual LocationTypeDto? LocationType { get; set; }

    }
}
