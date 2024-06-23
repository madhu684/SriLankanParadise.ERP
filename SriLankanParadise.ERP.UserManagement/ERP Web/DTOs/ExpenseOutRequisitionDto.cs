using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class ExpenseOutRequisitionDto
    {
        public int ExpenseOutRequisitionId { get; set; }

        public int? RequestedUserId { get; set; }

        public string? RequestedBy { get; set; }

        public string? Reason { get; set; }

        public decimal? Amount { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? LastUpdatedDate { get; set; }

        public string? ReferenceNumber { get; set; }

        public int? Status { get; set; }

        public string? ApprovedBy { get; set; }

        public int? ApprovedUserId { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public string? RecommendedBy { get; set; }

        public int? RecommendedUserId { get; set; }

        public DateTime? RecommendedDate { get; set; }

        public int? CompanyId { get; set; }

        public virtual ICollection<CashierExpenseOutDto>? CashierExpenseOuts { get; set; }
    }
}
