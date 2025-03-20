using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class SupplyReturnMasterDto
    {
        public int SupplyReturnMasterId { get; set; }
        public DateTime ReturnDate { get; set; }
        public int SupplierId { get; set; }
        public int? Status { get; set; }
        public string ReturnedBy { get; set; }
        public int ReturnedUserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ApprovedBy { get; set; }
        public int? ApprovedUserId { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public DateTime? LastUpdatedDate { get; set; }
        public string? ReturnType { get; set; }
        public int? CompanyId { get; set; }
        public string? ReferenceNo { get; set; }
        public SupplierDto? Supplier { get; set; }
        public IEnumerable<SupplyReturnDetailDto>? SupplyReturnDetails { get; set; }
    }
}
