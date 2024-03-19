namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class ChargesAndDeductionAppliedRequestModel
    {
        public int ChargesAndDeductionId { get; set; }

        public int? TransactionId { get; set; }

        public int? TransactionTypeId { get; set; }

        public int? LineItemId { get; set; }

        public decimal? AppliedValue { get; set; }

        public DateTime? DateApplied { get; set; }

        public string? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public string? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public bool? Status { get; set; }

        public int? CompanyId { get; set; }

        public int PermissionId { get; set; }
    }
}
