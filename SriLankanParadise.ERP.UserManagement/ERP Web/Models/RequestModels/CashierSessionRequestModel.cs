namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class CashierSessionRequestModel
    {
        public int? UserId { get; set; }

        public DateTime? SessionIn { get; set; }

        public DateTime? SessionOut { get; set; }

        public decimal? OpeningBalance { get; set; }

        public decimal? ClosingBalance { get; set; }

        public int? CompanyId { get; set; }

        public int PermissionId { get; set; }
    }
}
