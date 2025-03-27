namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class SupplyReturnMasterRequestModel
    {
        public DateTime ReturnDate { get; set; }
        public int SupplierId { get; set; }
        public int? Status { get; set; }
        public string ReturnedBy { get; set; } = null!;
        public int ReturnedUserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ApprovedBy { get; set; } = null!;
        public int? ApprovedUserId { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public DateTime? LastUpdatedDate { get; set; }
        public int? CompanyId { get; set; }
    }
}
