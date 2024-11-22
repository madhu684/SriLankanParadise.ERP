namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class CompanySubscriptionModuleUser
{
    public int CompanySubscriptionModuleIdUserId { get; set; }

    public int CompanySubscriptionModuleId { get; set; }

    public int UserId { get; set; }

    public virtual CompanySubscriptionModule CompanySubscriptionModule { get; set; } = null!;
}
