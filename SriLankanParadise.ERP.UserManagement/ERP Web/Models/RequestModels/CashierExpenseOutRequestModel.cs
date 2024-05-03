namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class CashierExpenseOutRequestModel
    {
        public int? UserId { get; set; }

        public string? Description { get; set; }

        public decimal? Amount { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? CompanyId { get; set; }

        public int? ExpenseOutRequisitionId { get; set; }

        public int PermissionId { get; set; }
    }
}
