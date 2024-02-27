namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class PaymentModeDto
    {
        public int PaymentModeId { get; set; }

        public string? Mode { get; set; }

        public int? CompanyId { get; set; }

        public bool? Status { get; set; }
    }
}
