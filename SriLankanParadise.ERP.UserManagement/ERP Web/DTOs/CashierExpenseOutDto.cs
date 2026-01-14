namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class CashierExpenseOutDto
    {
        public int CashierExpenseOutId { get; set; }

        public int? UserId { get; set; }

        public string? Description { get; set; }

        public decimal? Amount { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? CompanyId { get; set; }

        public int? ExpenseOutRequisitionId { get; set; }

        public int? CashierSessionId { get; set; }
    }
}
