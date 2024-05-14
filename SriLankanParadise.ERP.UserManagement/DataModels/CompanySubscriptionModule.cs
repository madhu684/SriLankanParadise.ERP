using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class CompanySubscriptionModule
{
    public int CompanySubscriptionModuleId { get; set; }

    public int SubscriptionModuleId { get; set; }

    public int CompanyId { get; set; }

    public int UserCount { get; set; }

    public decimal Price { get; set; }

    public int? AddedUserCount { get; set; }

    public virtual Company Company { get; set; } = null!;

    public virtual ICollection<CompanySubscriptionModuleUser> CompanySubscriptionModuleUsers { get; set; } = new List<CompanySubscriptionModuleUser>();

    public virtual SubscriptionModule SubscriptionModule { get; set; } = null!;
}
