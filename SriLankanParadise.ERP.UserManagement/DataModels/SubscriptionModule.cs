using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class SubscriptionModule
{
    public int SubscriptionModuleId { get; set; }

    public int ModuleId { get; set; }

    public int SubscriptionId { get; set; }

    public decimal? ModulePricePerPlan { get; set; }

    public int? MaxUserCount { get; set; }

    public bool Status { get; set; }

    public virtual ICollection<CompanySubscriptionModule> CompanySubscriptionModules { get; set; } = new List<CompanySubscriptionModule>();

    public virtual Module Module { get; set; } = null!;

    public virtual Subscription Subscription { get; set; } = null!;
}
