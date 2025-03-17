namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class CompanySubscriptionModuleUserDto
    {
        public int CompanySubscriptionModuleIdUserId { get; set; }

        public int CompanySubscriptionModuleId { get; set; }

        public int UserId { get; set; }

        public CompanySubscriptionModuleDto CompanySubscriptionModule { get; set; } = null!;
    }
}
