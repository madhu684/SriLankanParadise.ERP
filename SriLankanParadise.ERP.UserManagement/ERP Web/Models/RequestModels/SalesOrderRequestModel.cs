namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class SalesOrderRequestModel
    {
        public int? CustomerId { get; set; }

        public DateTime? OrderDate { get; set; }

        public DateTime? DeliveryDate { get; set; }

        public decimal? TotalAmount { get; set; }

        public int? Status { get; set; }

        public string? CreatedBy { get; set; }

        public int? CreatedUserId { get; set; }

        public string? ApprovedBy { get; set; }

        public int? ApprovedUserId { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public int? CompanyId { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? LastUpdatedDate { get; set; }

        public int PermissionId { get; set; }

        public int SalesPersonId { get; set; }

        public double? Latitude { get; set; }

        public double? Longitude { get; set; }

        public int InventoryLocationId { get; set; }

        public string CustomerPoNumber { get; set; }
    }
}
