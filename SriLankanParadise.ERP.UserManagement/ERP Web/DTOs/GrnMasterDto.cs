using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class GrnMasterDto
    {
        public int GrnMasterId { get; set; }

        public DateTime? GrnDate { get; set; }

        public string? ReceivedBy { get; set; }

        public DateTime? ReceivedDate { get; set; }

        public int? Status { get; set; }

        public int PurchaseOrderId { get; set; }

        public virtual PurchaseOrderDto? PurchaseOrder { get; set; }

        public int? CompanyId { get; set; }

        public int? ReceivedUserId { get; set; }

        public string? ApprovedBy { get; set; }

        public int? ApprovedUserId { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public decimal? TotalAmount { get; set; }

        public virtual IEnumerable<GrnDetailDto>? GrnDetails { get; set; }

    }
}
